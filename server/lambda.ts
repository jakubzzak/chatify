import { Handler } from 'aws-lambda';
import { proxy } from 'aws-serverless-express';
import { bootstrapLambda } from './src/bootstrap';

let cachedServer: any;

export const handler: Handler = async (event, context) => {
  if (!cachedServer) {
    cachedServer = await bootstrapLambda();
  }
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
