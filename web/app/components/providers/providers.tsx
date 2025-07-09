import { ConvexClerkProviders } from './convex-clerk-providers';
import {
    PostHogProvider,
    PostHugUserIdentityProvider,
} from './posthug-providers';
import { ThemeProvider } from './theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PostHogProvider>
            <ThemeProvider>
                <ConvexClerkProviders>
                    <PostHugUserIdentityProvider>
                        {children}
                    </PostHugUserIdentityProvider>
                </ConvexClerkProviders>
            </ThemeProvider>
        </PostHogProvider>
    );
}
