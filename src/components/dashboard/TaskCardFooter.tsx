import { ListTodo } from "lucide-react";

type TaskCardFooterProps = {
  hiddenCount: number;
  remainingCount: number;
  onViewAll: () => void;
};

export default function TaskCardFooter({
  hiddenCount,
  remainingCount,
  onViewAll,
}: TaskCardFooterProps) {
  return (
    <div className="mt-5 xl:mt-auto flex items-center justify-between rounded-[1.05rem] border border-white/8 px-3 py-2 text-[0.7rem] text-white/52">
      <span className="inline-flex items-center gap-2 text-[#f9fafb]">
        <ListTodo className="h-3.5 w-3.5" strokeWidth={1.9} />
        Today&apos;s plan
      </span>
      {hiddenCount > 0 ? (
        <button
          type="button"
          onClick={onViewAll}
          className="text-[0.7rem] text-[#f9fafb] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        >
          View all tasks
        </button>
      ) : (
        <span className="text-[0.7rem] text-[#f9fafb]">
          {remainingCount} left
        </span>
      )}
    </div>
  );
}
