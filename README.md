OpenNMS Alarms Feed
====

A test environment using the [OIA gRPC server](https://github.com/cgorantla/oia-grpc-server) with a web application implemented in RactJS that uses the `AlarmLifecycleListener` interface from the OpenNMS Integration API to display alarms.

The React Application from the `client-react` folder connects to [Envoy Proxy](https://www.envoyproxy.io/) on port 8000. Envoy listens on port 8000 for `grpc-web` requests, and then translates and forwards proper HTTP2/gRPC requests to the Server running on port 8991. The server is a `KAR` bundle installed in OpenNMS.

The following explains 2 ways to start the test environment.

## [1] Run all in Docker

To start the environment:

```bash
docker-compose up -d --build
```

The OpenNMS WebUI is exposed on port `8981`. Open `http://localhost:8981` on your browser.

The ReactJS application is exposed on port `3000`. Open `http://localhost:3000` on your browser.

## [2] Run locally on your PC

This requires to have [NodeJS](https://nodejs.org/en/) and [Envoy Proxy](https://www.envoyproxy.io/) installed on your machine.

On one tab start Envoy:

```bash
envoy -c envoy.local.yaml
```

On another tab, start OpenNMS/PostgreSQL. I use Docker:

```bash
docker-compose -f docker-compose.local.yaml up -d
```

> If you don't want to use Docker, make sure to install the `kar` on the `deploy` directory as you can see inside the `opennms-overlay` directory, and use latest compilation of `develop` or latest RPMs from `bleeding` repository.

Wait until OpenNMS is started. Use `docker-compose ps` to check the status.

Finally, start the ReactJS application:

```
cd client-react
npm install
npm start
```

## Test Integation

Once you have the environment running, from the OpenNMS container:

```bash
docker-compose exec opennms-oia bash
```

Add a node to the inventory:

```bash
NODE_IP=192.168.0.18
bin/provision.pl requisition add Test
bin/provision.pl node add Test node01 node01
bin/provision.pl interface add Test node01 $NODE_IP
bin/provision.pl interface set Test node01 $NODE_IP snmp-primary P
bin/provision.pl requisition import Test
```

Find the node ID

```bash
NODE_ID=$(curl -u admin:admin -H "Accept: application/json" "http://localhost:8980/opennms/rest/nodes?label=node01" 2>/dev/null | jq -r ".node[0].id")
```

> Make sure the environment variable has a numeric value. If not, wait and try again.

Use `send-event.pl` from within the OpenNMS container to trigger some alarms; for instance:

```
bin/send-event.pl -n $NODE_ID -i $NODE_IP -s SNMP uei.opennms.org/nodes/nodeLostService
sleep 10
bin/send-event.pl -n $NODE_ID -i $NODE_IP -s SNMP uei.opennms.org/nodes/nodeRegainedService
```

Check the ReactJS application to see how it updates auto-magically.

To stop the environment:

```bash
docker-compose down -v
```

## Mock Server/Client

This requires to have [Go](https://golang.org/dl/) installed on your machine

To start the mock gRPC server:
```
cd server
go run server.go -port 8080
```

To start the gRPC client

```
cd client
go run client.go -bootstrap 127.0.0.1:8080
```

> Note that the client can connect to the dockerized environment on port 8991.
