Sample gRPC Client
====

Creates a client for all exposed method from the `EventListener` service and logs received events on standard output.

```bash
go run client.go -bootstrap 127.0.0.1:8991
```

> `127.0.0.1:8991` would be the address and port of the gRPC server.