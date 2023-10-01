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

export function createBoolean(): SchemaBool {
  return {
    type: 'boolean'
  }
}

export function createArray(options: SchemaArray): SchemaArray {
  
  const obj: Pick<SchemaArray, 'type'> = {
    type: 'array',
  }
  
  return Object.assign(obj, options);
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
  properties: Record<string, SchemaTypes>
  required: string[]
}

export type SchemaTypes = SchemaObject | SchemaArray | SchemaString | SchemaNumber | SchemaInt | SchemaBool | SchemaEnum | SchemaRef

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

export interface SchemaBool {
  type: 'boolean'
}

export type _arr = {
  type: 'array',
  uniqueItems?: boolean
  minItems?: number
  maxItems?: number
}
export type SchemaArray = (_arr & { items: SchemaTypes, }) | 
(_arr & { prefixItems: SchemaTypes[], items?: false | SchemaTypes }) |
(_arr & { contains: SchemaTypes, minContains?: number, maxContains?: number })

export interface SchemaEnum {
  enum: string[]
}

export interface SchemaRef {
  $ref: string
}