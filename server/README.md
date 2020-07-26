Sample gRPC Server
====

Implements `HandleNewOrUpdatedAlarm` from `AlarmLifecycleListener`, and generates an alarm every 30 second for testing purposes.

Server starts listening on port 8080.

```bash
go run server.go
```