export type ThemeMode = "light" | "dark" | "system";

export type AccentColor =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "pink"
  | "gray";

export type SoundTheme = "none" | "classic" | "soft" | "digital";

export interface UserSettings {
  id: string;
  themeMode: ThemeMode;
  accentColor: AccentColor;
  soundTheme: SoundTheme;
  notificationsEnabled: boolean;
  pomodoroMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  createdAt: string;
  updatedAt: string;
}
