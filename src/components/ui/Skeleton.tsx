type SkeletonProps = {
    className?: string;
};
export function Skeleton({}: SkeletonProps) {
    return (<div aria-hidden="true"/>);
}
