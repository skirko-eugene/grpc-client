import { HOST } from "../constants";

export interface Res<T = string> {
  service: string;
  definition: T;
}

interface Props {
  host: string,
  service: string
}
interface Props2 {
  host: string,
  services: string[]
}


export function descriptor (opts: Props | Props2) {
  const url = new URL(`http://${HOST}/descriptor`)

  const {
    host,
  } = opts

  url.searchParams.append('host', host)

  if ('service' in opts) {
    url.searchParams.append('service', opts.service)
  } else {
    opts.services.forEach(item => {
      url.searchParams.append('service', item)
    })
  }

  return fetch(url)
    .then(res => res.json() as Promise<Res[]>)
    .then(res => res.map(item => {
      return {
        ...item,
        definition: JSON.parse(item.definition),
      } as Res<ReflectionDescriptor>
    }))
}

// типы сгенерированы руками и их нужно дополнять, они не полные
export type ReflectionDescriptor = {
  [key: string]: Message | EnumType | MethodsList
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
  TypeInt64 = "TYPE_INT64",
  TypeMessage = "TYPE_MESSAGE",
  TypeString = "TYPE_STRING",
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
export type MethodsList = {
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
