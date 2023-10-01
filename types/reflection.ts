
// типы сгенерированы руками и их нужно дополнять, они не полные
export type ReflectionDescriptor = {
  [key: string]: Message | EnumType | Service
}

export interface Message {
  format: string;
  type:   MessageType;
}

export interface MessageType {
  field:          Field[];
  nestedType:     any[];
  enumType:       any[];
  extensionRange: any[];
  extension:      any[];
  oneofDecl:      OneofDecl[];
  reservedRange:  any[];
  reservedName:   any[];
  name:           string;
  options:        null;
}

export interface Field {
  name:         string;
  extendee:     string;
  number:       number;
  label:        Label;
  type:         TypeEnum;
  typeName:     string;
  defaultValue: string;
  options:      null;
  oneofIndex:   number;
  jsonName:     string;
}

export enum Label {
  LabelOptional = "LABEL_OPTIONAL",
  LabelRepeated = "LABEL_REPEATED",
}

export enum TypeEnum {
  TypeEnum = "TYPE_ENUM",
  TypeInt32 = "TYPE_INT32",
  TypeSint32 = "TYPE_SINT32",
  TypeUint32 = "TYPE_UINT32",

  TypeInt64 = "TYPE_INT64",
  TypeSint64 = "TYPE_SINT64",
  TypeUint64 = "TYPE_UINT64",

  TypeFixed32 = "TYPE_FIXED32",
  TypeFixed64 = "TYPE_FIXED64",
  TypeSFixed32 = "TYPE_SFIXED32",
  TypeSFixed64 = "TYPE_SFIXED64",
  
  TypeFloat = "TYPE_FLOAT",
  TypeDouble = "TYPE_DOUBLE",

  TypeMessage = "TYPE_MESSAGE",
  TypeString = "TYPE_STRING",
  TypeBoolean = "TYPE_BOOL",
  TypeBytes = "TYPE_BYTES",

}

export interface OneofDecl {
  name:    string;
  options: null;
}

export interface EnumType {
  format: string;
  type:   EnumTypeDefinition;
}

export interface EnumTypeDefinition {
  value:   Value[];
  name:    string;
  options: null;
}

export interface Value {
  name:    string;
  number:  number;
  options: null;
}

export type MethodName = string & {};
export type Service = {
  [key: MethodName]: Method
}

export interface Method {
  path:           string;
  requestStream:  boolean;
  responseStream: boolean;
  originalName:   string;
  requestType:    Message;
  responseType:   Message;
}
