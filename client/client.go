package main

import (
	"context"
	"encoding/json"
	"log"

	"github.com/agalue/onms-alarms-feed/protobuf/oia"
	"google.golang.org/grpc"
)

// Client represents an AlarmLifecycleListener consumer
type Client struct{}

func main() {
	conn, err := grpc.Dial("127.0.0.1:8000", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Error while connecting: %v", err)
	}
	defer conn.Close()
	client := oia.NewAlarmLifecycleListenerClient(conn)
	handler, err := client.HandleNewOrUpdatedAlarm(context.Background(), &oia.Empty{})
	if err != nil {
		log.Fatalf("Error while creating handler: %v", err)
	}
	for {
		if alarm, err := handler.Recv(); err == nil {
			bytes, _ := json.MarshalIndent(alarm, "", "  ")
			log.Printf("Received alarm: %s", string(bytes))
		} else {
			log.Printf("Error while getting alarm list")
		}
	}
}
