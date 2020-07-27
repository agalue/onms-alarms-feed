package main

import (
	"context"
	"log"
	"sync"

	"github.com/agalue/onms-alarms-feed/protobuf/oia"
	"google.golang.org/grpc"
)

func main() {
	conn, err := grpc.Dial("127.0.0.1:8000", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Error while connecting: %v", err)
	}
	defer conn.Close()
	client := oia.NewAlarmLifecycleListenerClient(conn)

	list, err := client.HandleAlarmSnapshot(context.Background(), &oia.Empty{})
	if err != nil {
		log.Fatalf("Error while creating handler: %v", err)
	}
	for _, alarm := range list.Alarms {
		log.Printf("Loaded alarm %s with ID %d and severity %s", alarm.ReductionKey, alarm.Id, alarm.Severity.String())
	}

	wg := &sync.WaitGroup{}
	wg.Add(2)

	go func(wg *sync.WaitGroup) {
		defer wg.Done()
		handler, err := client.HandleNewOrUpdatedAlarm(context.Background(), &oia.Empty{})
		if err != nil {
			log.Printf("Error while creating handler: %v", err)
			return
		}
		for {
			if alarm, err := handler.Recv(); err == nil {
				log.Printf("Received alarm %s with ID %d and severity %s", alarm.ReductionKey, alarm.Id, alarm.Severity.String())
			} else {
				log.Printf("Error while getting alarm list: %v", err)
				return
			}
		}
	}(wg)

	go func(wg *sync.WaitGroup) {
		defer wg.Done()
		handler, err := client.HandleDeletedAlarm(context.Background(), &oia.Empty{})
		if err != nil {
			log.Printf("Error while creating handler: %v", err)
			return
		}
		for {
			if alarm, err := handler.Recv(); err == nil {
				log.Printf("Deleted alarm %s with ID %d", alarm.ReductionKey, alarm.Id)
			} else {
				log.Printf("Error while getting alarm list: %v", err)
				return
			}
		}
	}(wg)

	wg.Wait()
}
