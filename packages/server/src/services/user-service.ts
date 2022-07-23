import type {Application} from '@feathersjs/feathers';
import {MongoDBService} from '@feathersjs/mongodb';
import type {ServiceTypes} from '../register-services';

export class UserService extends MongoDBService {}

export function registerUserService(app: Application<ServiceTypes>) {
  app.use(
    'users',
    new UserService({Model: app.get('mongoClient').db().collection('users')}),
  );
}
