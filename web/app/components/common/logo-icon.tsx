import { cn } from "~/lib/cn";

export interface LogoIconProps {
    className?: string;
}

export default function LogoIcon(
    {
        className,
    }: LogoIconProps
) {
    return (
        <img src="/logo.svg" alt="MetricSubs" className={cn("w-16 h-16", className)} />
    )
}
