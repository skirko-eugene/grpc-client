export function createObject<T extends SchemaObject['properties']>(properties: T, required: (keyof T)[]): SchemaObject {

  return {
    type: 'object',
    properties,
    required: required as string[],
  }
}

export interface Schema {
  uri: string
  fileMatch?: string[]
  schema: SchemaObject | SchemaEnum
}

function createSchema(){
  return {
    uri: ''
  }
}


export function createString(options?: Omit<SchemaString, 'type'>): SchemaString {
  return {
    type: 'string',
    ...options
  }
}

export function createNumber(options?: SchemaBaseNumber): SchemaNumber {
  return {
    type: 'number',
    ...options
  }
}

export function createInt(options?: SchemaBaseNumber): SchemaInt {
  return {
    type: 'integer',
    ...options
  }
}

export function createEnum(values: string[]): SchemaEnum {
  return {
    enum: values
  }
}

export function createRef(link: string) {
  return {
    $ref: link
  }
}

export interface SchemaObject {
  type: 'object'
  properties: Record<string, SchemaObject | SchemaString | SchemaNumber | SchemaInt | SchemaEnum | SchemaRef>
  required: string[]
}

export interface SchemaString {
  type: 'string'
  minLength?: number
  maxLength?: number
  pattern?: string
}

interface SchemaBaseNumber {
  multipleOf?: number
  minimum?: number
  exclusiveMinimum?: boolean
  maximum?: number
  exclusiveMaximum?: boolean
}

export interface SchemaNumber extends SchemaBaseNumber {
  type: 'number'
}

export interface SchemaInt extends SchemaBaseNumber {
  type: 'integer'
}

export interface SchemaEnum {
  enum: string[]
}

export interface SchemaRef {
  $ref: string
}