import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Task } from "../../types/task";

export type TaskVisual = {
  icon: LucideIcon;
  accentClassName: string;
};

type DashboardTaskRowProps = {
  task: Task;
  visual: TaskVisual;
  liRef?: React.RefObject<HTMLLIElement>;
  onOpen: () => void;
  onToggle?: (taskId: string) => void;
};

const formatTimeRange = (task: Task): string => `${task.startTime} - ${task.endTime}`;

export default function DashboardTaskRow({ task, visual, liRef, onOpen, onToggle }: DashboardTaskRowProps) {
  const Icon = visual.icon;
  return (
    <li ref={liRef} className="shrink-0">
      <div className="flex w-full items-center gap-3 rounded-[1rem]">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_5px_12px_rgba(255,255,255,0.06)]">
          <Icon className={`h-[1rem] w-[1rem] ${visual.accentClassName}`} strokeWidth={1.8} />
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="min-w-0 flex-1 rounded-[0.8rem] py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          aria-label={`Open tasks page for ${task.name}`}
        >
          <p className="truncate text-[0.79rem] font-[500] tracking-[-0.02em] text-white">{task.name}</p>
          <p className="mt-0.5 truncate text-[0.65rem] text-[#f9fafb]">{formatTimeRange(task)}</p>
        </button>
        <button
          type="button"
          onClick={() => onToggle?.(task.id)}
          aria-label={task.isCompleted ? `Mark ${task.name} as not completed` : `Mark ${task.name} as completed`}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${task.isCompleted ? "bg-[#72e1ee]" : "border border-white/16 bg-white/5"}`}
          disabled={!onToggle}
        >
          {task.isCompleted ? <Check className="h-3 w-3 text-[#10151a]" strokeWidth={3} /> : null}
        </button>
      </div>
    </li>
  );
}
