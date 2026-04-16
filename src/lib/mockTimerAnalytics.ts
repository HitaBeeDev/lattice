import type { TimerAnalytics } from "../types/pomodoro";

const getLocalIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildCurrentWeekFocusSeconds = (): Record<string, number> => {
  const today = new Date();
  const currentDay = today.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const weekFocusHours = [3.2, 3.8, 4.1, 3.5, 3.9, 3.1, 2.7];

  return Object.fromEntries(
    weekFocusHours.map((hours, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + index);
      return [getLocalIsoDate(date), Math.round(hours * 3600)];
    }),
  );
};

export const mockTimerAnalytics: TimerAnalytics = {
  completedPomodoros: 12,
  shortBreakCount: 8,
  longBreakCount: 3,
  sessionHistory: [],
  dailyFocusSeconds: buildCurrentWeekFocusSeconds(),
};
