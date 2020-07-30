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
proto.oia = require('./alarms_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.oia.AlarmLifecycleListenerClient =
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
proto.oia.AlarmLifecycleListenerPromiseClient =
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
 *   !proto.oia.Empty,
 *   !proto.oia.AlarmsList>}
 */
const methodDescriptor_AlarmLifecycleListener_HandleAlarmSnapshot = new grpc.web.MethodDescriptor(
  '/oia.AlarmLifecycleListener/HandleAlarmSnapshot',
  grpc.web.MethodType.SERVER_STREAMING,
  model_pb.Empty,
  proto.oia.AlarmsList,
  /**
   * @param {!proto.oia.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.oia.AlarmsList.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.oia.Empty,
 *   !proto.oia.AlarmsList>}
 */
const methodInfo_AlarmLifecycleListener_HandleAlarmSnapshot = new grpc.web.AbstractClientBase.MethodInfo(
  proto.oia.AlarmsList,
  /**
   * @param {!proto.oia.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.oia.AlarmsList.deserializeBinary
);


/**
 * @param {!proto.oia.Empty} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.oia.AlarmsList>}
 *     The XHR Node Readable Stream
 */
proto.oia.AlarmLifecycleListenerClient.prototype.handleAlarmSnapshot =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/oia.AlarmLifecycleListener/HandleAlarmSnapshot',
      request,
      metadata || {},
      methodDescriptor_AlarmLifecycleListener_HandleAlarmSnapshot);
};


/**
 * @param {!proto.oia.Empty} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.oia.AlarmsList>}
 *     The XHR Node Readable Stream
 */
proto.oia.AlarmLifecycleListenerPromiseClient.prototype.handleAlarmSnapshot =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/oia.AlarmLifecycleListener/HandleAlarmSnapshot',
      request,
      metadata || {},
      methodDescriptor_AlarmLifecycleListener_HandleAlarmSnapshot);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.oia.Empty,
 *   !proto.oia.Alarm>}
 */
const methodDescriptor_AlarmLifecycleListener_HandleNewOrUpdatedAlarm = new grpc.web.MethodDescriptor(
  '/oia.AlarmLifecycleListener/HandleNewOrUpdatedAlarm',
  grpc.web.MethodType.SERVER_STREAMING,
  model_pb.Empty,
  model_pb.Alarm,
  /**
   * @param {!proto.oia.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  model_pb.Alarm.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.oia.Empty,
 *   !proto.oia.Alarm>}
 */
const methodInfo_AlarmLifecycleListener_HandleNewOrUpdatedAlarm = new grpc.web.AbstractClientBase.MethodInfo(
  model_pb.Alarm,
  /**
   * @param {!proto.oia.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  model_pb.Alarm.deserializeBinary
);


/**
 * @param {!proto.oia.Empty} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.oia.Alarm>}
 *     The XHR Node Readable Stream
 */
proto.oia.AlarmLifecycleListenerClient.prototype.handleNewOrUpdatedAlarm =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/oia.AlarmLifecycleListener/HandleNewOrUpdatedAlarm',
      request,
      metadata || {},
      methodDescriptor_AlarmLifecycleListener_HandleNewOrUpdatedAlarm);
};


/**
 * @param {!proto.oia.Empty} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.oia.Alarm>}
 *     The XHR Node Readable Stream
 */
proto.oia.AlarmLifecycleListenerPromiseClient.prototype.handleNewOrUpdatedAlarm =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/oia.AlarmLifecycleListener/HandleNewOrUpdatedAlarm',
      request,
      metadata || {},
      methodDescriptor_AlarmLifecycleListener_HandleNewOrUpdatedAlarm);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.oia.Empty,
 *   !proto.oia.DeleteAlarm>}
 */
const methodDescriptor_AlarmLifecycleListener_HandleDeletedAlarm = new grpc.web.MethodDescriptor(
  '/oia.AlarmLifecycleListener/HandleDeletedAlarm',
  grpc.web.MethodType.SERVER_STREAMING,
  model_pb.Empty,
  proto.oia.DeleteAlarm,
  /**
   * @param {!proto.oia.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.oia.DeleteAlarm.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.oia.Empty,
 *   !proto.oia.DeleteAlarm>}
 */
const methodInfo_AlarmLifecycleListener_HandleDeletedAlarm = new grpc.web.AbstractClientBase.MethodInfo(
  proto.oia.DeleteAlarm,
  /**
   * @param {!proto.oia.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.oia.DeleteAlarm.deserializeBinary
);


/**
 * @param {!proto.oia.Empty} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.oia.DeleteAlarm>}
 *     The XHR Node Readable Stream
 */
proto.oia.AlarmLifecycleListenerClient.prototype.handleDeletedAlarm =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/oia.AlarmLifecycleListener/HandleDeletedAlarm',
      request,
      metadata || {},
      methodDescriptor_AlarmLifecycleListener_HandleDeletedAlarm);
};


/**
 * @param {!proto.oia.Empty} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.oia.DeleteAlarm>}
 *     The XHR Node Readable Stream
 */
proto.oia.AlarmLifecycleListenerPromiseClient.prototype.handleDeletedAlarm =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/oia.AlarmLifecycleListener/HandleDeletedAlarm',
      request,
      metadata || {},
      methodDescriptor_AlarmLifecycleListener_HandleDeletedAlarm);
};


module.exports = proto.oia;

