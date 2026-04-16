import { Link2, MessageSquareText, Monitor, PencilLine, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Task } from "../../types/task";
import { useVisibleTaskCount } from "../../hooks/useVisibleTaskCount";
import { dashboardFallbackTasks } from "../../lib/mockData";
import { computeTaskCardStats } from "../../lib/taskStats";
import StatsPillBar, { type StatPill } from "./StatsPillBar";
import DashboardTaskRow, { type TaskVisual } from "./DashboardTaskRow";
import TaskCardFooter from "./TaskCardFooter";

const TASK_VISUALS: TaskVisual[] = [
  { icon: Monitor, accentClassName: "text-indigo-500" },
  { icon: Zap, accentClassName: "text-amber-500" },
  { icon: MessageSquareText, accentClassName: "text-cyan-500" },
  { icon: PencilLine, accentClassName: "text-violet-500" },
  { icon: Link2, accentClassName: "text-emerald-500" },
];

const MAX_CARD_TASKS = 5;

// ── Main component ───────────────────────────────────────────────────────────

type TaskOverviewCardProps = {
  tasks: Task[];
  onToggleTask?: (taskId: string) => void;
};

export default function TaskOverviewCard({
  tasks,
  onToggleTask,
}: TaskOverviewCardProps): React.ReactElement {
  const navigate = useNavigate();
  const visibleTasks = (tasks.length > 0 ? tasks : dashboardFallbackTasks).slice(0, MAX_CARD_TASKS);

  const { listAreaRef, sampleRowRef, visibleCount } = useVisibleTaskCount(visibleTasks.length);
  const { completedCount, remainingCount, progress, inProgressPct, remainingPct } =
    computeTaskCardStats(visibleTasks);

  const hiddenTaskCount = Math.max(visibleTasks.length - visibleCount, 0);

  const statPills: StatPill[] = [
    { label: "Done", value: progress, pillClassName: "bg-[#72e1ee] text-[#f9fafb]" },
    { label: "In Progress", value: inProgressPct, pillClassName: "bg-[#161c22] text-[#f9fafb]" },
    { label: "Remaining", value: remainingPct, pillClassName: "bg-[#50585e] text-[#f9fafb]" },
  ];

  const handleOpenTasks = (): void => navigate("/tasks");

  return (
    <section className="col-span-1 col-start-4 row-span-4 row-start-1 flex h-full w-full flex-col overflow-hidden rounded-[1.2rem] bg-[#cee2e9]/40 p-5">
      <div className="flex flex-row items-center justify-between">
        <p className="pt-2 ml-2 text-[0.85rem] leading-none font-[400] text-[#3d454b]">Tasks</p>
        <p className="text-[2.2rem] leading-none font-[200] text-[#161c22] mt-3">{progress}%</p>
      </div>

      <StatsPillBar pills={statPills} />

      <div className="mt-3 ml-2 mr-2 flex h-full flex-col rounded-[1.5rem] bg-[#3d454b] p-6">
        <div className="flex flex-row items-center justify-between">
          <p className="text-[0.85rem] leading-none font-[400] text-[#f9fafb]">Tasks for today</p>
          <p className="text-[2.2rem] leading-none font-[200] text-[#f9fafb]">
            {completedCount}/{visibleTasks.length}
          </p>
        </div>

        <ul
          ref={listAreaRef}
          className="flex flex-col flex-1 min-h-0 gap-3 mt-5 overflow-hidden"
        >
          {visibleTasks.map((task, index) => {
            if (index >= visibleCount) return null;
            const visual = TASK_VISUALS[index % TASK_VISUALS.length];
            return (
              <DashboardTaskRow
                key={task.id}
                liRef={index === 0 ? sampleRowRef : undefined}
                task={task}
                visual={visual}
                onOpen={handleOpenTasks}
                onToggle={onToggleTask}
              />
            );
          })}
        </ul>

        <TaskCardFooter
          hiddenCount={hiddenTaskCount}
          remainingCount={remainingCount}
          onViewAll={handleOpenTasks}
        />
      </div>
    </section>
  );
}
