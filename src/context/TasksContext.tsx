import { createContext, useContext, ReactNode } from "react";
import { useTasks as useTasksHook } from "../hooks/useTasks";

type TaskContextValue = ReturnType<typeof useTasksHook>;

const TaskContext = createContext<TaskContextValue | null>(null);

export const useTasks = (): TaskContextValue => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const value = useTasksHook();
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
