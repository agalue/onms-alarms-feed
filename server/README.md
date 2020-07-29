Sample gRPC Server
====

Implements all the methods from the `AlarmLifecycleListener` service, and generates an alarm every 30 second for testing purposes.

Server starts listening on port 8080 (should match `envoy.xml`, otherwise, the ReactJS client won't work).

```bash
go run server.go
```