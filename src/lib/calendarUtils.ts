export const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const WEEKDAY_ABBR: Record<string, string> = {
  Sunday: "Sun",
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
};

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const VISIBLE_HOURS = 7;
export const FIRST_VISIBLE_HOUR = 6;
export const LAST_VISIBLE_START_HOUR = 17;
export const MULTI_DAY_ROW_HEIGHT_PX = 20;
export const MULTI_DAY_ROW_GAP_PX = 2;
export const DAY_COLUMN_GAP_PX = 6;
export const TASK_SLOT_VERTICAL_INSET_PX = 3;
export const GRID_COLS = "48px repeat(7, minmax(0, 1fr))";

export interface TimeSlot {
  label: string;
  hour: number;
}

export interface DisplayDay {
  day: string;
  date: string;
}

/** Maps a day index (0=Sun … 6=Sat, matching displayDays order) to its 1-based grid column. */
export const dayIndexToGridCol = (i: number): number => i + 2;

export function toIso(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Returns the Monday of the week containing the given ISO date string. */
export function getMondayOf(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  const dow = d.getDay(); // 0=Sun
  const offset = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + offset);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Returns Sun–Sat display days for the week whose Monday is given. */
export function getWeekDays(monday: Date): DisplayDay[] {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() - 1);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return { day: WEEKDAY_NAMES[d.getDay()], date: toIso(d) };
  });
}

export function shiftWeek(monday: Date, direction: -1 | 1): Date {
  const d = new Date(monday);
  d.setDate(d.getDate() + direction * 7);
  return d;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function formatHourLabel(hour: number): string {
  const normalizedHour = ((hour % 24) + 24) % 24;
  const suffix = normalizedHour >= 12 ? "pm" : "am";
  const displayHour = normalizedHour % 12 || 12;
  return `${displayHour}:00 ${suffix}`;
}

export function getVisibleStartHour(currentHour: number): number {
  return clamp(currentHour - 1, FIRST_VISIBLE_HOUR, LAST_VISIBLE_START_HOUR);
}

export function getTimeSlots(startHour: number): TimeSlot[] {
  return Array.from({ length: VISIBLE_HOURS }, (_, index) => ({
    hour: startHour + index,
    label: formatHourLabel(startHour + index),
  }));
}

export function eventTopPct(startHour: number, visibleStartHour: number): number {
  return ((startHour - visibleStartHour) / VISIBLE_HOURS) * 100;
}

export function eventHeightPct(durationHours: number): number {
  return (durationHours / VISIBLE_HOURS) * 100;
}

export function isFutureDate(date: string, todayDate: string): boolean {
  return date > todayDate;
}

export function isFutureSlot(
  date: string,
  slotHour: number,
  todayDate: string,
  currentHour: number,
): boolean {
  return date === todayDate
    ? slotHour > currentHour
    : isFutureDate(date, todayDate);
}

export interface CalendarEventBase {
  startHour: number;
  durationHours: number;
}

export function eventOverlapsSlot(event: CalendarEventBase, slotHour: number): boolean {
  return (
    event.startHour <= slotHour &&
    event.startHour + event.durationHours > slotHour
  );
}
