import type { Habit } from "../types/habit";
import type { Task } from "../types/task";
import type { TimerAnalytics } from "../types/pomodoro";

// Dates are always computed relative to TODAY so the demo data stays current
// regardless of when the app is opened.

const getLocalIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** Returns an ISO date string offset by `days` from today (local timezone). */
const relativeDay = (offset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return getLocalIsoDate(date);
};

const getCurrentWeekdayIndex = (): number => {
  const currentDay = new Date().getDay();
  return currentDay === 0 ? 6 : currentDay - 1;
};

const buildMockHabitDays = (
  completedDays: number,
  { includeToday = false }: { includeToday?: boolean } = {},
): boolean[] => {
  const todayIndex = getCurrentWeekdayIndex();
  const days = Array(7).fill(false);
  let remaining = Math.min(completedDays, todayIndex + 1);

  if (includeToday && remaining > 0) {
    days[todayIndex] = true;
    remaining -= 1;
  }

  for (let index = 0; index <= todayIndex && remaining > 0; index += 1) {
    if (days[index]) {
      continue;
    }

    days[index] = true;
    remaining -= 1;
  }

  return days;
};

export const mockUser = {
  name: "Sofia",
};

const buildCurrentWeekFocusSeconds = (): Record<string, number> => {
  const today = new Date();
  const currentDay = today.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const weekFocusHours = [3.2, 3.8, 4.1, 3.5, 3.9, 3.1, 2.7];

  const entries = weekFocusHours
    .map((hours, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + index);
      return [getLocalIsoDate(date), Math.round(hours * 3600)] as [string, number];
    })
    .filter((entry): entry is [string, number] => entry !== null);

  return Object.fromEntries(entries);
};

export const mockTimerAnalytics: TimerAnalytics = {
  completedPomodoros: 12,
  shortBreakCount: 8,
  longBreakCount: 3,
  sessionHistory: [],
  dailyFocusSeconds: buildCurrentWeekFocusSeconds(),
};

export const mockHabits: Habit[] = [
  {
    id: "habit-mock-1",
    name: "Morning Meditation",
    description: "10 minutes of mindful breathing",
    category: "mindfulness",
    frequency: "daily",
    targetPerWeek: 7,
    days: buildMockHabitDays(4, { includeToday: true }),
    isArchived: false,
    createdAt: "2026-04-01T08:00:00.000Z",
    updatedAt: "2026-04-14T08:10:00.000Z",
  },
  {
    id: "habit-mock-2",
    name: "Exercise",
    description: "At least 30 minutes of physical activity",
    category: "fitness",
    frequency: "weekly",
    targetPerWeek: 5,
    days: buildMockHabitDays(4, { includeToday: true }),
    isArchived: false,
    createdAt: "2026-04-01T08:00:00.000Z",
    updatedAt: "2026-04-14T07:45:00.000Z",
  },
  {
    id: "habit-mock-3",
    name: "Read for 30 Minutes",
    description: "Read a book or article",
    category: "learning",
    frequency: "daily",
    targetPerWeek: 7,
    days: buildMockHabitDays(2, { includeToday: true }),
    isArchived: false,
    createdAt: "2026-04-01T08:00:00.000Z",
    updatedAt: "2026-04-13T21:00:00.000Z",
  },
  {
    id: "habit-mock-4",
    name: "Drink 8 Glasses of Water",
    description: "Stay hydrated throughout the day",
    category: "health",
    frequency: "daily",
    targetPerWeek: 7,
    days: buildMockHabitDays(4, { includeToday: true }),
    isArchived: false,
    createdAt: "2026-04-01T08:00:00.000Z",
    updatedAt: "2026-04-14T14:00:00.000Z",
  },
  {
    id: "habit-mock-5",
    name: "Journaling",
    description: "Write down thoughts and reflections",
    category: "mindfulness",
    frequency: "weekly",
    targetPerWeek: 5,
    days: buildMockHabitDays(2, { includeToday: true }),
    isArchived: false,
    createdAt: "2026-04-01T08:00:00.000Z",
    updatedAt: "2026-04-13T22:00:00.000Z",
  },
  {
    id: "habit-mock-6",
    name: "No Sugar",
    description: "Avoid added sugars for the day",
    category: "health",
    frequency: "daily",
    targetPerWeek: 7,
    days: buildMockHabitDays(1, { includeToday: true }),
    isArchived: false,
    createdAt: "2026-04-07T08:00:00.000Z",
    updatedAt: "2026-04-07T08:00:00.000Z",
  },
  {
    id: "habit-mock-7",
    name: "Walk 10,000 Steps",
    description: "Hit the daily step goal",
    category: "fitness",
    frequency: "custom",
    frequencyDays: [0, 1, 2, 3, 4],
    targetPerWeek: 5,
    days: buildMockHabitDays(4, { includeToday: true }),
    isArchived: false,
    createdAt: "2026-04-01T08:00:00.000Z",
    updatedAt: "2026-04-14T18:30:00.000Z",
  },
];

// Task dates are relative to today so the demo always shows live data:
//   relativeDay(0)  = today
//   relativeDay(-1) = yesterday
//   relativeDay(1)  = tomorrow
//   relativeDay(2)  = day after tomorrow
//   relativeDay(7)  = one week from today

export const mockTasks: Task[] = [
  // Today — completed
  {
    id: "task-mock-1",
    name: "Review project proposal",
    description: "Go through the Q2 proposal and leave comments",
    date: relativeDay(0),
    startTime: "09:00",
    endTime: "10:00",
    priority: "High",
    isCompleted: true,
    status: "completed",
    tags: [],
    subtasks: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-mock-2",
    name: "Team standup meeting",
    description: "Daily sync with the team",
    date: relativeDay(0),
    startTime: "10:30",
    endTime: "11:00",
    priority: "Medium",
    isCompleted: true,
    status: "completed",
    tags: [],
    subtasks: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Today — pending
  {
    id: "task-mock-3",
    name: "Write unit tests",
    description: "Add test coverage for the auth module",
    date: relativeDay(0),
    startTime: "13:00",
    endTime: "15:00",
    priority: "Medium",
    isCompleted: false,
    status: "pending",
    tags: [],
    subtasks: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "task-mock-4",
    name: "Update documentation",
    description: "Sync README with latest API changes",
    date: relativeDay(0),
    startTime: "15:00",
    endTime: "16:00",
    priority: "Low",
    isCompleted: false,
    status: "pending",
    tags: [],
    subtasks: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "task-mock-5",
    name: "Fix login redirect bug",
    description: "Users are occasionally stuck on a blank screen after OAuth",
    date: relativeDay(0),
    startTime: "16:00",
    endTime: "17:30",
    priority: "High",
    isCompleted: false,
    status: "pending",
    tags: [],
    subtasks: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  // Yesterday — completed
  {
    id: "task-mock-6",
    name: "Design mockups",
    description: "Figma wireframes for the new settings page",
    date: relativeDay(-1),
    startTime: "10:00",
    endTime: "12:00",
    priority: "High",
    isCompleted: true,
    status: "completed",
    tags: [],
    subtasks: [],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "task-mock-7",
    name: "Client presentation",
    description: "Present progress to stakeholders",
    date: relativeDay(-1),
    startTime: "14:00",
    endTime: "15:00",
    priority: "High",
    isCompleted: true,
    status: "completed",
    tags: [],
    subtasks: [],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  // Tomorrow
  {
    id: "task-mock-8",
    name: "Sprint planning",
    description: "Plan tasks for the next two-week sprint",
    date: relativeDay(1),
    startTime: "09:00",
    endTime: "11:00",
    priority: "Medium",
    isCompleted: false,
    status: "pending",
    tags: [],
    subtasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-mock-9",
    name: "Design review",
    description: "Review the updated dashboard layout with product",
    date: relativeDay(1),
    startTime: "11:30",
    endTime: "12:15",
    priority: "Medium",
    isCompleted: true,
    status: "completed",
    tags: [],
    subtasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-mock-10",
    name: "Refactor calendar card",
    description: "Clean up spacing and slot-state logic in the dashboard calendar",
    date: relativeDay(1),
    startTime: "13:00",
    endTime: "14:30",
    priority: "High",
    isCompleted: false,
    status: "pending",
    tags: [],
    subtasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-mock-11",
    name: "Write release notes",
    description: "Draft the release summary for this week's changes",
    date: relativeDay(1),
    startTime: "15:00",
    endTime: "16:00",
    priority: "Low",
    isCompleted: false,
    status: "pending",
    tags: [],
    subtasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Day after tomorrow
  {
    id: "task-mock-12",
    name: "Code review",
    description: "Review open pull requests from the team",
    date: relativeDay(2),
    startTime: "13:00",
    endTime: "14:00",
    priority: "Medium",
    isCompleted: false,
    status: "pending",
    tags: [],
    subtasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Next week
  {
    id: "task-mock-13",
    name: "Deploy to staging",
    description: "Push the release candidate to the staging environment",
    date: relativeDay(7),
    startTime: "11:00",
    endTime: "12:30",
    priority: "High",
    isCompleted: false,
    status: "pending",
    tags: [],
    subtasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
