/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from "react";
import { useTasks as useTasksHook, type TasksContextValue } from "../hooks/useTasks";

const TaskContext = createContext<TasksContextValue | null>(null);

export const useTasks = (): TasksContextValue => {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("useTasks must be used within TaskProvider");
  }

  return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const value: TasksContextValue = useTasksHook();
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export default TaskContext;
