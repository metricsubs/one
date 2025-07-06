import { useAuth } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router";
import { DashboardHeader } from "~/components/dashboard/dashboard-header";
import { Loader } from "~/components/ui";

export default function DashboardLayout() {
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) {
        return <div className="flex flex-col items-center justify-center h-screen gap-1">
            <Loader variant="ring" className="w-4 h-4" />
            <p className="text-xs text-muted-fg ml-2 animate-pulse">Loading...</p>
        </div>
    }

    if (!isSignedIn) {
        return <Navigate to="/sign-in" />
    }

    return (
        <div className="flex flex-col h-screen">
            <DashboardHeader />
            <Outlet />
        </div>
    )
}
