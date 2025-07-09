import { useUser } from '@clerk/clerk-react';
import {
    PostHogProvider as PostHogProviderBase,
    usePostHog,
} from 'posthog-js/react';
import { useEffect } from 'react';

const POSTHOG_API_HOST = `${import.meta.env.VITE_CONVEX_URL}/http/ph`;

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    return (
        <PostHogProviderBase
            apiKey={import.meta.env.VITE_POSTHOG_KEY}
            options={{
                api_host: POSTHOG_API_HOST,
                ui_host: import.meta.env.VITE_POSTHOG_UI_HOST,
                person_profiles: 'identified_only',
            }}
        >
            {children}
        </PostHogProviderBase>
    );
}

export function PostHugUserIdentityProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useUser();
    const posthog = usePostHog();

    useEffect(() => {
        if (user) {
            posthog.identify(user.id, {
                email: user.primaryEmailAddress,
                emailVerified: user.hasVerifiedEmailAddress,
                username: user.username,
                imageUrl: user.imageUrl,
                roles: user.publicMetadata.roles,
                lastSignInAt: user.lastSignInAt,
                createdAt: user.createdAt,
                publicMetadata: user.publicMetadata,
            });
        } else {
            posthog.reset();
        }
    }, [user, posthog]);

    return <>{children}</>;
}
