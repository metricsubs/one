import { Provider as JotaiProvider } from 'jotai';
import { ConvexClerkProviders } from './convex-clerk-providers';
import { ModalProvider } from './modal-provider';
import {
    PostHogProvider,
    PostHugUserIdentityProvider,
} from './posthug-providers';
import { ThemeProvider } from './theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <JotaiProvider>
            <PostHogProvider>
                <ThemeProvider>
                    <ConvexClerkProviders>
                        <PostHugUserIdentityProvider>
                            <ModalProvider>{children}</ModalProvider>
                        </PostHugUserIdentityProvider>
                    </ConvexClerkProviders>
                </ThemeProvider>
            </PostHogProvider>
        </JotaiProvider>
    );
}
