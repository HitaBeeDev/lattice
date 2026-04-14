import {
  Check,
  Link2,
  ListTodo,
  MessageSquareText,
  Monitor,
  PencilLine,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Task } from "../../types/task";

type TodoOverviewCardProps = {
  tasks: Task[];
};

type TodoVisual = {
  icon: LucideIcon;
  accent: string;
};

const FALLBACK_TASKS: Task[] = [
  {
    id: "dashboard-fallback-1",
    name: "Plan today priorities",
    description: "Sort the top three things to finish",
    date: "fallback",
    startTime: "08:30",
    endTime: "09:00",
    priority: "High",
    isCompleted: true,
    status: "completed",
    tags: [],
    subtasks: [],
    createdAt: "2026-04-14T08:30:00.000Z",
    updatedAt: "2026-04-14T09:00:00.000Z",
  },
  {
    id: "dashboard-fallback-2",
    name: "Reply to client notes",
    description: "Send the updated ETA and comments",
    date: "fallback",
    startTime: "11:00",
    endTime: "11:30",
    priority: "Medium",
    isCompleted: false,
    status: "pending",
    tags: [],
    subtasks: [],
    createdAt: "2026-04-14T11:00:00.000Z",
    updatedAt: "2026-04-14T11:00:00.000Z",
  },
  {
    id: "dashboard-fallback-3",
    name: "Polish dashboard card",
    description: "Align spacing and final colors",
    date: "fallback",
    startTime: "14:00",
    endTime: "15:00",
    priority: "Low",
    isCompleted: false,
    status: "pending",
    tags: [],
    subtasks: [],
    createdAt: "2026-04-14T14:00:00.000Z",
    updatedAt: "2026-04-14T14:00:00.000Z",
  },
];

const TASK_VISUALS: TodoVisual[] = [
  { icon: Monitor, accent: "#6366f1" },
  { icon: Zap, accent: "#f59e0b" },
  { icon: MessageSquareText, accent: "#06b6d4" },
  { icon: PencilLine, accent: "#8b5cf6" },
  { icon: Link2, accent: "#10b981" },
];

const formatTimeRange = (task: Task): string => `${task.startTime} - ${task.endTime}`;
const MAX_CARD_TASKS = 5;

export default function TodoOverviewCard({
  tasks,
}: TodoOverviewCardProps): React.ReactElement {
  const visibleTasks = (tasks.length > 0 ? tasks : FALLBACK_TASKS).slice(
    0,
    MAX_CARD_TASKS,
  );
  const completedCount = visibleTasks.filter((task) => task.isCompleted).length;
  const progress =
    visibleTasks.length === 0
      ? 0
      : Math.round((completedCount / visibleTasks.length) * 100);
  const pendingCount = Math.max(visibleTasks.length - completedCount, 0);
  const emptyCount = Math.max(MAX_CARD_TASKS - visibleTasks.length, 0);
  const pendingPct =
    visibleTasks.length > 0
      ? Math.round((pendingCount / visibleTasks.length) * 100)
      : 0;
  const freePct = emptyCount > 0 ? Math.round((emptyCount / MAX_CARD_TASKS) * 100) : 0;

  return (
    <section className="col-span-1 col-start-4 row-span-4 row-start-1 flex h-full w-full flex-col overflow-hidden rounded-[1.35rem] bg-[linear-gradient(180deg,#edf9fc_0%,#d7eef5_100%)] px-5 pb-4 pt-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[0.96rem] font-[500] tracking-[-0.03em] text-[#1f252b]">
            Todos
          </p>
          <p className="mt-1.5 text-[0.8rem] leading-none text-[#5f6973]">
            Daily progress
          </p>
        </div>

        <p className="text-[2.2rem] font-[300] leading-none tracking-[-0.06em] text-[#1d2329]">
          {progress}%
        </p>
      </div>

      <div className="mt-4 flex items-end gap-2">
        <div className="flex-1">
          <p className="mb-1.5 text-[0.68rem] font-[500] text-[#5f6973]">
            {progress}%
          </p>
          <div className="h-[2.5rem] rounded-[0.95rem] bg-[#76d9ea] shadow-[inset_0_-1px_0_rgba(0,0,0,0.06)]" />
          <p className="mt-1.5 text-[0.72rem] text-[#3d454c]">Done</p>
        </div>

        <div className="flex-1">
          <p className="mb-1.5 text-[0.68rem] font-[500] text-[#5f6973]">
            {pendingPct}%
          </p>
          <div className="h-[1.8rem] rounded-[0.85rem] bg-[#1f2024] shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]" />
          <p className="mt-1.5 text-[0.72rem] text-[#3d454c]">Open</p>
        </div>

        <div className="w-[17.5%]">
          <p className="mb-1.5 text-[0.68rem] font-[500] text-[#5f6973]">
            {freePct}%
          </p>
          <div className="h-[1.25rem] rounded-[0.75rem] bg-[#575b65] shadow-[inset_0_-1px_0_rgba(255,255,255,0.05)]" />
          <p className="mt-1.5 text-[0.72rem] text-[#3d454c]">Free</p>
        </div>
      </div>

      <div className="relative mt-8 flex min-h-0 flex-1 flex-col">
        <div className="absolute left-1/2 top-0 h-3 w-[58%] -translate-x-1/2 rounded-full bg-[#7f8087] shadow-[0_6px_14px_rgba(0,0,0,0.16)]" />

        <div className="mt-2 flex min-h-0 flex-1 flex-col rounded-[1.9rem] bg-[#1d1d22] px-4 pb-4 pt-5 text-white shadow-[0_20px_40px_rgba(13,16,20,0.34)]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[1.02rem] font-[500] tracking-[-0.03em] text-white">
              To Do List
            </p>
            <p className="mt-1 text-[0.7rem] text-white/42">
              Tasks for today
            </p>
          </div>

          <div className="text-[2.1rem] font-[300] leading-none tracking-[-0.065em] text-white">
            {completedCount}/{visibleTasks.length}
          </div>
        </div>

        <ul className="mt-5 flex min-h-0 flex-1 flex-col gap-3">
          {visibleTasks.map((task, index) => {
            const visual = TASK_VISUALS[index % TASK_VISUALS.length];
            const Icon = visual.icon;

            return (
              <li
                key={task.id}
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_5px_12px_rgba(255,255,255,0.06)]">
                  <Icon
                    className="h-[1rem] w-[1rem]"
                    strokeWidth={1.8}
                    style={{ color: visual.accent }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.79rem] font-[500] tracking-[-0.02em] text-white">
                    {task.name}
                  </p>
                  <p className="mt-0.5 truncate text-[0.65rem] text-white/38">
                    {formatTimeRange(task)}
                  </p>
                </div>

                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    task.isCompleted
                      ? "bg-[#72e1ee]"
                      : "border border-white/16 bg-white/5"
                  }`}
                >
                  {task.isCompleted ? (
                    <Check className="h-3 w-3 text-[#10151a]" strokeWidth={3} />
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex items-center justify-between rounded-[1.05rem] border border-white/8 bg-white/[0.04] px-3 py-2 text-[0.7rem] text-white/52">
          <span className="inline-flex items-center gap-2">
            <ListTodo className="h-3.5 w-3.5" strokeWidth={1.9} />
            Daily queue
          </span>
          <span>{pendingCount} left</span>
        </div>
      </div>
      </div>
    </section>
  );
}
