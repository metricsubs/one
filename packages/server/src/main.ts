import {getApp} from './app';

async function main(): Promise<void> {
  const app = await getApp();

  app
    .listen(3030)
    .then(() => console.log('Feathers server listening on localhost:3030'));

  app.service('test').create({
    text: 'Hello world from the server',
  });
}

main().catch(console.error);
