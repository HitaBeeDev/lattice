import {
  Check,
  Link2,
  ListTodo,
  MessageSquareText,
  Monitor,
  PencilLine,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const formatTimeRange = (task: Task): string =>
  `${task.startTime} - ${task.endTime}`;

const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const isTaskInProgress = (task: Task, nowMinutes: number): boolean => {
  if (task.isCompleted) {
    return false;
  }

  const startMinutes = toMinutes(task.startTime);
  const endMinutes = toMinutes(task.endTime);

  return nowMinutes >= startMinutes && nowMinutes < endMinutes;
};

const MAX_CARD_TASKS = 5;

export default function TodoOverviewCard({
  tasks,
}: TodoOverviewCardProps): React.ReactElement {
  const navigate = useNavigate();
  const listAreaRef = useRef<HTMLUListElement | null>(null);
  const sampleRowRef = useRef<HTMLLIElement | null>(null);
  const [visibleTaskCount, setVisibleTaskCount] = useState(MAX_CARD_TASKS);
  const [displayTasks, setDisplayTasks] = useState<Task[]>(() =>
    tasks.length > 0 ? tasks : FALLBACK_TASKS,
  );

  useEffect(() => {
    setDisplayTasks(tasks.length > 0 ? tasks : FALLBACK_TASKS);
  }, [tasks]);

  const visibleTasks = displayTasks.slice(
    0,
    MAX_CARD_TASKS,
  );
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const visibleListTasks = visibleTasks.slice(0, visibleTaskCount);
  const hiddenTaskCount = Math.max(
    visibleTasks.length - visibleListTasks.length,
    0,
  );
  const completedCount = visibleTasks.filter((task) => task.isCompleted).length;
  const inProgressCount = visibleTasks.filter((task) =>
    isTaskInProgress(task, nowMinutes),
  ).length;
  const remainingCount = Math.max(
    visibleTasks.length - completedCount - inProgressCount,
    0,
  );
  const progress =
    visibleTasks.length === 0
      ? 0
      : Math.round((completedCount / visibleTasks.length) * 100);
  const pendingCount = remainingCount;
  const inProgressPct =
    visibleTasks.length > 0
      ? Math.round((inProgressCount / visibleTasks.length) * 100)
      : 0;
  const remainingPct =
    visibleTasks.length > 0
      ? Math.round((remainingCount / visibleTasks.length) * 100)
      : 0;
  const statPills = [
    {
      label: "Done",
      value: progress,
      pillClassName: "bg-[#72e1ee] text-[#f9fafb]",
    },
    {
      label: "In Progress",
      value: inProgressPct,
      pillClassName: "bg-[#161c22] text-[#f9fafb]",
    },
    {
      label: "Remaining",
      value: remainingPct,
      pillClassName: "bg-[#50585e] text-[#f9fafb]",
    },
  ];
  const handleOpenTasks = (): void => {
    navigate("/tasks");
  };

  const handleToggleTask = (taskId: string): void => {
    setDisplayTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              isCompleted: !task.isCompleted,
              status: task.isCompleted ? "pending" : "completed",
            }
          : task,
      ),
    );
  };

  useEffect(() => {
    const listArea = listAreaRef.current;
    if (!listArea) {
      return;
    }

    const updateVisibleTaskCount = (): void => {
      const rowHeight =
        sampleRowRef.current?.getBoundingClientRect().height ?? 0;
      const styles = window.getComputedStyle(listArea);
      const rowGap = Number.parseFloat(styles.rowGap || styles.gap || "0") || 0;
      const availableHeight = listArea.clientHeight;

      if (rowHeight <= 0 || availableHeight <= 0) {
        setVisibleTaskCount(0);
        return;
      }

      const totalRowSize = rowHeight + rowGap;
      const nextVisibleCount = Math.max(
        Math.min(
          Math.floor((availableHeight + rowGap) / totalRowSize),
          visibleTasks.length,
        ),
        0,
      );

      setVisibleTaskCount(nextVisibleCount);
    };

    updateVisibleTaskCount();

    const resizeObserver = new ResizeObserver(() => {
      updateVisibleTaskCount();
    });

    resizeObserver.observe(listArea);
    if (sampleRowRef.current) {
      resizeObserver.observe(sampleRowRef.current);
    }

    window.addEventListener("resize", updateVisibleTaskCount);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateVisibleTaskCount);
    };
  }, [visibleTasks.length]);

  return (
    <section
      className="col-span-1 col-start-4 row-span-4 row-start-1 flex h-full w-full flex-col 
      overflow-hidden rounded-[1.2rem] bg-[#cee2e9]/40 p-5"
    >
      <div className="flex flex-row items-center justify-between">
        <p className="pt-2 ml-2 text-[0.85rem] leading-none font-[400] text-[#3d454b]">
          Todos
        </p>

        <p className="text-[2.2rem] leading-none font-[200] text-[#161c22] mt-3">
          {progress}%
        </p>
      </div>

      <div className="flex items-start w-full mt-5">
        {statPills.map((pill) => (
          <div
            key={pill.label}
            className="min-w-0"
            style={{ width: `${pill.value}%` }}
          >
            <div
              className={`flex h-[2.6rem] items-center justify-center rounded-[0.75rem] ${pill.pillClassName}`}
            >
              <p className="truncate px-2 text-[0.9rem] font-extralight">
                {pill.value}%
              </p>
            </div>

            <p className="mb-[0.3rem] mt-1 ml-[0.4rem] truncate text-[0.6rem] font-[500] text-[#a0a6ab]">
              {pill.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 ml-2 mr-2 flex h-full flex-col rounded-[1.5rem] bg-[#3d454b] p-6">
        <div className="flex flex-row items-center justify-between">
          <p className="text-[0.85rem] leading-none font-[400] text-[#f9fafb]">
            Tasks for today
          </p>

          <p className="text-[2.2rem] leading-none font-[200] text-[#f9fafb]">
            {completedCount}/{visibleTasks.length}
          </p>
        </div>

        <ul
          ref={listAreaRef}
          className="flex flex-col flex-1 min-h-0 gap-3 mt-5 overflow-hidden"
        >
          {visibleTasks.map((task, index) => {
            const isVisible = index < visibleTaskCount;
            const visual = TASK_VISUALS[index % TASK_VISUALS.length];
            const Icon = visual.icon;

            if (!isVisible) {
              return null;
            }

            return (
              <li
                key={task.id}
                ref={index === 0 ? sampleRowRef : undefined}
                className="shrink-0"
              >
                <div className="flex w-full items-center gap-3 rounded-[1rem]">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_5px_12px_rgba(255,255,255,0.06)]">
                    <Icon
                      className="h-[1rem] w-[1rem]"
                      strokeWidth={1.8}
                      style={{ color: visual.accent }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenTasks}
                    className="min-w-0 flex-1 rounded-[0.8rem] py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                    aria-label={`Open tasks page for ${task.name}`}
                  >
                    <p className="truncate text-[0.79rem] font-[500] tracking-[-0.02em] text-white">
                      {task.name}
                    </p>

                    <p className="mt-0.5 truncate text-[0.65rem] text-[#f9fafb]">
                      {formatTimeRange(task)}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleTask(task.id)}
                    aria-label={
                      task.isCompleted
                        ? `Mark ${task.name} as not completed`
                        : `Mark ${task.name} as completed`
                    }
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      task.isCompleted
                        ? "bg-[#72e1ee]"
                        : "border border-white/16 bg-white/5"
                    }`}
                  >
                    {task.isCompleted ? (
                      <Check
                        className="h-3 w-3 text-[#10151a]"
                        strokeWidth={3}
                      />
                    ) : null}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto flex items-center justify-between rounded-[1.05rem] border border-white/8 px-3 py-2 text-[0.7rem] text-white/52">
          <span className="inline-flex items-center gap-2 text-[#f9fafb]">
            <ListTodo className="h-3.5 w-3.5" strokeWidth={1.9} />
            Today’s plan
          </span>

          {hiddenTaskCount > 0 ? (
            <button
              type="button"
              onClick={handleOpenTasks}
              className="text-[0.7rem] text-[#f9fafb] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              View all tasks
            </button>
          ) : (
            <span>{pendingCount} left</span>
          )}
        </div>
      </div>
    </section>
  );
}
