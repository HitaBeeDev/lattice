import { cn } from "./cn";

type SkeletonProps = {
    className?: string;
};
export function Skeleton({ className }: SkeletonProps) {
    return (<div aria-hidden="true" className={cn("animate-pulse rounded-[1rem] bg-[#dbe8eb]", className)}/>);
}
