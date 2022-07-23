import type {AuthenticationService} from '@feathersjs/authentication/lib/service';
import {Application} from '@feathersjs/feathers';
import {
  TestService,
  registerAuthService,
  registerUserService,
  UserService,
} from './services';
import {MongoDbAdapter} from '@feathersjs/mongodb';
import {MongoClient} from 'mongodb';
import {Configuration} from './config';

export type ServiceTypes = {
  auth: AuthenticationService;
  users: UserService;
  test: TestService;
};

export type AppContainer = Configuration & {
  mongoClient: MongoClient;
};

export async function registerServices(
  app: Application<ServiceTypes, AppContainer>,
) {
  const mongoClient = new MongoClient(app.get('mongo').uri);
  app.set('mongoClient', mongoClient);

  registerUserService(app);
  registerAuthService(app);

  app.use('test', new TestService());
}
