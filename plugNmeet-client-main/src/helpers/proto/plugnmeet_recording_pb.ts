// @generated by protoc-gen-es v1.7.0 with parameter "target=ts,import_extension=.ts"
// @generated from file plugnmeet_recording.proto (package plugnmeet, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type {
  BinaryReadOptions,
  FieldList,
  JsonReadOptions,
  JsonValue,
  PartialMessage,
  PlainMessage,
} from '@bufbuild/protobuf';
import { Message, proto3, protoInt64 } from '@bufbuild/protobuf';
import { RecordingTasks } from './plugnmeet_recorder_pb.ts';

/**
 * @generated from message plugnmeet.RecordingReq
 */
export class RecordingReq extends Message<RecordingReq> {
  /**
   * @generated from field: plugnmeet.RecordingTasks task = 1;
   */
  task = RecordingTasks.START_RECORDING;

  /**
   * @generated from field: string room_id = 2;
   */
  roomId = '';

  /**
   * @generated from field: int64 room_table_id = 3;
   */
  roomTableId = protoInt64.zero;

  /**
   * @generated from field: string sid = 4;
   */
  sid = '';

  /**
   * @generated from field: optional string rtmp_url = 5;
   */
  rtmpUrl?: string;

  /**
   * @generated from field: optional string custom_design = 6;
   */
  customDesign?: string;

  constructor(data?: PartialMessage<RecordingReq>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'plugnmeet.RecordingReq';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {
      no: 1,
      name: 'task',
      kind: 'enum',
      T: proto3.getEnumType(RecordingTasks),
    },
    { no: 2, name: 'room_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 3,
      name: 'room_table_id',
      kind: 'scalar',
      T: 3 /* ScalarType.INT64 */,
    },
    { no: 4, name: 'sid', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 5,
      name: 'rtmp_url',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
      opt: true,
    },
    {
      no: 6,
      name: 'custom_design',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
      opt: true,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): RecordingReq {
    return new RecordingReq().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): RecordingReq {
    return new RecordingReq().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): RecordingReq {
    return new RecordingReq().fromJsonString(jsonString, options);
  }

  static equals(
    a: RecordingReq | PlainMessage<RecordingReq> | undefined,
    b: RecordingReq | PlainMessage<RecordingReq> | undefined,
  ): boolean {
    return proto3.util.equals(RecordingReq, a, b);
  }
}

/**
 * @generated from message plugnmeet.RecordingInfoFile
 */
export class RecordingInfoFile extends Message<RecordingInfoFile> {
  /**
   * @generated from field: int64 room_table_id = 1;
   */
  roomTableId = protoInt64.zero;

  /**
   * @generated from field: string room_id = 2;
   */
  roomId = '';

  /**
   * @generated from field: string room_title = 3;
   */
  roomTitle = '';

  /**
   * @generated from field: string room_sid = 4;
   */
  roomSid = '';

  /**
   * @generated from field: int64 room_creation_time = 5;
   */
  roomCreationTime = protoInt64.zero;

  /**
   * @generated from field: int64 room_ended = 6;
   */
  roomEnded = protoInt64.zero;

  /**
   * @generated from field: string recording_id = 7;
   */
  recordingId = '';

  /**
   * @generated from field: string recorder_id = 8;
   */
  recorderId = '';

  /**
   * @generated from field: string file_path = 9;
   */
  filePath = '';

  /**
   * @generated from field: float file_size = 10;
   */
  fileSize = 0;

  /**
   * @generated from field: int64 creation_time = 11;
   */
  creationTime = protoInt64.zero;

  constructor(data?: PartialMessage<RecordingInfoFile>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'plugnmeet.RecordingInfoFile';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {
      no: 1,
      name: 'room_table_id',
      kind: 'scalar',
      T: 3 /* ScalarType.INT64 */,
    },
    { no: 2, name: 'room_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'room_title', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 4, name: 'room_sid', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 5,
      name: 'room_creation_time',
      kind: 'scalar',
      T: 3 /* ScalarType.INT64 */,
    },
    { no: 6, name: 'room_ended', kind: 'scalar', T: 3 /* ScalarType.INT64 */ },
    {
      no: 7,
      name: 'recording_id',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
    },
    {
      no: 8,
      name: 'recorder_id',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
    },
    { no: 9, name: 'file_path', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 10, name: 'file_size', kind: 'scalar', T: 2 /* ScalarType.FLOAT */ },
    {
      no: 11,
      name: 'creation_time',
      kind: 'scalar',
      T: 3 /* ScalarType.INT64 */,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): RecordingInfoFile {
    return new RecordingInfoFile().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): RecordingInfoFile {
    return new RecordingInfoFile().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): RecordingInfoFile {
    return new RecordingInfoFile().fromJsonString(jsonString, options);
  }

  static equals(
    a: RecordingInfoFile | PlainMessage<RecordingInfoFile> | undefined,
    b: RecordingInfoFile | PlainMessage<RecordingInfoFile> | undefined,
  ): boolean {
    return proto3.util.equals(RecordingInfoFile, a, b);
  }
}