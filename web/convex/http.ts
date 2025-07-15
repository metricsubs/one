import { httpRouter } from 'convex/server';
import { createServiceBotSessionTokenHttpAction } from './auth';
import { exampleHttpAction } from './example';
import { configurePostHugProxy } from './posthug';

const http = httpRouter();

configurePostHugProxy(http);

http.route({
    path: '/example',
    method: 'GET',
    handler: exampleHttpAction,
});

http.route({
    path: '/auth/service-bot-session-token',
    method: 'POST',
    handler: createServiceBotSessionTokenHttpAction,
});

export default http;
