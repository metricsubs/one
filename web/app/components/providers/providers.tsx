import { ConvexClerkProviders } from "./convex-clerk-providers";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <ConvexClerkProviders>
                {children}
            </ConvexClerkProviders>
        </ThemeProvider>
    )
}
