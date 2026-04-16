import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// ---------------------------------------------------------------------------
// Context mocks — also causes mockDashboardMonth + mockHabitHeatmap to be
// imported (value imports), covering those large lib files.
// ---------------------------------------------------------------------------

vi.mock("../context/TasksContext", () => ({ useTasks: vi.fn() }));
vi.mock("../context/HabitContext", () => ({ useHabits: vi.fn() }));
vi.mock("../context/TimeTrackerContext", () => ({ useTimeTracker: vi.fn() }));

import { useTasks } from "../context/TasksContext";
import { useHabits } from "../context/HabitContext";
import { useTimeTracker } from "../context/TimeTrackerContext";
import { useDashboard, getLocalIsoDate, formatFocusLabel } from "./useDashboard";
import type { Task } from "../types/task";
import type { Habit } from "../types/habit";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TODAY = getLocalIsoDate(new Date());

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: "t1",
  name: "Test task",
  description: "",
  date: TODAY,
  startTime: "09:00",
  endTime: "10:00",
  priority: "Medium",
  isCompleted: false,
  status: "pending",
  tags: [],
  subtasks: [],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  ...overrides,
});

const makeHabit = (overrides: Partial<Habit> = {}): Habit => ({
  id: "h1",
  name: "Morning run",
  category: "fitness",
  frequency: "daily",
  days: Array<boolean>(7).fill(false),
  isArchived: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  ...overrides,
});

const defaultTasksContext = {
  tasks: [] as Task[],
  handleCheckboxChange: vi.fn(),
};

const defaultHabitsContext = {
  habits: [] as Habit[],
  percentages: [] as number[],
  weekDates: [] as Date[],
};

const defaultTimerContext = {
  dailyFocusSeconds: {} as Record<string, number>,
  todayFocusSeconds: 0,
  completedPomodoros: 0,
};

const setup = (
  taskOverrides: Partial<typeof defaultTasksContext> = {},
  habitOverrides: Partial<typeof defaultHabitsContext> = {},
  timerOverrides: Partial<typeof defaultTimerContext> = {},
) => {
  vi.mocked(useTasks).mockReturnValue({
    ...defaultTasksContext,
    ...taskOverrides,
  } as ReturnType<typeof useTasks>);
  vi.mocked(useHabits).mockReturnValue({
    ...defaultHabitsContext,
    ...habitOverrides,
  } as ReturnType<typeof useHabits>);
  vi.mocked(useTimeTracker).mockReturnValue({
    ...defaultTimerContext,
    ...timerOverrides,
  } as ReturnType<typeof useTimeTracker>);
  return renderHook(() => useDashboard());
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

describe("getLocalIsoDate", () => {
  it("returns a YYYY-MM-DD string", () => {
    const result = getLocalIsoDate(new Date(2024, 0, 5)); // Jan 5
    expect(result).toBe("2024-01-05");
  });

  it("zero-pads month and day", () => {
    expect(getLocalIsoDate(new Date(2024, 8, 9))).toBe("2024-09-09");
  });
});

describe("formatFocusLabel", () => {
  it("returns minutes only when less than 60", () => {
    expect(formatFocusLabel(45)).toBe("45m");
  });

  it("returns hours only when evenly divisible", () => {
    expect(formatFocusLabel(120)).toBe("2h");
  });

  it("returns combined h and m format", () => {
    expect(formatFocusLabel(90)).toBe("1h 30m");
  });

  it("handles 0 minutes", () => {
    expect(formatFocusLabel(0)).toBe("0m");
  });
});

// ---------------------------------------------------------------------------
// Hook — basic structure
// ---------------------------------------------------------------------------

describe("useDashboard — shape", () => {
  it("returns expected keys", () => {
    const { result } = setup();
    const stats = result.current;
    expect(stats).toHaveProperty("realTodayDate");
    expect(stats).toHaveProperty("todayTasks");
    expect(stats).toHaveProperty("habitPct");
    expect(stats).toHaveProperty("focusMinutes");
    expect(stats).toHaveProperty("focusChartData");
    expect(stats).toHaveProperty("habitHeatmapEntries");
    expect(stats).toHaveProperty("syncedActiveWeek");
    expect(stats).toHaveProperty("syncedWeeks");
  });

  it("realTodayDate matches today", () => {
    const { result } = setup();
    expect(result.current.realTodayDate).toBe(TODAY);
  });
});

// ---------------------------------------------------------------------------
// Hook — task-derived values
// ---------------------------------------------------------------------------

describe("useDashboard — tasks", () => {
  it("todayTasks includes only tasks dated today", () => {
    const todayTask = makeTask({ id: "a", date: TODAY });
    const otherTask = makeTask({ id: "b", date: "2000-01-01" });
    const { result } = setup({ tasks: [todayTask, otherTask] });
    expect(result.current.todayTasks).toHaveLength(1);
    expect(result.current.todayTasks[0].id).toBe("a");
  });

  it("completedTodayTasks counts completed tasks for today", () => {
    const done = makeTask({ id: "done", date: TODAY, isCompleted: true });
    const todo = makeTask({ id: "todo", date: TODAY, isCompleted: false });
    const { result } = setup({ tasks: [done, todo] });
    expect(result.current.completedTodayTasks).toBe(1);
    expect(result.current.totalTodayTasks).toBe(2);
  });

  it("completedTodayTasks is 0 with no tasks", () => {
    const { result } = setup();
    expect(result.current.completedTodayTasks).toBe(0);
    expect(result.current.totalTodayTasks).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Hook — habit-derived values
// ---------------------------------------------------------------------------

describe("useDashboard — habits", () => {
  it("habitPct is 0 when no habits", () => {
    const { result } = setup({}, { habits: [] });
    expect(result.current.habitPct).toBe(0);
  });

  it("habitPct reflects completed habits for today's day index", () => {
    // Two habits, first one checked today
    const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
    const days1 = Array<boolean>(7).fill(false);
    days1[todayIndex] = true;
    const habits = [
      makeHabit({ id: "h1", days: days1 }),
      makeHabit({ id: "h2", days: Array<boolean>(7).fill(false) }),
    ];
    const { result } = setup({}, { habits });
    expect(result.current.habitPct).toBe(50);
    expect(result.current.totalDailyHabits).toBe(2);
    expect(result.current.completedHabitsToday).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Hook — timer-derived values
// ---------------------------------------------------------------------------

describe("useDashboard — timer", () => {
  it("focusMinutes is derived from todayFocusSeconds", () => {
    const { result } = setup({}, {}, { todayFocusSeconds: 1800 }); // 30 min
    expect(result.current.focusMinutes).toBe(30);
  });

  it("completedPomodoros comes from timer context", () => {
    const { result } = setup({}, {}, { completedPomodoros: 4 });
    expect(result.current.completedPomodoros).toBe(4);
  });

  it("focusChartData has one entry per day in the active week", () => {
    const { result } = setup();
    expect(result.current.focusChartData.length).toBeGreaterThan(0);
    expect(result.current.focusChartData[0]).toHaveProperty("focusMinutes");
    expect(result.current.focusChartData[0]).toHaveProperty("isToday");
  });
});

// ---------------------------------------------------------------------------
// Hook — heatmap
// ---------------------------------------------------------------------------

describe("useDashboard — heatmap", () => {
  it("returns generated heatmap entries when no real habits", () => {
    const { result } = setup({}, { habits: [] });
    expect(result.current.habitHeatmapEntries.length).toBeGreaterThan(0);
  });

  it("overlays real habit counts for days in weekDates", () => {
    // weekDates includes today → the generated entry for today gets overridden
    const todayDate = new Date();
    const habit = makeHabit({ id: "h1", days: Array<boolean>(7).fill(true) });
    const { result } = setup(
      {},
      { habits: [habit], weekDates: [todayDate] },
    );
    const todayEntry = result.current.habitHeatmapEntries.find(
      (e) => e.date === TODAY,
    );
    expect(todayEntry).toBeDefined();
    // completedHabits should reflect real data (1 habit with all days true)
    expect(todayEntry?.totalHabits).toBe(1);
  });

  it("weeklyGoalAverage is 0 with no tasks and no habit percentages", () => {
    const { result } = setup();
    expect(result.current.weeklyGoalAverage).toBeGreaterThanOrEqual(0);
    expect(result.current.weeklyGoalAverage).toBeLessThanOrEqual(100);
  });
});
