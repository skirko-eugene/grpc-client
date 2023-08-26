import * as grpc from '@grpc/grpc-js';
import { GrpcReflection } from 'grpc-js-reflection-client'


export function createReflectionClient(host: string, secure: grpc.ChannelCredentials = grpc.credentials.createInsecure()) {
  const connection = new GrpcReflection(
    host,
    secure,
  );

  return connection;
}