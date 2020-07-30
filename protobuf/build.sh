#!/bin/bash

type protoc >/dev/null 2>&1 || { echo >&2 "protoc required but it's not installed; aborting."; exit 1; }
type protoc-gen-go >/dev/null 2>&1 || { echo >&2 "protoc-gen-go required but it's not installed; aborting."; exit 1; }

protoc -I . ./model.proto --go_out=./oia
protoc -I . ./alarms.proto --go_out=plugins=grpc:./oia
protoc -I . ./events.proto --go_out=plugins=grpc:./oia
