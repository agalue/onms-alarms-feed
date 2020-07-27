package main

import (
	"context"
	"encoding/json"
	"log"
	"net"
	"time"

	"github.com/agalue/onms-alarms-feed/protobuf/oia"
	"google.golang.org/grpc"
)

// Server represents the OIA gRPC Implementation for the AlarmLifecycleListener
type Server struct{}

// HandleAlarmSnapshot periodically invoked with the complete list of alarms as stored in the database.
func (srv *Server) HandleAlarmSnapshot(context.Context, *oia.Empty) (*oia.AlarmsList, error) {
	return nil, nil
}

// HandleNewOrUpdatedAlarm invoked when an alarm is created or updated.
func (srv *Server) HandleNewOrUpdatedAlarm(empty *oia.Empty, stream oia.AlarmLifecycleListener_HandleNewOrUpdatedAlarmServer) error {
	id := uint64(100)
	for {
		uei := "uei.opennms.org/grpc/test"
		node := &oia.Node{
			Id:            66,
			ForeignSource: "Test",
			ForeignId:     "srv01",
			Label:         "srv01.example.com",
			IpInterfaces: []*oia.IPInterface{
				{
					IpAddress: "10.0.0.1",
				},
			},
		}
		event := &oia.DatabaseEvent{
			Id:  id,
			Uei: uei,
			Parameters: []*oia.EventParameter{
				{
					Name:  "owner",
					Value: "agalue",
				},
			},
		}
		id++
		alarm := &oia.Alarm{
			Id:             id,
			ReductionKey:   uei,
			FirstEventTime: uint64(time.Now().Unix()),
			LastEventTime:  uint64(time.Now().Unix()),
			Node:           node,
			LastEvent:      event,
			Type:           oia.AlarmType_PROBLEM_WITHOUT_CLEAR,
			Severity:       oia.Severity_MINOR,
			LogMessage:     "Something wrong happened",
			Description:    "Make sure everything is OK",
		}
		id++
		if err := stream.Send(alarm); err == nil {
			bytes, _ := json.MarshalIndent(alarm, "", "  ")
			log.Printf("Alarm sent: %s", string(bytes))
		} else {
			log.Printf("Error while sending alarm: %v", err)
		}
		time.Sleep(30 * time.Second)
	}
}

// HandleDeletedAlarm invoked when an alarm is deleted.
func (srv *Server) HandleDeletedAlarm(empty *oia.Empty, stream oia.AlarmLifecycleListener_HandleDeletedAlarmServer) error {
	return nil
}

func main() {
	lis, err := net.Listen("tcp", "0.0.0.0:8080")

	if err != nil {
		log.Fatalf("Error while listening : %v", err)
	}

	s := grpc.NewServer()
	oia.RegisterAlarmLifecycleListenerServer(s, &Server{})

	if err := s.Serve(lis); err != nil {
		log.Fatalf("Error while serving : %v", err)
	}
}
