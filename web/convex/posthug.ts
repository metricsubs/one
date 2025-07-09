import { HttpRouter, ROUTABLE_HTTP_METHODS } from 'convex/server';
import { httpAction } from './_generated/server';

const API_HOST = process.env.POSTHOG_API_HOST || 'https://us.i.posthog.com';
const ASSET_HOST =
    process.env.POSTHOG_ASSET_HOST || 'https://us-assets.i.posthog.com';

export const posthugProxyHttpAction = httpAction(async (_ctx, req) => {
    const url = new URL(req.url);

    url.pathname = url.pathname.replace(/^\/ph/, '');

    const isAsset = url.pathname.startsWith('/static/');
    const host = isAsset ? ASSET_HOST : API_HOST;

    const newUrl = new URL(host);

    newUrl.pathname = url.pathname;
    newUrl.search = url.search;
    newUrl.hash = url.hash;

    const newHeaders = new Headers(req.headers);
    newHeaders.set('host', newUrl.host);

    const request = new Request(newUrl.toString(), {
        method: req.method,
        body: req.body,
        headers: newHeaders,
    });

    const response = await fetch(request);

    response.headers.set(
        'Access-Control-Allow-Origin',
        req.headers.get('origin') || '*'
    );
    response.headers.set('Access-Control-Allow-Methods', '*');
    response.headers.set('Access-Control-Allow-Headers', '*');
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    return response;
});

export function configurePostHugProxy(http: HttpRouter) {
    ROUTABLE_HTTP_METHODS.forEach((method) => {
        http.route({
            pathPrefix: '/ph/',
            method,
            handler: posthugProxyHttpAction,
        });
    });
}
