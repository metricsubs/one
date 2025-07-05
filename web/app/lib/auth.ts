import { useAuth as useAuthKitAuth } from "@workos-inc/authkit-react";
import { useCallback, useMemo } from "react";

export function useConvexAuth() {
    const { isLoading, getAccessToken, user } = useAuthKitAuth();
    const fetchAccessToken = useCallback(
        async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
            // Here you can do whatever transformation to get the ID Token
            // or null
            // Make sure to fetch a new token when `forceRefreshToken` is true
            return await getAccessToken({ forceRefresh: forceRefreshToken });
        },
        // If `getToken` isn't correctly memoized
        // remove it from this dependency array
        [getAccessToken],
    );
    const isAuthenticated = user !== null;
    return useMemo(
        () => ({
            // Whether the auth provider is in a loading state
            isLoading,
            // Whether the auth provider has the user signed in
            isAuthenticated,
            // The async function to fetch the ID token
            fetchAccessToken,
        }),
        [isLoading, isAuthenticated, fetchAccessToken],
    );
}
