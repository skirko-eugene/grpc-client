import { Router } from 'express'
import { createReflectionClient } from './utils/grpc';
import { ServerReflectionResponse } from 'types';

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
        }
        return a
      } catch (err) {
        return {
          host: item.host,
          error: (err as Error).message,
        }
      }
    })
  )

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

  const result = services
    .filter((item): item is string => typeof item === 'string')
    .map(async item => {
      const descriptor = await connection.getDescriptorBySymbol(item)

      const definition = JSON.stringify(descriptor.getPackageDefinition(), (key, value)   => {
        if (key === 'fileDescriptorProtos') {
          return undefined
        }

        return value
      })

      return {
        service: item,
        definition: definition
      }
    })
  
  res.send(await Promise.all(result))
})

import {
  credentials,
} from '@grpc/grpc-js'

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