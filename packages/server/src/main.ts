import {getApp} from './app';

async function main(): Promise<void> {
  const app = await getApp();

  const port = app.get('port') || 3030;

  app
    .listen(port)
    .then(() => console.log(`Feathers server listening on port ${port}`));

  app.service('test').create({
    text: 'Hello world from the server',
  });
}

main().catch(console.error);
