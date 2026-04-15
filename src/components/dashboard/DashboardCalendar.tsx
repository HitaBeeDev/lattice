import { Fragment, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import type {
  MockDashboardDay,
  MockDashboardWeek,
  MockMultiDayTask,
} from "../../lib/mockDashboardMonth";

interface DashboardCalendarProps {
  activeWeek: MockDashboardWeek;
  weeks: MockDashboardWeek[];
  todayDate: string; // real ISO today, e.g. "2026-04-14"
  multiDayTasks: MockMultiDayTask[];
  /** Pin the visible hour window to a fixed start instead of using real clock time */
  fixedStartHour?: number;
  /** Hide the per-day todo pills so only timed events show */
  hideWeekTodos?: boolean;
  /** Cap the multi-day band to this many rows */
  maxMultiDayRows?: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  subtitle: string;
  day: string;
  startHour: number;
  durationHours: number;
  variant: "dark" | "light";
}

interface TimeSlot {
  label: string;
  hour: number;
}

interface DisplayDay {
  day: string;
  date: string;
}

interface ResolvedMultiDayTask extends MockMultiDayTask {
  colStart: number;
  span: number;
  row: number;
}

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const WEEKDAY_ABBR: Record<string, string> = {
  Sunday: "Sun",
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
};

const MONTH_NAMES = [
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
];

const VISIBLE_HOURS = 4;
const FIRST_VISIBLE_HOUR = 6;
const LAST_VISIBLE_START_HOUR = 20;
const MULTI_DAY_ROW_HEIGHT_PX = 20;
const MULTI_DAY_ROW_GAP_PX = 2;

// Mock calendar events — only visible on the data week (March 23–28)
const TIMED_EVENTS: CalendarEvent[] = [
  {
    id: "evt-1",
    title: "Weekly Team Sync",
    subtitle: "Discuss progress on projects",
    day: "Tuesday",
    startHour: 9,
    durationHours: 1,
    variant: "dark",
  },
  {
    id: "evt-2",
    title: "Onboarding Session",
    subtitle: "Introduction for new hires",
    day: "Tuesday",
    startHour: 10,
    durationHours: 1,
    variant: "light",
  },
  {
    id: "evt-3",
    title: "Design Sync",
    subtitle: "Review dashboard mockups",
    day: "Thursday",
    startHour: 8,
    durationHours: 1,
    variant: "light",
  },
];

function toIso(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/** Monday of the week containing the given ISO date string. */
function getMondayOf(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  const dow = d.getDay(); // 0=Sun
  const offset = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + offset);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDays(monday: Date): DisplayDay[] {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() - 1);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return { day: WEEKDAY_NAMES[d.getDay()], date: toIso(d) };
  });
}

function shiftWeek(monday: Date, direction: -1 | 1): Date {
  const d = new Date(monday);
  d.setDate(d.getDate() + direction * 7);
  return d;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function formatHourLabel(hour: number): string {
  const normalizedHour = ((hour % 24) + 24) % 24;
  const suffix = normalizedHour >= 12 ? "pm" : "am";
  const displayHour = normalizedHour % 12 || 12;

  return `${displayHour}:00 ${suffix}`;
}

function getVisibleStartHour(currentHour: number): number {
  return clamp(currentHour - 1, FIRST_VISIBLE_HOUR, LAST_VISIBLE_START_HOUR);
}

function getTimeSlots(startHour: number): TimeSlot[] {
  return Array.from({ length: VISIBLE_HOURS }, (_, index) => ({
    hour: startHour + index,
    label: formatHourLabel(startHour + index),
  }));
}

function eventTopPct(startHour: number, visibleStartHour: number): number {
  return ((startHour - visibleStartHour) / VISIBLE_HOURS) * 100;
}

function eventHeightPct(durationHours: number): number {
  return (durationHours / VISIBLE_HOURS) * 100;
}

function isFutureDate(date: string, todayDate: string): boolean {
  return date > todayDate;
}

function isFutureSlot(
  date: string,
  slotHour: number,
  todayDate: string,
  currentHour: number,
): boolean {
  return date === todayDate ? slotHour > currentHour : isFutureDate(date, todayDate);
}

function eventOverlapsSlot(event: CalendarEvent, slotHour: number): boolean {
  return (
    event.startHour <= slotHour &&
    event.startHour + event.durationHours > slotHour
  );
}

export default function DashboardCalendar({
  activeWeek,
  weeks,
  todayDate,
  multiDayTasks,
  fixedStartHour,
  hideWeekTodos = false,
  maxMultiDayRows,
}: DashboardCalendarProps): React.ReactElement {
  // Always open on the week that contains today
  const [currentMonday, setCurrentMonday] = useState<Date>(() =>
    getMondayOf(todayDate),
  );
  const currentHour = new Date().getHours();
  const visibleStartHour =
    fixedStartHour !== undefined
      ? clamp(fixedStartHour, FIRST_VISIBLE_HOUR, LAST_VISIBLE_START_HOUR)
      : getVisibleStartHour(currentHour);
  const timeSlots = getTimeSlots(visibleStartHour);
  const visibleEndHour = visibleStartHour + VISIBLE_HOURS;

  const currentMondayIso = toIso(currentMonday);
  const visibleWeek =
    weeks.find((week) => {
      const monday = week.days.find((day) => day.day === "Monday");
      return monday?.date === currentMondayIso;
    }) ?? null;

  // Compute Sun–Sat display days
  const displayDays: DisplayDay[] = visibleWeek
    ? visibleWeek.days
        .filter((d) => WEEKDAY_ABBR[d.day] !== undefined)
        .slice(0, 7)
    : getWeekDays(currentMonday);

  const dayDates = displayDays.map((d) => d.date);
  const visibleWeekDaysByDate = new Map<string, MockDashboardDay>(
    (visibleWeek?.days ?? []).map((day) => [day.date, day]),
  );

  // Multi-day tasks — show all that overlap the visible week dates
  const resolvedMultiDayNoRow = multiDayTasks
    .flatMap((task) => {
      const covered = dayDates
        .map((date, i) =>
          date >= task.startDate && date <= task.endDate ? i : -1,
        )
        .filter((i) => i !== -1);
      if (covered.length === 0) return [];
      const firstCol = dayIndexToGridCol(covered[0]);
      const lastCol = dayIndexToGridCol(covered[covered.length - 1]);
    return [
        {
          ...task,
          colStart: firstCol,
          span: lastCol - firstCol + 1,
        },
      ];
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  // Greedy row assignment: pack tasks into rows without date overlap
  const rowEndDates: string[] = [];
  const resolvedMultiDay: ResolvedMultiDayTask[] = resolvedMultiDayNoRow.map(
    (task) => {
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
    },
  );

  const clippedMultiDay =
    maxMultiDayRows !== undefined
      ? resolvedMultiDay.filter((t) => t.row < maxMultiDayRows)
      : resolvedMultiDay;

  const numMultiDayRows = clippedMultiDay.length > 0
    ? Math.max(...clippedMultiDay.map((t) => t.row)) + 1
    : 0;
  const MULTI_DAY_BAND_HEIGHT_PX =
    numMultiDayRows > 0
      ? numMultiDayRows * MULTI_DAY_ROW_HEIGHT_PX +
        (numMultiDayRows - 1) * MULTI_DAY_ROW_GAP_PX +
        4
      : 4;
  // TIMED_EVENTS only on the data week
  const visibleTimedEvents = (
    visibleWeek?.week === activeWeek.week ? TIMED_EVENTS : []
  ).filter(
    (event) =>
      event.startHour < visibleEndHour &&
      event.startHour + event.durationHours > visibleStartHour,
  );

  const headerLabel = `${MONTH_NAMES[currentMonday.getMonth()]} ${currentMonday.getFullYear()}`;
  // Column 1 = 48px time label; columns 2-4 = Mon-Wed; column 5 = 8px mid-week gap; columns 6-9 = Thu-Sun
  const GRID_COLS = "48px 1fr 1fr 1fr 8px 1fr 1fr 1fr 1fr";

  /** Maps a day index (0=Mon … 6=Sun) to its 1-based grid column number. */
  const dayIndexToGridCol = (i: number): number => (i < 3 ? i + 2 : i + 3);
  const handlePreviousWeek = (
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    event.stopPropagation();
    setCurrentMonday((m) => shiftWeek(m, -1));
  };
  const handleNextWeek = (
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    event.stopPropagation();
    setCurrentMonday((m) => shiftWeek(m, 1));
  };

  return (
    <div className="flex flex-col h-full gap-2">
      {/* ── Navigation ── */}
      <div className="flex items-center justify-between flex-none">
        <button
          type="button"
          onClick={handlePreviousWeek}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-[#6f757b] transition-colors hover:bg-white hover:text-[#161c22]"
          aria-label="Previous week"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />
        </button>

        <p className="text-[0.82rem] font-[500] text-[#161c22]">
          {headerLabel}
        </p>

        <button
          type="button"
          onClick={handleNextWeek}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-[#6f757b] transition-colors hover:bg-white hover:text-[#161c22]"
          aria-label="Next week"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.6} />
        </button>
      </div>

      {/* ── Day headers ── */}
      <div
        className="grid flex-none"
        style={{ gridTemplateColumns: GRID_COLS }}
      >
        <div />
        {displayDays.map((day) => {
          const isToday = day.date === todayDate;
          const dateNum = parseInt(day.date.split("-")[2], 10);
          return (
            <Fragment key={day.date}>
              <div className="flex flex-col items-center gap-[0.2rem]">
                <span className="text-[0.52rem] font-[400] uppercase tracking-[0.07em] text-[#a0a6ab]">
                  {WEEKDAY_ABBR[day.day]}
                </span>
                <span
                  className={clsx(
                    "flex h-[1.3rem] w-[1.3rem] items-center justify-center rounded-full text-[0.75rem] font-[500] leading-none",
                    isToday ? "bg-[#72e1ee] text-[#0a1929]" : "text-[#3d454b]",
                  )}
                >
                  {dateNum}
                </span>
              </div>
              {day.day === "Wednesday" && <div />}
            </Fragment>
          );
        })}
      </div>

      {/* ── Time grid ── */}
      <div
        className="relative flex-1 min-h-0 overflow-hidden"
        aria-label="Weekly calendar grid"
      >
        <div
          className="relative h-full"
        >
          <div
            className="absolute inset-x-0 top-0 pointer-events-none"
            style={{
              height: `${MULTI_DAY_BAND_HEIGHT_PX}px`,
            }}
          >
            {clippedMultiDay.map((task) => {
              const topPx =
                task.row * (MULTI_DAY_ROW_HEIGHT_PX + MULTI_DAY_ROW_GAP_PX) + 2;
              return (
                <div
                  key={task.id}
                  className="absolute grid w-full"
                  style={{
                    gridTemplateColumns: GRID_COLS,
                    columnGap: "4px",
                    top: `${topPx}px`,
                    height: `${MULTI_DAY_ROW_HEIGHT_PX}px`,
                  }}
                >
                  <div />
                  <div
                    style={{
                      gridColumn: `${task.colStart} / span ${task.span}`,
                      height: `${MULTI_DAY_ROW_HEIGHT_PX}px`,
                    }}
                    className={clsx(
                      "flex items-center pl-[0.5rem] rounded-[0.3rem] overflow-hidden",
                      task.variant === "dark"
                        ? "bg-[#161c22]"
                        : "bg-white/90 shadow-[0_1px_4px_rgba(0,0,0,0.08)]",
                    )}
                  >
                    <p
                      className={clsx(
                        "truncate text-[0.56rem] font-[600] leading-tight",
                        task.variant === "dark" ? "text-white" : "text-[#161c22]",
                      )}
                    >
                      {task.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time lines + labels */}
            <div
              className="absolute inset-x-0 bottom-0 grid pointer-events-none"
              style={{
                gridTemplateColumns: "48px 1fr",
                top: `${MULTI_DAY_BAND_HEIGHT_PX}px`,
              }}
            >
              <div
                className="grid"
                style={{ gridTemplateRows: `repeat(${VISIBLE_HOURS}, minmax(0, 1fr))` }}
              >
                {timeSlots.map((slot) => (
                  <div
                    key={slot.label}
                    className="flex items-center justify-end pr-2"
                  >
                    <span className="text-[0.58rem] leading-none text-[#a0a6ab]">
                      {slot.label}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="grid"
                style={{ gridTemplateRows: `repeat(${VISIBLE_HOURS}, minmax(0, 1fr))` }}
              >
                {timeSlots.map((slot) => (
                  <div key={slot.label} className="flex items-center">
                    <div className="w-full border-t border-dashed border-[#c0d4dc]/50" />
                  </div>
                ))}
              </div>
            </div>

          {/* Day column backgrounds */}
          <div
            className="absolute inset-x-0 bottom-0 grid"
            style={{
              gridTemplateColumns: GRID_COLS,
              columnGap: "4px",
              top: `${MULTI_DAY_BAND_HEIGHT_PX}px`,
            }}
          >
            <div />
            {displayDays.map((day) => (
              <Fragment key={day.date}>
                <div
                  className={clsx(
                    "grid h-full rounded-lg border border-dashed border-[#c0d4dc]/40",
                    day.date === todayDate && "bg-white/20",
                  )}
                  style={{
                    gridTemplateRows: `repeat(${VISIBLE_HOURS}, minmax(0, 1fr))`,
                  }}
                />
                {day.day === "Wednesday" && <div />}
              </Fragment>
            ))}
          </div>

          {/* Single-day timed events (data week only) */}
          <div
            className="absolute inset-x-0 bottom-0 grid"
            style={{
              gridTemplateColumns: GRID_COLS,
              columnGap: "4px",
              top: `${MULTI_DAY_BAND_HEIGHT_PX}px`,
            }}
          >
            <div />
            {displayDays.map((day) => {
              const dayEvents = visibleTimedEvents.filter(
                (e) => e.day === day.day,
              );
              return (
                <Fragment key={day.date}>
                <div className="relative h-full min-w-0 overflow-hidden">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={clsx(
                        "absolute left-1 right-1 min-w-0 overflow-hidden rounded-[0.45rem] px-1.5 py-1",
                        event.variant === "dark"
                          ? "bg-[#161c22]"
                          : "bg-white/90 shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
                      )}
                      style={{
                        top: `${eventTopPct(event.startHour, visibleStartHour)}%`,
                        height: `calc(${eventHeightPct(event.durationHours)}% - 6px)`,
                      }}
                    >
                      <div className="flex h-full items-start">
                        <div className="flex min-w-0 flex-1 flex-col justify-center">
                          <p
                            className={clsx(
                              "truncate text-[0.56rem] font-[600] leading-tight",
                              event.variant === "dark"
                                ? "text-white"
                                : "text-[#161c22]",
                            )}
                          >
                            {event.title}
                          </p>
                          <p
                            className={clsx(
                              "truncate text-[0.48rem] leading-tight mt-[0.15rem]",
                              event.variant === "dark"
                                ? "text-[#8a9199]"
                                : "text-[#6f757b]",
                            )}
                          >
                            {event.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {day.day === "Wednesday" && <div />}
              </Fragment>
              );
            })}
          </div>

          {/* Week todos — one column per day for the visible week */}
          {visibleWeek && !hideWeekTodos && (
            <div
              className="absolute inset-x-0 bottom-0 grid"
              style={{
                gridTemplateColumns: GRID_COLS,
                gridTemplateRows: "1fr",
                columnGap: "6px",
                top: `${MULTI_DAY_BAND_HEIGHT_PX}px`,
              }}
            >
              <div />
              {displayDays.map((day) => {
                const dayTodos = visibleWeekDaysByDate.get(day.date)?.todos ?? [];
                const dayEvents = visibleTimedEvents.filter(
                  (event) => event.day === day.day,
                );

                return (
                  <Fragment key={day.date}>
                  <div
                    className="grid h-full min-w-0 gap-[0.3rem]"
                    style={{
                      gridTemplateRows: `repeat(${VISIBLE_HOURS}, minmax(0, 1fr))`,
                    }}
                  >
                    {timeSlots.map((slot, index) => {
                      const todo = dayTodos[index];
                      const hasOverlappingEvent = dayEvents.some((event) =>
                        eventOverlapsSlot(event, slot.hour),
                      );
                      const isFutureTodoSlot = isFutureSlot(
                        day.date,
                        slot.hour,
                        todayDate,
                        currentHour,
                      );
                      const isCompleted =
                        todo && !isFutureTodoSlot ? todo.done : false;
                      const isDarkTodo = todo?.variant === "dark";

                      if (!todo || !todo.task.trim() || hasOverlappingEvent) {
                        return (
                          <div
                            key={`${day.date}-${slot.hour}`}
                            className="h-full"
                          />
                        );
                      }

                      return (
                        <div key={todo.task} className="h-full min-h-0">
                          <div
                            className={clsx(
                              "relative z-[2] flex h-full min-h-0 min-w-0 items-center justify-start overflow-hidden rounded-[0.3rem] px-[0.45rem]",
                              isDarkTodo
                                ? "bg-[#161c22]"
                                : isCompleted
                                ? "bg-[#d8edf1]/70"
                                : "bg-white/90 shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
                            )}
                            style={{
                              width:
                                todo.spanDays && todo.spanDays > 1
                                  ? `calc(${todo.spanDays * 100}% + ${(todo.spanDays - 1) * 6}px)`
                                  : "100%",
                            }}
                          >
                            <p
                              className={clsx(
                                "overflow-hidden text-[0.56rem] font-[600] leading-tight break-words [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]",
                                isDarkTodo
                                  ? "text-white"
                                  : isCompleted
                                  ? "text-[#8c959c] line-through"
                                  : day.date === todayDate
                                    ? "text-[#161c22]"
                                    : "text-[#2c353c]",
                              )}
                            >
                              {todo.task}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {day.day === "Wednesday" && <div />}
                  </Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
