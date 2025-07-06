import { Outlet } from "react-router";
import { DashboardHeader } from "~/components/dashboard/dashboard-header";

export default function DashboardLayout() {
    return (
        <div className="flex flex-col h-screen">
            <DashboardHeader />
            <Outlet />
        </div>
    )
}
