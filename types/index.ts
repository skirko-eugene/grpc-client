
export interface ServicesResponse {
  host: string
  services: string[]
}
export interface ServicesErrorResponse {
  host: string
  error: string
}

export type ServerReflectionResponse = Array<ServicesResponse | ServicesErrorResponse>
