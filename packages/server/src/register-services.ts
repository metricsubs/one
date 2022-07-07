import {Application} from '@feathersjs/feathers';
import {TestService} from './services';

export type ServiceTypes = {
  test: TestService;
};

export async function registerServices(app: Application<ServiceTypes>) {
  app.use('test', new TestService());
}
