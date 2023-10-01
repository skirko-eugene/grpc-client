import { HOST } from "../constants";
import { ServerReflectionResponse } from 'types';

export function reflection (hosts: string[]){
  const url = new URL(`http://${HOST}/reflection`)

  Array.from(new Set(hosts)).forEach(host => {
    url.searchParams.append('host', host)
  })

  return fetch(url)
    .then(res => res.json() as Promise<ServerReflectionResponse>);
}