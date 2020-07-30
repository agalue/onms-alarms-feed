package main

import (
	"context"
	"encoding/json"
	"flag"
	"log"

	"github.com/agalue/onms-alarms-feed/protobuf/oia"
	"google.golang.org/grpc"
)

func main() {
	bootstrap := flag.String("bootstrap", "127.0.0.1:8991", "gRPC server connection string")
	flag.Parse()

	conn, err := grpc.Dial(*bootstrap, grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Error while connecting: %v", err)
	}
	defer conn.Close()
	client := oia.NewEventListenerClient(conn)

	handler, err := client.OnEvent(context.Background(), &oia.EventListenerId{Name: "go-client"})
	if err != nil {
		log.Fatalf("Error while creating OnEvent: %v", err)
	}
	for {
		if event, err := handler.Recv(); err == nil {
			bytes, _ := json.MarshalIndent(event, "", "  ")
			log.Println(string(bytes))
		} else {
			log.Printf("Error while getting alarm list: %v", err)
			return
		}
	}
}
