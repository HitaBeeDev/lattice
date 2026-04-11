export type HabitCategory =
  | "health"
  | "fitness"
  | "productivity"
  | "learning"
  | "mindfulness"
  | "finance"
  | "social"
  | "home"
  | "other";

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  targetPerWeek?: number;
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
