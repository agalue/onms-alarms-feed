OpenNMS Alarms Feed
====

Sample gRPC server and client implemented in Go that emulates to provides a mock implementation over the `AlarmLifecycleListener` interface from the OpenNMS Integration API.

Requires [Envoy Proxy](https://www.envoyproxy.io/) up and running using the provided `envoy.yaml`.

The React Application from the `client-react` folder connects to Envoy on port 8000. Envoy listen on port 8000 and forward proper HTTP2/gRPC requests to the Server running on port 8080.

Have 3 shell sessions and run the following on each of them:

To start the gRPC server (listens on port 8080 by default):
```
cd server
go run server.go
```

To start envoy (redirects traffic from port 8000 to port 8080)

```
envoy -c envoy.yaml
```

To start the gRPC web client (connects to gRPC server via proxy on port 8000)

```
cd client-react
npm start
```

> Open your browser and access the application at `localhost:3000`

Optionally, to start the Go client (connects directly to the server on port 8080)

```
cd client
go run client.go
```