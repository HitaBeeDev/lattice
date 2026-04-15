export type HabitFrequency = "daily" | "weekly" | "custom";

export const HABIT_CATEGORIES = [
  "health",
  "fitness",
  "productivity",
  "learning",
  "mindfulness",
  "finance",
  "social",
  "home",
  "other",
] as const;

export type HabitCategory = (typeof HABIT_CATEGORIES)[number];

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  frequencyDays?: number[];
  targetPerWeek?: number;
  streakGoal?: number;
  days: boolean[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HabitStreak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
}
