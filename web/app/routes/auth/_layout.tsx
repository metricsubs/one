import { Outlet } from "react-router";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <div className="flex h-screen w-screen items-center justify-center">
        <Outlet />
    </div>;
}
