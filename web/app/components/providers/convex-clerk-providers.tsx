"use client"

import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { dark as clerkDarkTheme } from "@clerk/themes";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { convex } from "~/lib/convex";
import { useTheme } from "./theme-provider";

export interface ConvexClerkProvidersProps {
    children: React.ReactNode;
}

export function ConvexClerkProviders({ children }: ConvexClerkProvidersProps) {
    const { calculatedTheme } = useTheme();
    return (
        <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
            appearance={{
                baseTheme: calculatedTheme === "dark" ? clerkDarkTheme : undefined,
            }}
        >
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}
