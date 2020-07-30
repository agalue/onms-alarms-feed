/* eslint-disable */
/**
 * @fileoverview gRPC-Web generated client stub for oia
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');


var model_pb = require('./model_pb.js')
const proto = {};
proto.oia = require('./events_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.oia.EventForwarderClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.oia.EventForwarderPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.oia.InMemoryEvent,
 *   !proto.oia.Empty>}
 */
const methodDescriptor_EventForwarder_SendAsync = new grpc.web.MethodDescriptor(
  '/oia.EventForwarder/SendAsync',
  grpc.web.MethodType.UNARY,
  model_pb.InMemoryEvent,
  model_pb.Empty,
  /**
   * @param {!proto.oia.InMemoryEvent} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  model_pb.Empty.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.oia.InMemoryEvent,
 *   !proto.oia.Empty>}
 */
const methodInfo_EventForwarder_SendAsync = new grpc.web.AbstractClientBase.MethodInfo(
  model_pb.Empty,
  /**
   * @param {!proto.oia.InMemoryEvent} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  model_pb.Empty.deserializeBinary
);


/**
 * @param {!proto.oia.InMemoryEvent} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.oia.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.oia.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.oia.EventForwarderClient.prototype.sendAsync =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/oia.EventForwarder/SendAsync',
      request,
      metadata || {},
      methodDescriptor_EventForwarder_SendAsync,
      callback);
};


/**
 * @param {!proto.oia.InMemoryEvent} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.oia.Empty>}
 *     A native promise that resolves to the response
 */
proto.oia.EventForwarderPromiseClient.prototype.sendAsync =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/oia.EventForwarder/SendAsync',
      request,
      metadata || {},
      methodDescriptor_EventForwarder_SendAsync);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.oia.InMemoryEvent,
 *   !proto.oia.Ack>}
 */
const methodDescriptor_EventForwarder_SendSync = new grpc.web.MethodDescriptor(
  '/oia.EventForwarder/SendSync',
  grpc.web.MethodType.UNARY,
  model_pb.InMemoryEvent,
  proto.oia.Ack,
  /**
   * @param {!proto.oia.InMemoryEvent} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.oia.Ack.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.oia.InMemoryEvent,
 *   !proto.oia.Ack>}
 */
const methodInfo_EventForwarder_SendSync = new grpc.web.AbstractClientBase.MethodInfo(
  proto.oia.Ack,
  /**
   * @param {!proto.oia.InMemoryEvent} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.oia.Ack.deserializeBinary
);


/**
 * @param {!proto.oia.InMemoryEvent} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.oia.Ack)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.oia.Ack>|undefined}
 *     The XHR Node Readable Stream
 */
proto.oia.EventForwarderClient.prototype.sendSync =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/oia.EventForwarder/SendSync',
      request,
      metadata || {},
      methodDescriptor_EventForwarder_SendSync,
      callback);
};


/**
 * @param {!proto.oia.InMemoryEvent} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.oia.Ack>}
 *     A native promise that resolves to the response
 */
proto.oia.EventForwarderPromiseClient.prototype.sendSync =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/oia.EventForwarder/SendSync',
      request,
      metadata || {},
      methodDescriptor_EventForwarder_SendSync);
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.oia.EventListenerClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.oia.EventListenerPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.oia.EventListenerId,
 *   !proto.oia.InMemoryEvent>}
 */
const methodDescriptor_EventListener_OnEvent = new grpc.web.MethodDescriptor(
  '/oia.EventListener/OnEvent',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.oia.EventListenerId,
  model_pb.InMemoryEvent,
  /**
   * @param {!proto.oia.EventListenerId} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  model_pb.InMemoryEvent.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.oia.EventListenerId,
 *   !proto.oia.InMemoryEvent>}
 */
const methodInfo_EventListener_OnEvent = new grpc.web.AbstractClientBase.MethodInfo(
  model_pb.InMemoryEvent,
  /**
   * @param {!proto.oia.EventListenerId} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  model_pb.InMemoryEvent.deserializeBinary
);


/**
 * @param {!proto.oia.EventListenerId} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.oia.InMemoryEvent>}
 *     The XHR Node Readable Stream
 */
proto.oia.EventListenerClient.prototype.onEvent =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/oia.EventListener/OnEvent',
      request,
      metadata || {},
      methodDescriptor_EventListener_OnEvent);
};


/**
 * @param {!proto.oia.EventListenerId} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.oia.InMemoryEvent>}
 *     The XHR Node Readable Stream
 */
proto.oia.EventListenerPromiseClient.prototype.onEvent =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/oia.EventListener/OnEvent',
      request,
      metadata || {},
      methodDescriptor_EventListener_OnEvent);
};


module.exports = proto.oia;

