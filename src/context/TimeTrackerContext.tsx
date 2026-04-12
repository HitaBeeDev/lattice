import { createContext, useContext, ReactNode } from "react";
import { useTimeTracker as useTimeTrackerHook } from "../hooks/useTimeTracker";

type TimeTrackerContextValue = ReturnType<typeof useTimeTrackerHook>;

const TimeTrackerContext = createContext<TimeTrackerContextValue | null>(null);

export const useTimeTracker = (): TimeTrackerContextValue => {
  const ctx = useContext(TimeTrackerContext);
  if (!ctx) throw new Error("useTimeTracker must be used within TimeTrackerProvider");
  return ctx;
};

export const TimeTrackerProvider = ({ children }: { children: ReactNode }) => {
  const value = useTimeTrackerHook();
  return (
    <TimeTrackerContext.Provider value={value}>
      {children}
    </TimeTrackerContext.Provider>
  );
};
