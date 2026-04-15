import Dexie, { type Table } from "dexie";
import type { Habit } from "../types/habit";
import type { Task } from "../types/task";
import { mockHabits, mockTasks } from "../lib/mockData";

export type HabitEntry = Habit;
export type TaskEntry = Task;

const LEGACY_MIGRATION_KEY = "nexstep:indexeddb-migrated:v1";

type LegacyHabitEntry = {
  id: string;
  name: string;
  days: boolean[];
};

type LegacyTaskEntry = {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  priority: Task["priority"];
};

type LegacyIndexedDbTaskEntry = LegacyTaskEntry & {
  isCompleted?: boolean;
  status?: Task["status"];
  tags?: Task["tags"];
  subtasks?: Task["subtasks"];
  createdAt?: string;
  updatedAt?: string;
};

type LegacyIndexedDbHabitEntry = LegacyHabitEntry & {
  description?: string;
  category?: Habit["category"];
  targetPerWeek?: Habit["targetPerWeek"];
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const getTimestamp = (): string => new Date().toISOString();

const toHabitRecord = (habit: LegacyIndexedDbHabitEntry): HabitEntry => {
  const timestamp = getTimestamp();

  return {
    id: habit.id,
    name: habit.name.trim(),
    description: habit.description,
    category: habit.category ?? "other",
    targetPerWeek: habit.targetPerWeek ?? 7,
    days: Array.isArray(habit.days) ? habit.days : Array(7).fill(false),
    isArchived: habit.isArchived ?? false,
    createdAt: habit.createdAt ?? timestamp,
    updatedAt: habit.updatedAt ?? timestamp,
  };
};

const toTaskStatus = (isCompleted: boolean): Task["status"] =>
  isCompleted ? "completed" : "pending";

const toTaskRecord = (task: LegacyIndexedDbTaskEntry): TaskEntry => {
  const timestamp = getTimestamp();
  const isCompleted = task.isCompleted ?? (task.status === "completed");

  return {
    id: task.id,
    name: task.name.trim(),
    description: task.description.trim(),
    date: task.date,
    startTime: task.startTime,
    endTime: task.endTime,
    priority: task.priority,
    isCompleted,
    status: task.status ?? toTaskStatus(isCompleted),
    tags: task.tags ?? [],
    subtasks: task.subtasks ?? [],
    createdAt: task.createdAt ?? timestamp,
    updatedAt: task.updatedAt ?? timestamp,
  };
};

class NexStepDatabase extends Dexie {
  habits!: Table<HabitEntry, string>;
  tasks!: Table<TaskEntry, string>;

  constructor() {
    super("nexstep-productivity-dashboard");

    this.version(1).stores({
      habits: "id, name",
      tasks: "id, date, priority, isCompleted",
    });

    this.version(2)
      .stores({
        habits: "id, name, category, isArchived",
        tasks: "id, date, priority, isCompleted, status",
      })
      .upgrade(async (transaction) => {
        const habitsTable = transaction.table<LegacyIndexedDbHabitEntry, string>("habits");
        const tasksTable = transaction.table<LegacyIndexedDbTaskEntry, string>("tasks");

        const [existingHabits, existingTasks] = await Promise.all([
          habitsTable.toArray(),
          tasksTable.toArray(),
        ]);

        await Promise.all([
          habitsTable.clear(),
          tasksTable.clear(),
        ]);

        await Promise.all([
          existingHabits.length > 0
            ? habitsTable.bulkPut(existingHabits.map(toHabitRecord))
            : Promise.resolve(),
          existingTasks.length > 0
            ? tasksTable.bulkPut(existingTasks.map(toTaskRecord))
            : Promise.resolve(),
        ]);
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
  task: Pick<LegacyTaskEntry, "name" | "description">,
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

  const legacyHabits = parseLegacyData<LegacyHabitEntry[]>("habits", []).filter(
    (habit) =>
      typeof habit?.id === "string" &&
      typeof habit?.name === "string" &&
      Array.isArray(habit?.days)
  );

  const legacyTasks = parseLegacyData<LegacyTaskEntry[]>("tasks", []).filter(
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

  const migratedHabits: HabitEntry[] = legacyHabits.map((habit) => toHabitRecord(habit));
  const migratedTasks: TaskEntry[] = legacyTasks.map((task, index) =>
    toTaskRecord({
      ...task,
      isCompleted: checkedTaskIds.has(legacyTaskIdentifier(task, index)),
    })
  );

  await db.transaction("rw", db.habits, db.tasks, async () => {
    if (migratedHabits.length > 0) {
      await db.habits.bulkPut(migratedHabits);
    }

    if (migratedTasks.length > 0) {
      await db.tasks.bulkPut(migratedTasks);
    }
  });

  localStorage.setItem(LEGACY_MIGRATION_KEY, "true");
}

// Bump this version string whenever the mock data changes — it clears
// the old data and re-seeds so the UI always reflects the latest mock.
const MOCK_SEED_VERSION = "nexstep:mock-seeded:v5";

export async function seedMockData(): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  if (localStorage.getItem(MOCK_SEED_VERSION) === "true") {
    return;
  }

  await db.transaction("rw", db.habits, db.tasks, async () => {
    await db.habits.clear();
    await db.tasks.clear();
    await db.habits.bulkPut(mockHabits);
    await db.tasks.bulkPut(mockTasks);
  });

  localStorage.setItem(MOCK_SEED_VERSION, "true");
}
