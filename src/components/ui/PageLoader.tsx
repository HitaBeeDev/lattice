import { Skeleton } from "./Skeleton";

export default function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="flex flex-col gap-4 p-6 w-full"
    >
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-[12rem] w-full" />
      <Skeleton className="h-[12rem] w-full" />
      <Skeleton className="h-[8rem] w-full" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
