import { ConvexClerkProviders } from "./convex-clerk-providers";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ConvexClerkProviders>
            {children}
        </ConvexClerkProviders>
    )
}
