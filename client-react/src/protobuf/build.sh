#!/bin/bash

type protoc >/dev/null 2>&1 || { echo >&2 "protoc required but it's not installed; aborting."; exit 1; }
type protoc-gen-grpc-web >/dev/null 2>&1 || { echo >&2 "protoc-gen-grpc-web required but it's not installed; aborting."; exit 1; }

protoc -I ../../../protobuf/ ../../../protobuf/model.proto \
  --js_out=import_style=commonjs,binary:./oia

protoc -I ../../../protobuf/ ../../../protobuf/alarms.proto \
  --js_out=import_style=commonjs,binary:./oia \
  --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./oia

for f in ./oia/*.js
do
    echo '/* eslint-disable */' | cat - "${f}" > temp && mv temp "${f}"
done