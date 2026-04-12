export type TimerMode = "pomodoro" | "short_break" | "long_break";

export type TimerState = "idle" | "running" | "paused" | "completed";

export interface PomodoroSession {
  id: string;
  mode: TimerMode;
  state: TimerState;
  taskId?: string;
  projectId?: string;
  durationSeconds: number;
  remainingSeconds: number;
  startedAt?: string;
  pausedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimerSessionHistoryEntry {
  id: string;
  sessionType: "Pomodoro" | "ShortBreak" | "LongBreak";
  durationSeconds: number;
  completedAt: string;
}

export interface TimerAnalytics {
  sessionHistory: TimerSessionHistoryEntry[];
  dailyFocusSeconds: Record<string, number>;
  completedPomodoros: number;
  shortBreakCount: number;
  longBreakCount: number;
}
