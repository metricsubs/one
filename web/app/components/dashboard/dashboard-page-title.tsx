import { cn } from "~/lib/cn";

export interface DashboardPageTitleProps {
    className?: string;
    title: React.ReactNode;
    rightAccessories?: React.ReactNode;
}

export function DashboardPageTitle({ title, className, rightAccessories }: DashboardPageTitleProps) {

    const titleElement = typeof title === "string" ? <h1 className={cn("text-2xl font-semibold", className)}>{title}</h1> : title;

    return (
        <div className="flex flex-row items-center gap-1 justify-between">
            <div className="flex flex-col items-center gap-1">
                {titleElement}
            </div>
            <div className="flex flex-row items-center gap-1">
                {rightAccessories}
            </div>
        </div>
    )
}
