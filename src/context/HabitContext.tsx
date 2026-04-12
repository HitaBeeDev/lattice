/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, ReactNode } from "react";
import { useHabits as useHabitsHook } from "../hooks/useHabits";

type HabitContextValue = ReturnType<typeof useHabitsHook>;

const HabitContext = createContext<HabitContextValue | null>(null);

export const useHabits = (): HabitContextValue => {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error("useHabits must be used within HabitProvider");
  return ctx;
};

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const value = useHabitsHook();
  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};

export default HabitContext;
