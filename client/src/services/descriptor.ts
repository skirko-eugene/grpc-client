import { HOST } from "../constants";

export function descriptor ({host, service}: {host: string, service: string}){
  const url = new URL(`http://${HOST}/descriptor`)

  url.searchParams.append('host', host)
  url.searchParams.append('service', service)

  return fetch(url)
    .then(res => res.json());
}