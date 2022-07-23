import {feathers} from '@feathersjs/feathers';
import {koa, rest, bodyParser, errorHandler} from '@feathersjs/koa';
import serveStatic from 'koa-static';
import socketio from '@feathersjs/socketio';
import configuration from '@feathersjs/configuration';

import {
  ServiceTypes,
  AppContainer,
  registerServices,
} from './register-services';
import {Configuration, configurationSchema} from './config';

export async function getApp() {
  const app = koa<ServiceTypes, AppContainer>(feathers()).configure(
    configuration(configurationSchema),
  );

  app.use(serveStatic('.'));
  app.use(errorHandler());
  app.use(bodyParser());

  app.configure(rest());
  app.configure(socketio());

  await registerServices(app);

  return app;
}
