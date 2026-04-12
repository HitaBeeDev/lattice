/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from "react";
import { useTimer, type TimeTrackerContextValue } from "../hooks/useTimer";

const TimeTrackerContext = createContext<TimeTrackerContextValue | null>(null);

export const useTimeTracker = (): TimeTrackerContextValue => {
  const context = useContext(TimeTrackerContext);

  if (!context) {
    throw new Error("useTimeTracker must be used within TimeTrackerProvider");
  }

  return context;
};

export const TimeTrackerProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const value: TimeTrackerContextValue = useTimer();

  return (
    <TimeTrackerContext.Provider value={value}>
      {children}
    </TimeTrackerContext.Provider>
  );
};

export default TimeTrackerContext;
