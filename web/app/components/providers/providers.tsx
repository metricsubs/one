import { Provider as JotaiProvider } from 'jotai';
import { ConvexClerkProviders } from './convex-clerk-providers';
import { ModalProvider } from './modal-provider';
import {
    PostHogProvider,
    PostHugUserIdentityProvider,
} from './posthug-providers';
import { ReactQueryProvider } from './react-query-provider';
import { ThemeProvider } from './theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <JotaiProvider>
            <PostHogProvider>
                <ThemeProvider>
                    <ConvexClerkProviders>
                        <PostHugUserIdentityProvider>
                            <ReactQueryProvider>
                                <ModalProvider>{children}</ModalProvider>
                            </ReactQueryProvider>
                        </PostHugUserIdentityProvider>
                    </ConvexClerkProviders>
                </ThemeProvider>
            </PostHogProvider>
        </JotaiProvider>
    );
}
