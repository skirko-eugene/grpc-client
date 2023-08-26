
interface ServicesResponse {
  host: string
  services: string[]
}
interface ServicesErrorResponse {
  host: string
  error: string
}

export type ServerReflectionResponse = Array<ServicesResponse | ServicesErrorResponse>
