
export interface ServicesResponse {
  host: string
  services: string[]
  error: null
}
export interface ServicesErrorResponse {
  host: string
  services: null
  error: string
}

export type ServerReflectionResponse = Array<ServicesResponse | ServicesErrorResponse>
