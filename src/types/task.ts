export const TASK_PRIORITIES = ["High", "Medium", "Low"] as const;
export type Priority = (typeof TASK_PRIORITIES)[number];

export const TASK_STATUSES = ["pending", "in_progress", "completed"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface TaskTag {
  id: string;
  name: string;
  color?: string;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  priority: Priority;
  isCompleted: boolean;
  status: TaskStatus;
  tags: TaskTag[];
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
}
