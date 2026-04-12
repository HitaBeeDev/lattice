import type { LucideIcon } from "lucide-react";
import {
  ChartColumnBig,
  CircleCheckBig,
  Clock3,
  ListTodo,
} from "lucide-react";

export type NavItem = {
  icon: LucideIcon;
  label: string;
  shortLabel: string;
  path: string;
};

export const mainNavItems: NavItem[] = [
  { icon: ChartColumnBig, label: "Dashboard", shortLabel: "Dash", path: "/dashboard" },
  { icon: CircleCheckBig, label: "Habit Tracker", shortLabel: "Habit", path: "/habit-tracker" },
  { icon: ListTodo, label: "Tasks", shortLabel: "Tasks", path: "/tasks" },
  { icon: Clock3, label: "Pomodoro", shortLabel: "Timer", path: "/pomodoro" },
];
