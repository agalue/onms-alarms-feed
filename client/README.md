Sample gRPC Client
====

Creates a client for all exposed method from the `AlarmLifecycleListener` service and logs received alarms on standard output.

Server listen for requests on port 8080 (should match `envoy.xml`, even if the client is connected directly to the server).

```bash
go run client.go
```
