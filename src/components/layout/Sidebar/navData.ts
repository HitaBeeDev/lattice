export type NavItem = {
  label: string;
  shortLabel: string;
  path: string;
};

export const mainNavItems: NavItem[] = [
  { label: "Dashboard", shortLabel: "Dash", path: "/dashboard" },
  { label: "Habit Tracker", shortLabel: "Habit", path: "/habit-tracker" },
  { label: "Tasks", shortLabel: "Tasks", path: "/tasks" },
  { label: "Pomodoro", shortLabel: "Timer", path: "/pomodoro" },
];
