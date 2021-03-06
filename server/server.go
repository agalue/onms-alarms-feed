package main

import (
	"flag"
	"fmt"
	"math/rand"
	"net"
	"os"
	"os/signal"
	"time"

	"github.com/agalue/onms-alarms-feed/protobuf/oia"
	"go.uber.org/zap"
	"google.golang.org/grpc"
)

var (
	mockIndex  uint64
	mockAlarms []*oia.Alarm
	mockNodes  []*oia.Node
)

////// gRPC Server //////

// Server represents the OIA gRPC Implementation for the AlarmLifecycleListener
type Server struct {
	Log *zap.SugaredLogger
}

// HandleAlarmSnapshot periodically send the state of the alarms in the database.
func (srv *Server) HandleAlarmSnapshot(empty *oia.Empty, stream oia.AlarmLifecycleListener_HandleAlarmSnapshotServer) error {
	for {
		stream.Send(&oia.AlarmsList{
			Alarms: mockAlarms,
		})
		time.Sleep(30 * time.Second)
	}
}

// HandleNewOrUpdatedAlarm invoked when an alarm is created or updated.
func (srv *Server) HandleNewOrUpdatedAlarm(empty *oia.Empty, stream oia.AlarmLifecycleListener_HandleNewOrUpdatedAlarmServer) error {
	for {
		node := getMockNode()
		// Send Trigger
		trigger := createMockAlarm(node,
			oia.AlarmType_PROBLEM_WITH_CLEAR,
			oia.Severity_MINOR,
			"uei.opennms.org/grpc/problem",
			"Something wrong happened",
			"Make sure everything is OK",
		)
		srv.send(trigger, stream)
		// Send Rearm after a random amount of time
		go func() {
			time.Sleep(time.Duration(20+rand.Intn(60)) * time.Second)
			rearm := createMockAlarm(node,
				oia.AlarmType_CLEAR,
				oia.Severity_NORMAL,
				"uei.opennms.org/grpc/problemSolved",
				"Everything is awesome",
				"Fortunately, the team has solved the problem",
			)
			srv.send(rearm, stream)
			// Update severity of the cleared alarm
			trigger.Severity = oia.Severity_CLEARED
			srv.send(trigger, stream)
		}()
		time.Sleep(30 * time.Second)
	}
}

// HandleDeletedAlarm invoked when an alarm is deleted.
func (srv *Server) HandleDeletedAlarm(empty *oia.Empty, stream oia.AlarmLifecycleListener_HandleDeletedAlarmServer) error {
	for {
		time.Sleep(60 * time.Second)
		srv.Log.Infof("Running cleanup")
		tmp := mockAlarms[:0]
		for _, alarm := range mockAlarms {
			if alarm.Severity.Number() <= oia.Severity_NORMAL.Number() {
				deletedAlarm := &oia.DeleteAlarm{
					Id:           alarm.Id,
					ReductionKey: alarm.ReductionKey,
				}
				if err := stream.Send(deletedAlarm); err == nil {
					srv.Log.Infof("Delete alarm %s with ID %d", alarm.ReductionKey, alarm.Id)
				} else {
					srv.Log.Errorf("Cannot send deleted alarm: %v", err)
				}
			} else {
				tmp = append(tmp, alarm)
			}
		}
		mockAlarms = tmp
	}
}

func (srv *Server) send(alarm *oia.Alarm, stream oia.AlarmLifecycleListener_HandleNewOrUpdatedAlarmServer) {
	if err := stream.Send(alarm); err == nil {
		srv.Log.Infof("Send alarm %s with ID %d and severity %s", alarm.ReductionKey, alarm.Id, alarm.Severity.String())
	} else {
		srv.Log.Errorf("Cannot send alarm: %v", err)
	}
}

////// Helper Methods //////

func initMockNodes(requisition string, total uint64) {
	if mockNodes == nil {
		for i := uint64(1); i < total; i++ {
			mockNodes = append(mockNodes, &oia.Node{
				Id:            i,
				ForeignSource: requisition,
				ForeignId:     fmt.Sprintf("server%d", i),
				Label:         fmt.Sprintf("srv%d.example.com", i),
				IpInterfaces: []*oia.IPInterface{
					{
						IpAddress: fmt.Sprintf("10.0.0.%d", i),
						SnmpInterface: &oia.SNMPInterface{
							IfIndex: 1,
							IfName:  "eth0",
							IfDescr: "eth0",
						},
					},
				},
			})
		}
	}
}

func createMockAlarm(node *oia.Node, atype oia.AlarmType, severity oia.Severity, uei string, logmsg string, descr string) *oia.Alarm {
	mockIndex++
	event := &oia.DatabaseEvent{
		Id:  mockIndex,
		Uei: uei,
		Parameters: []*oia.EventParameter{
			{
				Name:  "department",
				Value: "IT",
			},
		},
	}
	mockIndex++
	alarm := &oia.Alarm{
		Id:             mockIndex,
		ReductionKey:   fmt.Sprintf("%s::%d", uei, node.Id),
		FirstEventTime: uint64(time.Now().Unix() * 1000),
		LastEventTime:  uint64(time.Now().Unix() * 1000),
		Node:           node,
		LastEvent:      event,
		Type:           atype,
		Severity:       severity,
		LogMessage:     logmsg,
		Description:    descr,
	}
	mockAlarms = append(mockAlarms, alarm)
	return alarm
}

func getMockNode() *oia.Node {
	if mockNodes == nil {
		return nil
	}
	return mockNodes[rand.Intn(len(mockNodes))]
}

////// Main Method //////

func main() {
	logger, _ := zap.NewDevelopment()
	log := logger.Sugar()

	port := flag.Int("port", 8080, "gRPC server port")
	flag.Parse()

	rand.Seed(time.Now().Unix())
	initMockNodes("Servers", uint64(10))

	log.Infof("Starting server at port %d", *port)
	lis, err := net.Listen("tcp", fmt.Sprintf("0.0.0.0:%d", *port))

	if err != nil {
		log.Fatalf("Error while listening : %v", err)
	}

	s := grpc.NewServer()
	oia.RegisterAlarmLifecycleListenerServer(s, &Server{Log: log})

	go func() {
		if err := s.Serve(lis); err != nil {
			log.Fatalf("Error while serving : %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	<-stop
	log.Warnf("Terminating")
	s.Stop()
}
