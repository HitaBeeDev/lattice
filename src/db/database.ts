import Dexie, { type Table } from "dexie";
import type { Priority } from "../lib/taskSchema";

export interface HabitEntry {
  id: string;
  name: string;
  days: boolean[];
}

export interface TaskEntry {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  priority: Priority;
  isCompleted: boolean;
}

const LEGACY_MIGRATION_KEY = "nexstep:indexeddb-migrated:v1";

class NexStepDatabase extends Dexie {
  habits!: Table<HabitEntry, string>;
  tasks!: Table<TaskEntry, string>;

  constructor() {
    super("nexstep-productivity-dashboard");

    this.version(1).stores({
      habits: "id, name",
      tasks: "id, date, priority, isCompleted",
    });
  }
}

export const db = new NexStepDatabase();

const parseLegacyData = <T,>(key: string, fallback: T): T => {
  const rawValue = localStorage.getItem(key);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
};

const legacyTaskIdentifier = (
  task: Pick<TaskEntry, "name" | "description">,
  index: number
): string => `${task.name}-${task.description}-${index}`;

export async function migrateLocalStorageData(): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  if (localStorage.getItem(LEGACY_MIGRATION_KEY) === "true") {
    return;
  }

  const [habitCount, taskCount] = await Promise.all([
    db.habits.count(),
    db.tasks.count(),
  ]);

  if (habitCount > 0 || taskCount > 0) {
    localStorage.setItem(LEGACY_MIGRATION_KEY, "true");
    return;
  }

  const legacyHabits = parseLegacyData<HabitEntry[]>("habits", []).filter(
    (habit) =>
      typeof habit?.id === "string" &&
      typeof habit?.name === "string" &&
      Array.isArray(habit?.days)
  );
  const legacyTasks = parseLegacyData<Omit<TaskEntry, "isCompleted">[]>(
    "tasks",
    []
  ).filter(
    (task) =>
      typeof task?.id === "string" &&
      typeof task?.name === "string" &&
      typeof task?.description === "string" &&
      typeof task?.date === "string" &&
      typeof task?.startTime === "string" &&
      typeof task?.endTime === "string" &&
      typeof task?.priority === "string"
  );
  const checkedTaskIds = new Set(
    parseLegacyData<string[]>("checkedTasks", []).filter(
      (taskId): taskId is string => typeof taskId === "string"
    )
  );

  const migratedTasks: TaskEntry[] = legacyTasks.map((task, index) => ({
    ...task,
    isCompleted: checkedTaskIds.has(legacyTaskIdentifier(task, index)),
  }));

  await db.transaction("rw", db.habits, db.tasks, async () => {
    if (legacyHabits.length > 0) {
      await db.habits.bulkPut(legacyHabits);
    }

    if (migratedTasks.length > 0) {
      await db.tasks.bulkPut(migratedTasks);
    }
  });

  localStorage.setItem(LEGACY_MIGRATION_KEY, "true");
}
