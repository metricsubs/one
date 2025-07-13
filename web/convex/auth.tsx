import { createClerkClient } from '@clerk/backend';
import type {
    GenericActionCtx,
    GenericMutationCtx,
    GenericQueryCtx,
} from 'convex/server';
import type { DataModel } from './_generated/dataModel';

export const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
});

export function checkServiceToken(request: Request): string {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        throw new Error('Unauthorized');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer') {
        throw new Error('Unauthorized');
    }

    if (token !== process.env.SERVICE_TOKEN) {
        throw new Error('Unauthorized');
    }

    return token;
}

export type UserRole = 'admin' | 'proofreader' | 'contributor';

export interface UserInfo {
    id: string;
    username: string;
    bio: string | undefined;
    email: string;
    emailVerified: boolean;
    pictureUrl: string | undefined;
    roles: UserRole[];
}

interface ClerkPublicMetadata {
    bio: string | undefined;
    roles: UserRole[];
}

interface RequireUserAuthOptions {
    ctx:
        | GenericQueryCtx<DataModel>
        | GenericMutationCtx<DataModel>
        | GenericActionCtx<DataModel>;
    role?: UserRole | undefined;
    request?: Request;
}

export async function requireUserAuth({
    ctx,
    role,
    request,
}: RequireUserAuthOptions): Promise<UserInfo> {
    const authorizationHeader = request?.headers.get('Authorization');
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const [_type, token] = authorizationHeader.split(' ');
        if (token === process.env.SERVICE_TOKEN) {
            return {
                id: 'service-bot',
                username: 'Service Bot',
                bio: undefined,
                email: 'noreply@metricsubs.com',
                emailVerified: true,
                pictureUrl: undefined,
                roles: ['admin', 'contributor'],
            };
        }
    }

    const user = await ctx.auth.getUserIdentity();
    if (!user) {
        throw new Error('Unauthorized');
    }

    const publicMetadata = user.public_metadata as unknown as
        | ClerkPublicMetadata
        | undefined;
    const { bio, roles = [] } = publicMetadata || {};

    if (!roles.includes('contributor')) {
        // at least include contributor role for all users
        roles.push('contributor');
    }

    if (role && !roles.includes(role)) {
        throw new Error('Unauthorized: permission denied');
    }

    return {
        id: user.id as string,
        username: user.nickname as string,
        bio,
        email: user.email as string,
        emailVerified: user.emailVerified as boolean,
        pictureUrl: user.pictureUrl ?? undefined,
        roles,
    };
}
