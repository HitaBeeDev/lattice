/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from "react";
import { useHabits as useHabitsHook, type HabitContextValue } from "../hooks/useHabits";

const HabitContext = createContext<HabitContextValue | null>(null);

export const useHabits = (): HabitContextValue => {
  const context = useContext(HabitContext);

  if (!context) {
    throw new Error("useHabits must be used within HabitProvider");
  }

  return context;
};

export const HabitProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const value: HabitContextValue = useHabitsHook();
  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};

export default HabitContext;
