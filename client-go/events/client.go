package main

import (
	"context"
	"encoding/json"
	"flag"
	"io"
	"os"
	"os/signal"
	"time"

	"github.com/agalue/onms-alarms-feed/protobuf/oia"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"google.golang.org/grpc/status"
)

var log *zap.SugaredLogger

var client oia.EventListenerClient
var handler oia.EventListener_OnEventClient

func startEventListener() error {
	var err error

	handler, err = client.OnEvent(context.Background(), &oia.EventListenerId{Name: "go-client"})
	if err != nil {
		return err
	}

	go func() {
		for {
			if event, err := handler.Recv(); err == nil {
				bytes, _ := json.MarshalIndent(event, "", "  ")
				log.Infof("Received event: %s", string(bytes))
				if err == io.EOF {
					break
				}
				errStatus, _ := status.FromError(err)
				if errStatus.Code().String() != "Unavailable" {
					log.Errorf("Cannot receive event: %v", err)
				}
			}
		}
		log.Warnf("OnEvent stream terminated")
	}()

	return nil
}

func main() {
	logger, _ := zap.NewDevelopment()
	log = logger.Sugar()

	bootstrap := flag.String("bootstrap", "127.0.0.1:8991", "gRPC server connection string")
	flag.Parse()

	log.Infof("Connecting to %s", *bootstrap)
	conn, err := grpc.Dial(*bootstrap, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("Error while connecting: %v", err)
	}

	client = oia.NewEventListenerClient(conn)

	if err := startEventListener(); err != nil {
		log.Fatalf("Error while creating OnEvent: %v", err)
	}

	go func() {
		<-handler.Context().Done()
		for {
			if err := startEventListener(); err == nil {
				log.Warn("Event listener restarted")
				return
			}
			time.Sleep(5 * time.Second)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	<-stop
	log.Warnf("Terminating")
	if handler != nil {
		handler.CloseSend()
	}
	conn.Close()
}
