import { HOST } from "../constants";

export function call <T extends object>(options: {host: string, service: string, method: string, params: T}) {
  const {
    host,
    service,
    method,
    params,
  } = options

  const url = new URL(`http://${HOST}/call`)

  url.searchParams.append('host', host)
  url.searchParams.append('service', service)
  url.searchParams.append('method', method)
  url.searchParams.append('params', JSON.stringify(params));

  return fetch(url)
    .then(res => res.json());
}