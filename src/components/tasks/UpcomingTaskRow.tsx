import { Clock3 } from "lucide-react";
import { cn } from "../ui/cn";
import type { Priority, Task } from "../../types/task";

const PRIORITY_DOT_CLASSES: Record<Priority, string> = {
  High: "bg-[#ef4444]",
  Medium: "bg-[#f59e0b]",
  Low: "bg-[#22c55e]",
};

export default function UpcomingTaskRow({ task }: { task: Task }) {
  return (
    <li className="flex items-start gap-4 px-5 py-4 border-b border-[#f0f5f6] last:border-0">
      <div
        className={cn("flex-shrink-0 w-2 h-2 mt-1 rounded-full", PRIORITY_DOT_CLASSES[task.priority])}
        title={task.priority}
      />

      <div className="flex-1 min-w-0">
        <p className="text-[0.85rem] font-[500] leading-none text-[#161c22] truncate">
          {task.name}
        </p>
        {task.description ? (
          <p className="text-[0.7rem] font-[300] text-[#a0a5ab] mt-1 truncate">
            {task.description}
          </p>
        ) : null}
      </div>

      {task.startTime ? (
        <div className="flex items-center gap-1.5 text-[0.65rem] text-[#a0a5ab] bg-[#f5f8f9] rounded-full px-2.5 py-1 flex-shrink-0">
          <Clock3 className="w-3 h-3" />
          <span>
            {task.startTime}
            {task.endTime ? ` – ${task.endTime}` : ""}
          </span>
        </div>
      ) : null}
    </li>
  );
}
