import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router";
import { cn } from "~/lib/cn";
import LogoIcon from "../common/logo-icon";
import { ThemeToggle } from "../common/theme-toggle";

interface DashboardHeaderProps {
    className?: string;
}

export function DashboardHeader({ className }: DashboardHeaderProps) {
    return (
        <header className={cn("border-b sticky top-0 z-10 bg-card/90 backdrop-blur-sm", className)}>
            <div className="px-4 h-13 flex items-center justify-between">
                <div className="flex flex-row items-center justify-between">
                    <Link className="flex items-center gap-1.5 select-none" to="/">
                        <LogoIcon className="w-6 h-6" />
                        <h1 className="text-lg font-semibold logo-font hidden sm:block">MetricSubs</h1>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <UserButton />
                </div>
            </div>
        </header>
    )
}
