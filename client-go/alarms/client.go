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

var client oia.AlarmLifecycleListenerClient
var updatedStream oia.AlarmLifecycleListener_HandleNewOrUpdatedAlarmClient
var deletedStream oia.AlarmLifecycleListener_HandleDeletedAlarmClient

func startUpdatedStream() error {
	var err error

	if updatedStream != nil {
		updatedStream.CloseSend()
	}

	updatedStream, err = client.HandleNewOrUpdatedAlarm(context.Background(), &oia.Empty{})
	if err != nil {
		return err
	}

	go func() {
		for {
			if updatedStream == nil {
				break
			}
			if alarm, err := updatedStream.Recv(); err == nil {
				bytes, _ := json.MarshalIndent(alarm, "", "  ")
				log.Infof("alarm added or updated: %s", string(bytes))
				continue
			} else {
				if err == io.EOF {
					break
				}
				errStatus, _ := status.FromError(err)
				if errStatus.Code().String() != "Unavailable" {
					log.Errorf("Cannot receive alarm details: %v", err)
				}
			}
		}
		log.Warnf("New/Update stream terminated")
	}()

	return nil
}

func startDeletedStream() error {
	var err error

	if deletedStream != nil {
		deletedStream.CloseSend()
	}

	deletedStream, err = client.HandleDeletedAlarm(context.Background(), &oia.Empty{})
	if err != nil {
		return err
	}

	go func() {
		for {
			if deletedStream == nil {
				break
			}
			if alarm, err := deletedStream.Recv(); err == nil {
				bytes, _ := json.MarshalIndent(alarm, "", "  ")
				log.Infof("alarm deleted: %s", string(bytes))
				continue
			} else {
				if err == io.EOF {
					break
				}
				errStatus, _ := status.FromError(err)
				if errStatus.Code().String() != "Unavailable" {
					log.Errorf("Cannot receive alarm deleted details: %v", err)
				}
			}
		}
		log.Warnf("Delete stream terminated")
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
	defer conn.Close()

	client = oia.NewAlarmLifecycleListenerClient(conn)

	// Start handler for new/updated alarms

	if err := startUpdatedStream(); err != nil {
		log.Fatalf("Cannot create HandleNewOrUpdatedAlarm: %v", err)
	}

	go func() {
		<-updatedStream.Context().Done()
		for {
			if err := startUpdatedStream(); err == nil {
				log.Warn("New/Update stream restarted")
				return
			}
			time.Sleep(5 * time.Second)
		}
	}()

	// Start handler for deleted alarms

	if err := startDeletedStream(); err != nil {
		log.Fatalf("Cannot create HandleDeletedAlarm: %v", err)
	}

	go func() {
		<-deletedStream.Context().Done()
		for {
			if err := startDeletedStream(); err == nil {
				log.Warn("Delete stream restarted")
				return
			}
			time.Sleep(5 * time.Second)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	<-stop
	log.Warnf("Terminating")
	if updatedStream != nil {
		updatedStream.CloseSend()
	}
	if deletedStream != nil {
		deletedStream.CloseSend()
	}
}
