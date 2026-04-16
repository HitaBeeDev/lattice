import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import {
  WEEKDAY_ABBR,
  MONTH_NAMES,
  VISIBLE_HOURS,
  MULTI_DAY_ROW_HEIGHT_PX,
  MULTI_DAY_ROW_GAP_PX,
  DAY_COLUMN_GAP_PX,
  TASK_SLOT_VERTICAL_INSET_PX,
  GRID_COLS,
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
  eventTopPct,
  eventHeightPct,
  isFutureSlot,
  eventOverlapsSlot,
  FIRST_VISIBLE_HOUR,
  LAST_VISIBLE_START_HOUR,
} from "../../lib/calendarUtils";
import type {
  MockDashboardDay,
  MockDashboardWeek,
  MockMultiDayTask,
} from "../../lib/mockDashboardMonth";

interface DashboardCalendarProps {
  activeWeek: MockDashboardWeek;
  weeks: MockDashboardWeek[];
  todayDate: string;
  multiDayTasks: MockMultiDayTask[];
  fixedStartHour?: number;
  hideWeekTasks?: boolean;
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

interface ResolvedMultiDayTask extends MockMultiDayTask {
  colStart: number;
  span: number;
  row: number;
}

// Mock calendar events — only visible on the data week
const TIMED_EVENTS: CalendarEvent[] = [
  { id: "evt-1", title: "Weekly Team Sync", subtitle: "Discuss progress on projects", day: "Tuesday", startHour: 9, durationHours: 1, variant: "dark" },
  { id: "evt-2", title: "Onboarding Session", subtitle: "Introduction for new hires", day: "Tuesday", startHour: 10, durationHours: 1, variant: "light" },
  { id: "evt-3", title: "Design Sync", subtitle: "Review dashboard mockups", day: "Thursday", startHour: 8, durationHours: 1, variant: "light" },
];

// ── Sub-components ──────────────────────────────────────────────────────────

type CalendarNavProps = {
  headerLabel: string;
  onPrevious: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onNext: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

function CalendarNav({ headerLabel, onPrevious, onNext }: CalendarNavProps) {
  const navBtnClass =
    "flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-[#6f757b] transition-colors hover:bg-white hover:text-[#161c22]";
  return (
    <div className="flex items-center justify-between flex-none">
      <button type="button" onClick={onPrevious} className={navBtnClass} aria-label="Previous week">
        <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />
      </button>
      <p className="text-[0.82rem] font-[500] text-[#161c22]">{headerLabel}</p>
      <button type="button" onClick={onNext} className={navBtnClass} aria-label="Next week">
        <ChevronRight className="h-4 w-4" strokeWidth={1.6} />
      </button>
    </div>
  );
}

type CalendarDayHeadersProps = {
  displayDays: DisplayDay[];
  todayDate: string;
};

function CalendarDayHeaders({ displayDays, todayDate }: CalendarDayHeadersProps) {
  return (
    <div
      className="grid flex-none"
      style={{ gridTemplateColumns: GRID_COLS, columnGap: `${DAY_COLUMN_GAP_PX}px` }}
    >
      <div />
      {displayDays.map((day) => {
        const isToday = day.date === todayDate;
        const dateNum = parseInt(day.date.split("-")[2], 10);
        return (
          <div key={day.date} className="flex flex-col items-center gap-[0.2rem]">
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
        );
      })}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function DashboardCalendar({
  activeWeek,
  weeks,
  todayDate,
  multiDayTasks,
  fixedStartHour,
  hideWeekTasks = false,
  maxMultiDayRows,
}: DashboardCalendarProps): React.ReactElement {
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

  // Multi-day tasks — resolve grid positions then assign greedy rows
  const resolvedMultiDayNoRow = multiDayTasks
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

  const rowEndDates: string[] = [];
  const resolvedMultiDay: ResolvedMultiDayTask[] = resolvedMultiDayNoRow.map((task) => {
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

  const clippedMultiDay =
    maxMultiDayRows !== undefined
      ? resolvedMultiDay.filter((t) => t.row < maxMultiDayRows)
      : resolvedMultiDay;

  const numMultiDayRows =
    clippedMultiDay.length > 0
      ? Math.max(...clippedMultiDay.map((t) => t.row)) + 1
      : 0;
  const MULTI_DAY_BAND_HEIGHT_PX =
    numMultiDayRows > 0
      ? numMultiDayRows * MULTI_DAY_ROW_HEIGHT_PX +
        (numMultiDayRows - 1) * MULTI_DAY_ROW_GAP_PX +
        4
      : 4;

  const visibleTimedEvents = (
    visibleWeek?.week === activeWeek.week ? TIMED_EVENTS : []
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

  return (
    <div className="flex flex-col h-full gap-2">
      <CalendarNav
        headerLabel={headerLabel}
        onPrevious={handlePreviousWeek}
        onNext={handleNextWeek}
      />

      <CalendarDayHeaders displayDays={displayDays} todayDate={todayDate} />

      {/* ── Time grid ── */}
      <div className="relative flex-1 min-h-0 overflow-hidden" aria-label="Weekly calendar grid">
        <div className="relative h-full">
          {/* Multi-day band */}
          <div
            className="absolute inset-x-0 top-0 pointer-events-none"
            style={{ height: `${MULTI_DAY_BAND_HEIGHT_PX}px` }}
          >
            {clippedMultiDay.map((task) => {
              const topPx = task.row * (MULTI_DAY_ROW_HEIGHT_PX + MULTI_DAY_ROW_GAP_PX) + 2;
              return (
                <div
                  key={task.id}
                  className="absolute grid w-full"
                  style={{
                    gridTemplateColumns: GRID_COLS,
                    columnGap: `${DAY_COLUMN_GAP_PX}px`,
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

          {/* Time labels + horizontal lines */}
          <div
            className="absolute inset-x-0 bottom-0 grid pointer-events-none"
            style={{ gridTemplateColumns: "48px 1fr", top: `${MULTI_DAY_BAND_HEIGHT_PX}px` }}
          >
            <div className="grid" style={{ gridTemplateRows: `repeat(${VISIBLE_HOURS}, minmax(0, 1fr))` }}>
              {timeSlots.map((slot) => (
                <div key={slot.label} className="flex items-center justify-end pr-2">
                  <span className="text-[0.58rem] leading-none text-[#a0a6ab]">{slot.label}</span>
                </div>
              ))}
            </div>
            <div className="grid" style={{ gridTemplateRows: `repeat(${VISIBLE_HOURS}, minmax(0, 1fr))` }}>
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
              columnGap: `${DAY_COLUMN_GAP_PX}px`,
              top: `${MULTI_DAY_BAND_HEIGHT_PX}px`,
            }}
          >
            <div />
            {displayDays.map((day) => (
              <div
                key={day.date}
                className={clsx(
                  "grid h-full rounded-lg border border-dashed border-[#c0d4dc]/40",
                  day.date === todayDate && "bg-white/20",
                )}
                style={{ gridTemplateRows: `repeat(${VISIBLE_HOURS}, minmax(0, 1fr))` }}
              />
            ))}
          </div>

          {/* Timed events (data week only) */}
          <div
            className="absolute inset-x-0 bottom-0 grid"
            style={{
              gridTemplateColumns: GRID_COLS,
              columnGap: `${DAY_COLUMN_GAP_PX}px`,
              top: `${MULTI_DAY_BAND_HEIGHT_PX}px`,
            }}
          >
            <div />
            {displayDays.map((day) => {
              const dayEvents = visibleTimedEvents.filter((e) => e.day === day.day);
              return (
                <div key={day.date} className="relative h-full min-w-0 overflow-hidden">
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
                              event.variant === "dark" ? "text-white" : "text-[#161c22]",
                            )}
                          >
                            {event.title}
                          </p>
                          <p
                            className={clsx(
                              "truncate text-[0.48rem] leading-tight mt-[0.15rem]",
                              event.variant === "dark" ? "text-[#8a9199]" : "text-[#6f757b]",
                            )}
                          >
                            {event.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Week task pills */}
          {visibleWeek && !hideWeekTasks && (
            <div
              className="absolute inset-x-0 bottom-0 grid"
              style={{
                gridTemplateColumns: GRID_COLS,
                gridTemplateRows: `repeat(${VISIBLE_HOURS}, minmax(0, 1fr))`,
                columnGap: `${DAY_COLUMN_GAP_PX}px`,
                rowGap: `${TASK_SLOT_VERTICAL_INSET_PX * 2}px`,
                top: `${MULTI_DAY_BAND_HEIGHT_PX}px`,
              }}
            >
              {timeSlots.map((slot) => (
                <div key={slot.label} />
              ))}
              {displayDays.flatMap((day, dayIndex) => {
                const dayTasks = visibleWeekDaysByDate.get(day.date)?.tasks ?? [];
                const dayEvents = visibleTimedEvents.filter((event) => event.day === day.day);
                return timeSlots.map((slot, slotIndex) => {
                  const taskItem = dayTasks[slotIndex];
                  const hasOverlappingEvent = dayEvents.some((event) =>
                    eventOverlapsSlot(event, slot.hour),
                  );
                  const isFutureTaskSlot = isFutureSlot(
                    day.date,
                    slot.hour,
                    todayDate,
                    currentHour,
                  );
                  const isCompleted = taskItem && !isFutureTaskSlot ? taskItem.done : false;
                  const isDarkTask = taskItem?.variant === "dark";

                  if (!taskItem || !taskItem.task.trim() || hasOverlappingEvent) {
                    return (
                      <div
                        key={`${day.date}-${slot.hour}`}
                        className="min-h-0"
                        style={{ gridColumn: dayIndex + 2, gridRow: slotIndex + 1 }}
                      />
                    );
                  }

                  return (
                    <div
                      key={taskItem.task}
                      className={clsx(
                        "relative z-[2] flex min-h-0 min-w-0 items-center justify-start overflow-hidden rounded-[0.3rem] px-[0.45rem]",
                        isDarkTask
                          ? "bg-[#161c22]"
                          : isCompleted
                          ? "bg-[#d8edf1]/70"
                          : "bg-white/90 shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
                      )}
                      style={{ gridColumn: dayIndex + 2, gridRow: slotIndex + 1 }}
                    >
                      <p
                        className={clsx(
                          "overflow-hidden text-[0.56rem] font-[600] leading-tight break-words [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]",
                          isDarkTask
                            ? "text-white"
                            : isCompleted
                            ? "text-[#8c959c] line-through"
                            : day.date === todayDate
                            ? "text-[#161c22]"
                            : "text-[#2c353c]",
                        )}
                      >
                        {taskItem.task}
                      </p>
                    </div>
                  );
                });
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
