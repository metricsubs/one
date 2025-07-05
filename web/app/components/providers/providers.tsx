import { AuthKitProvider } from '@workos-inc/authkit-react';
import { ConvexProvider, ConvexProviderWithAuth } from "convex/react";
import { useConvexAuth } from '~/lib/auth';
import { convex } from '~/lib/convex';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthKitProvider
            clientId={import.meta.env.VITE_AUTH_KIT_CLIENT_ID}
            apiHostname={import.meta.env.VITE_AUTH_KIT_API_HOSTNAME}
        >
            <ConvexProvider client={convex}>
                <ConvexProviderWithAuth client={convex} useAuth={useConvexAuth}>
                    {children}
                </ConvexProviderWithAuth>
            </ConvexProvider>
        </AuthKitProvider>
    )
}
