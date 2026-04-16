import { cn } from "../ui/cn";
import type { Task } from "../../types/task";
import UpcomingTaskRow from "./UpcomingTaskRow";

type UpcomingTaskGroupProps = {
  date: string;
  tasks: Task[];
  hasBorderTop: boolean;
};

export default function UpcomingTaskGroup({ date, tasks, hasBorderTop }: UpcomingTaskGroupProps) {
  return (
    <div className={cn(hasBorderTop && "border-t border-[#f0f5f6]")}>
      <div className="flex items-center px-5 py-3 border-b border-[#f0f5f6]">
        <p className="text-[0.65rem] font-[400] text-[#a0a5ab] uppercase tracking-widest">
          {date}
        </p>
      </div>
      <ul>
        {tasks.map((task) => (
          <UpcomingTaskRow key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
}
