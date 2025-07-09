import { httpRouter } from 'convex/server';
import { exampleHttpAction } from './example';
import { configurePostHugProxy } from './posthug';

const http = httpRouter();

configurePostHugProxy(http);

http.route({
    path: '/example',
    method: 'GET',
    handler: exampleHttpAction,
});

export default http;
