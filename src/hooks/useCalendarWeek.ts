import { useState } from "react";
import {
  WEEKDAY_ABBR,
  MONTH_NAMES,
  VISIBLE_HOURS,
  type TimeSlot,
  type DisplayDay,
  dayIndexToGridCol,
  toIso,
  getMondayOf,
  getWeekDays,
  shiftWeek,
  clamp,
  getVisibleStartHour,
  getTimeSlots,
  FIRST_VISIBLE_HOUR,
  LAST_VISIBLE_START_HOUR,
} from "../lib/calendarUtils";
import type {
  MockDashboardDay,
  MockDashboardWeek,
  MockMultiDayTask,
} from "../lib/mockDashboardMonth";

export interface CalendarEvent {
  id: string;
  title: string;
  subtitle: string;
  day: string;
  startHour: number;
  durationHours: number;
  variant: "dark" | "light";
}

export interface ResolvedMultiDayTask extends MockMultiDayTask {
  colStart: number;
  span: number;
  row: number;
}

function assignMultiDayRows(
  tasks: Omit<ResolvedMultiDayTask, "row">[],
): ResolvedMultiDayTask[] {
  const rowEndDates: string[] = [];
  return tasks.map((task) => {
    let assignedRow = -1;
    for (let r = 0; r < rowEndDates.length; r++) {
      if (task.startDate > rowEndDates[r]) {
        assignedRow = r;
        rowEndDates[r] = task.endDate;
        break;
      }
    }
    if (assignedRow === -1) {
      assignedRow = rowEndDates.length;
      rowEndDates.push(task.endDate);
    }
    return { ...task, row: assignedRow };
  });
}

type UseCalendarWeekOptions = {
  weeks: MockDashboardWeek[];
  todayDate: string;
  multiDayTasks: MockMultiDayTask[];
  timedEvents: CalendarEvent[];
  activeWeek: MockDashboardWeek;
  fixedStartHour?: number;
  maxMultiDayRows?: number;
};

type UseCalendarWeekResult = {
  currentHour: number;
  visibleStartHour: number;
  timeSlots: TimeSlot[];
  displayDays: DisplayDay[];
  visibleWeek: MockDashboardWeek | null;
  visibleWeekDaysByDate: Map<string, MockDashboardDay>;
  clippedMultiDay: ResolvedMultiDayTask[];
  multiDayRowCount: number;
  visibleTimedEvents: CalendarEvent[];
  headerLabel: string;
  handlePreviousWeek: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleNextWeek: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export function useCalendarWeek({
  weeks,
  todayDate,
  multiDayTasks,
  timedEvents,
  activeWeek,
  fixedStartHour,
  maxMultiDayRows,
}: UseCalendarWeekOptions): UseCalendarWeekResult {
  const [currentMonday, setCurrentMonday] = useState<Date>(() => getMondayOf(todayDate));
  const currentHour = new Date().getHours();

  const visibleStartHour =
    fixedStartHour !== undefined
      ? clamp(fixedStartHour, FIRST_VISIBLE_HOUR, LAST_VISIBLE_START_HOUR)
      : getVisibleStartHour(currentHour);
  const timeSlots: TimeSlot[] = getTimeSlots(visibleStartHour);
  const visibleEndHour = visibleStartHour + VISIBLE_HOURS;

  const currentMondayIso = toIso(currentMonday);
  const visibleWeek =
    weeks.find((week) => {
      const monday = week.days.find((day) => day.day === "Monday");
      return monday?.date === currentMondayIso;
    }) ?? null;

  const displayDays: DisplayDay[] = visibleWeek
    ? visibleWeek.days.filter((d) => WEEKDAY_ABBR[d.day] !== undefined).slice(0, 7)
    : getWeekDays(currentMonday);

  const dayDates = displayDays.map((d) => d.date);
  const visibleWeekDaysByDate = new Map<string, MockDashboardDay>(
    (visibleWeek?.days ?? []).map((day) => [day.date, day]),
  );

  const positioned = multiDayTasks
    .flatMap((task) => {
      const covered = dayDates
        .map((date, i) => (date >= task.startDate && date <= task.endDate ? i : -1))
        .filter((i) => i !== -1);
      if (covered.length === 0) return [];
      const firstCol = dayIndexToGridCol(covered[0]);
      const lastCol = dayIndexToGridCol(covered[covered.length - 1]);
      return [{ ...task, colStart: firstCol, span: lastCol - firstCol + 1 }];
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  const resolvedMultiDay = assignMultiDayRows(positioned);
  const clippedMultiDay =
    maxMultiDayRows !== undefined
      ? resolvedMultiDay.filter((t) => t.row < maxMultiDayRows)
      : resolvedMultiDay;

  const numMultiDayRows =
    clippedMultiDay.length > 0 ? Math.max(...clippedMultiDay.map((t) => t.row)) + 1 : 0;
  const visibleTimedEvents = (
    visibleWeek?.week === activeWeek.week ? timedEvents : []
  ).filter(
    (event) =>
      event.startHour < visibleEndHour &&
      event.startHour + event.durationHours > visibleStartHour,
  );

  const headerLabel = `${MONTH_NAMES[currentMonday.getMonth()]} ${currentMonday.getFullYear()}`;

  const handlePreviousWeek = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    setCurrentMonday((m) => shiftWeek(m, -1));
  };
  const handleNextWeek = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    setCurrentMonday((m) => shiftWeek(m, 1));
  };

  return {
    currentHour,
    visibleStartHour,
    timeSlots,
    displayDays,
    visibleWeek,
    visibleWeekDaysByDate,
    clippedMultiDay,
    multiDayRowCount: numMultiDayRows,
    visibleTimedEvents,
    headerLabel,
    handlePreviousWeek,
    handleNextWeek,
  };
}
