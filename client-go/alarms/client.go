package main

import (
	"context"
	"encoding/json"
	"flag"
	"log"
	"sync"

	"github.com/agalue/onms-alarms-feed/protobuf/oia"
	"google.golang.org/grpc"
)

func displayAlarm(prefix string, alarm *oia.Alarm) {
	bytes, _ := json.MarshalIndent(alarm, "", "  ")
	log.Printf("%s:\n%s", prefix, string(bytes))
}

func displayDeletedAlarm(prefix string, alarm *oia.DeleteAlarm) {
	bytes, _ := json.MarshalIndent(alarm, "", "  ")
	log.Printf("%s:\n%s", prefix, string(bytes))
}

func main() {
	bootstrap := flag.String("bootstrap", "127.0.0.1:8991", "gRPC server connection string")
	flag.Parse()

	conn, err := grpc.Dial(*bootstrap, grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Error while connecting: %v", err)
	}
	defer conn.Close()
	client := oia.NewAlarmLifecycleListenerClient(conn)

	// Retrieve list of current alarms

	handler, err := client.HandleAlarmSnapshot(context.Background(), &oia.Empty{})
	if err != nil {
		log.Fatalf("Error while creating HandleAlarmSnapshot: %v", err)
	}
	if alarmList, err := handler.Recv(); err == nil {
		for _, alarm := range alarmList.Alarms {
			displayAlarm("From HandleAlarmSnapshot", alarm)
		}
	} else {
		log.Printf("Error while getting alarms snapshot: %v", err)
		return
	}

	wg := &sync.WaitGroup{}
	wg.Add(2)

	// Start handler for new or updated alarms

	go func(wg *sync.WaitGroup) {
		defer wg.Done()
		handler, err := client.HandleNewOrUpdatedAlarm(context.Background(), &oia.Empty{})
		if err != nil {
			log.Printf("Error while creating HandleNewOrUpdatedAlarm: %v", err)
			return
		}
		for {
			if alarm, err := handler.Recv(); err == nil {
				displayAlarm("From HandleNewOrUpdatedAlarm", alarm)
			} else {
				log.Printf("Error while getting alarm list: %v", err)
				return
			}
		}
	}(wg)

	// Start handler for deleted alarms

	go func(wg *sync.WaitGroup) {
		defer wg.Done()
		handler, err := client.HandleDeletedAlarm(context.Background(), &oia.Empty{})
		if err != nil {
			log.Printf("Error while creating HandleDeletedAlarm: %v", err)
			return
		}
		for {
			if alarm, err := handler.Recv(); err == nil {
				displayDeletedAlarm("From HandleNewOrUpdatedAlarm", alarm)
			} else {
				log.Printf("Error while getting alarm list: %v", err)
				return
			}
		}
	}(wg)

	wg.Wait()
}
