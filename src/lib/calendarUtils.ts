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
const GRID_ROW_START_CLASSES = [
  "row-start-1",
  "row-start-2",
  "row-start-3",
  "row-start-4",
  "row-start-5",
  "row-start-6",
  "row-start-7",
] as const;
const GRID_COL_START_CLASSES = [
  "col-start-1",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
  "col-start-8",
] as const;
const COL_SPAN_CLASSES = [
  "col-span-1",
  "col-span-2",
  "col-span-3",
  "col-span-4",
  "col-span-5",
  "col-span-6",
  "col-span-7",
] as const;
const ROW_SPAN_CLASSES = [
  "row-span-1",
  "row-span-2",
  "row-span-3",
  "row-span-4",
  "row-span-5",
  "row-span-6",
  "row-span-7",
] as const;

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

/**
 * Formats a `Date` as a local ISO date string (`YYYY-MM-DD`).
 */
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

/**
 * Returns a new Monday shifted backward or forward by one week.
 */
export function shiftWeek(monday: Date, direction: -1 | 1): Date {
  const d = new Date(monday);
  d.setDate(d.getDate() + direction * 7);
  return d;
}

/**
 * Clamps `value` between the provided `min` and `max` bounds.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Maps a numeric grid row start to the closest supported Tailwind class.
 */
export function getGridRowStartClass(rowStart: number): string {
  return GRID_ROW_START_CLASSES[clamp(rowStart, 1, GRID_ROW_START_CLASSES.length) - 1];
}

/**
 * Maps a numeric grid column start to the closest supported Tailwind class.
 */
export function getGridColStartClass(colStart: number): string {
  return GRID_COL_START_CLASSES[clamp(colStart, 1, GRID_COL_START_CLASSES.length) - 1];
}

/**
 * Maps a numeric column span to the closest supported Tailwind class.
 */
export function getColSpanClass(colSpan: number): string {
  return COL_SPAN_CLASSES[clamp(colSpan, 1, COL_SPAN_CLASSES.length) - 1];
}

/**
 * Maps a numeric row span to the closest supported Tailwind class.
 */
export function getRowSpanClass(rowSpan: number): string {
  return ROW_SPAN_CLASSES[clamp(rowSpan, 1, ROW_SPAN_CLASSES.length) - 1];
}

/**
 * Formats a 24-hour number into the compact hour label used by the calendar.
 */
export function formatHourLabel(hour: number): string {
  const normalizedHour = ((hour % 24) + 24) % 24;
  const suffix = normalizedHour >= 12 ? "pm" : "am";
  const displayHour = normalizedHour % 12 || 12;
  return `${displayHour}:00 ${suffix}`;
}

/**
 * Chooses the first visible calendar hour while keeping the viewport in allowed bounds.
 */
export function getVisibleStartHour(currentHour: number): number {
  return clamp(currentHour - 1, FIRST_VISIBLE_HOUR, LAST_VISIBLE_START_HOUR);
}

/**
 * Builds the fixed set of visible calendar time slots starting at `startHour`.
 */
export function getTimeSlots(startHour: number): TimeSlot[] {
  return Array.from({ length: VISIBLE_HOURS }, (_, index) => ({
    hour: startHour + index,
    label: formatHourLabel(startHour + index),
  }));
}

/**
 * Returns the top offset percentage for a timed event within the visible hour window.
 */
export function eventTopPct(startHour: number, visibleStartHour: number): number {
  return ((startHour - visibleStartHour) / VISIBLE_HOURS) * 100;
}

/**
 * Returns the height percentage for a timed event within the visible hour window.
 */
export function eventHeightPct(durationHours: number): number {
  return (durationHours / VISIBLE_HOURS) * 100;
}

/**
 * Reports whether an ISO date string is after the current reference date.
 */
export function isFutureDate(date: string, todayDate: string): boolean {
  return date > todayDate;
}

/**
 * Reports whether a calendar slot is in the future relative to the current day and hour.
 */
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

/**
 * Reports whether an event occupies the given hourly slot.
 */
export function eventOverlapsSlot(event: CalendarEventBase, slotHour: number): boolean {
  return (
    event.startHour <= slotHour &&
    event.startHour + event.durationHours > slotHour
  );
}
