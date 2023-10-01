import { MapSchemaToJSONType } from "proto-to-json-shema"


export type DescriptorResponseType = {
  service: string
  definition: MapSchemaToJSONType
}[]