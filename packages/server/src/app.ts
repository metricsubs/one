import {feathers} from '@feathersjs/feathers';
import {koa, rest, bodyParser, errorHandler} from '@feathersjs/koa';
import serveStatic from 'koa-static';
import socketio from '@feathersjs/socketio';

import {ServiceTypes, registerServices} from './register-services';

export async function getApp() {
  const app = koa<ServiceTypes>(feathers());

  app.use(serveStatic('.'));
  app.use(errorHandler());
  app.use(bodyParser());

  app.configure(rest());
  app.configure(socketio());

  await registerServices(app);

  return app;
}
