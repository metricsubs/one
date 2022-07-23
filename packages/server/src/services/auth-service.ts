import type {Application} from '@feathersjs/feathers';
import {AuthenticationService} from '@feathersjs/authentication';
import {LocalStrategy} from '@feathersjs/authentication-local';

import type {ServiceTypes} from '../register-services';

export function registerAuthService(app: Application<ServiceTypes>) {
  const authService = new AuthenticationService(app);
  authService.register('local', new LocalStrategy());
  app.use('auth', authService);
}
