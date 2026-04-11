export interface DailySummary {
  date: string;
  completedTasks: number;
  totalTasks: number;
  completedHabits: number;
  totalHabits: number;
  focusSeconds: number;
  pomodoroSessions: number;
}

export interface WeeklySummary {
  weekStartDate: string;
  weekEndDate: string;
  completedTasks: number;
  totalTasks: number;
  completedHabits: number;
  totalHabits: number;
  focusSeconds: number;
  pomodoroSessions: number;
  dailySummaries: DailySummary[];
}

export interface HeatmapCell {
  date: string;
  value: number;
  level: 0 | 1 | 2 | 3 | 4;
}
