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
