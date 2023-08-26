import express from 'express';
import { router } from './routes'

interface Config {

}

export function createApp(config: Config): express.Application {
  const app = express();

  app.use(router)

  return app
}