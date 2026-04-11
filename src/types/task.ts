export type Priority = "low" | "medium" | "high";

export type TaskStatus = "todo" | "in_progress" | "completed" | "cancelled";

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
  title: string;
  description?: string;
  dueDate?: string;
  startTime?: string;
  endTime?: string;
  priority: Priority;
  status: TaskStatus;
  tags: TaskTag[];
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
}
