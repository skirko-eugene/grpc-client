import { Router } from 'express'
import { createReflectionClient } from './utils/grpc';
import { ServerReflectionResponse } from 'types';
import { mapSchemaToJSON } from 'proto-to-json-shema'

export const router = Router()

router.get('/reflection', async (req, res) => {
  const hosts = (Array.isArray(req.query['host']) ?  req.query['host'] : [req.query['host']])
    .filter((item): item is string => typeof item === 'string' && item.length > 0)

  if (hosts.length === 0) {
    res.status(400)
    res.send('Нужно передать хост https://www.google.com?host=ваш_хост&host=ваш_хост')
    return
  }

  const connections = hosts
    .filter((item): item is string => typeof item === 'string')
    .map(item => {
      const connection = createReflectionClient(item)

      return {
        host: item,
        connection,
      }
      
    })

  const hostServices: ServerReflectionResponse = await Promise.all(
    connections.map(async (item) => {

      try {
        const a = {
          host: item.host,
          services: await item.connection.listServices(),
          error: null,
        }
        return a
      } catch (err) {
        return {
          host: item.host,
          services: null,
          error: (err as Error).message,
        }
      }
    })
  )
  res.setHeader('Content-Type', 'application/json')
  res.send(hostServices)
})


router.get('/descriptor', async (req, res) => {
  const host = req.query['host']
  const services = (Array.isArray(req.query['service']) ?  req.query['service'] : [req.query['service']]
    .filter((item): item is string => typeof item === 'string' && item.length > 0))

  if (!host) {
    res.status(400)
    res.send('нет хоста')
    return
  }

  if (services.length === 0) {
    res.status(400)
    res.send('нет сервисов')
    return
  }

  if (typeof host !== 'string') {
    res.status(400)
    res.send('хост должен быть 1')
    return
  }

  const connection = createReflectionClient(host as string)
  // const ignoredKeys = new Set([
  //   "nestedType",
  //   "enumType",
  //   "extensionRange",
  //   "extension",
  //   "oneofDecl",
  //   "reservedRange",
  //   "reservedName",
  //   "fileDescriptorProtos",
  // ])

  const result = services
    .filter((item): item is string => typeof item === 'string')
    .filter(item => item !== 'grpc.reflection.v1alpha.ServerReflection')
    .map(async (item, index) => {
      // Если отослать сразу много запросов то reflection сервер может и не овтетить на все, вводим задержку на запрос
      await new Promise(res => setTimeout(res, 25 * index))
      console.log(item, 'start');
      
      const descriptor = await connection.getDescriptorBySymbol(item)
      console.log(item, 'started');
      
      const def = descriptor.getPackageDefinition()

      debugger
      const data = mapSchemaToJSON(def)
      
      // const definition = JSON.stringify(def, (key, value)   => {
      //   if (value === 'Protocol Buffer 3 DescriptorProto') {
      //     return undefined
      //   }

      //   if (ignoredKeys.has(key)) {
      //     return undefined
      //   }

      //   return value
      // })

      // return {
      //   service: item,
      //   definition: definition
      // }

      return {
        service: item,
        definition: data
      }
    })

  const response = await Promise.all(result)

  res.setHeader('Content-Type', 'application/json')
  res.send(response as DescriptorResponseType)
})

import {
  credentials,
} from '@grpc/grpc-js'
import { DescriptorResponseType } from 'types/responses';

router.get('/call', async (req, res) => {
  const host = req.query.host
  const service = req.query.service
  const method = req.query.method
  const params = req.query.params


  const paramsAsJSON = JSON.parse(params as string)

  const connection = createReflectionClient(host as string)
  
  const descriptor = await connection.getDescriptorBySymbol(service as string)

  const packageObject = descriptor.getPackageObject({
    keepCase: true,
    enums: String,
    longs: String
  });
  
  // @ts-ignore
  const caller = service.split('.').reduce((acc, string) => {
    return acc[string]
  }, packageObject)

  const serviceConnection = new caller(host, credentials.createInsecure())

  // @ts-ignore
  serviceConnection[method](paramsAsJSON, {}, (err, data) => {
    if (err) {
      res.status(500)
      res.send(err.message)
      return
    }

    res.send(data)
  })
})