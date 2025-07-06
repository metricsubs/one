import {
    type RouteConfig,
    index,
    layout,
    prefix,
    route,
} from '@react-router/dev/routes';

export default [
    index('routes/home.tsx'),
    route('example', 'routes/example.tsx'),
    layout('routes/auth/_layout.tsx', [
        route('sign-in', 'routes/auth/sign-in.tsx'),
    ]),
    layout(
        'routes/dashboard/_layout.tsx',
        prefix('dashboard', [route('/', 'routes/dashboard/projects.tsx')])
    ),
] satisfies RouteConfig;
