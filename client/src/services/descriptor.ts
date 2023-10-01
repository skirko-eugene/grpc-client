import { HOST } from "../constants";
import { DescriptorResponseType } from 'types/responses'

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
    .then(res => res.json() as Promise<DescriptorResponseType>)
}