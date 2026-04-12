/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, ReactNode } from "react";
import { useTimer } from "../hooks/useTimer";

type TimeTrackerContextValue = ReturnType<typeof useTimer>;

const TimeTrackerContext = createContext<TimeTrackerContextValue | null>(null);

export const useTimeTracker = (): TimeTrackerContextValue => {
  const ctx = useContext(TimeTrackerContext);
  if (!ctx) throw new Error("useTimeTracker must be used within TimeTrackerProvider");
  return ctx;
};

export const TimeTrackerProvider = ({ children }: { children: ReactNode }) => {
  const value = useTimer();
  return (
    <TimeTrackerContext.Provider value={value}>
      {children}
    </TimeTrackerContext.Provider>
  );
};
