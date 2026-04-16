import clsx from "clsx";
import {
  type TimeSlot,
  type DisplayDay,
  isFutureSlot,
  eventOverlapsSlot,
  dayIndexToGridCol,
  getGridColStartClass,
  getGridRowStartClass,
} from "../../../lib/calendarUtils";
import type { MockDashboardDay } from "../../../lib/mockDashboardMonth";
import type { CalendarEvent } from "../../../hooks/useCalendarWeek";

type WeekTaskPillsLayerProps = {
  displayDays: DisplayDay[];
  timeSlots: TimeSlot[];
  visibleWeekDaysByDate: Map<string, MockDashboardDay>;
  visibleTimedEvents: CalendarEvent[];
  todayDate: string;
  currentHour: number;
};

export default function WeekTaskPillsLayer({
  displayDays,
  timeSlots,
  visibleWeekDaysByDate,
  visibleTimedEvents,
  todayDate,
  currentHour,
}: WeekTaskPillsLayerProps) {
  return (
    <div className="absolute inset-0 grid grid-cols-[48px_repeat(7,minmax(0,1fr))] grid-rows-[repeat(7,minmax(0,1fr))] gap-x-[6px] gap-y-[6px]">
      {timeSlots.map((slot) => <div key={slot.label} />)}
      {displayDays.flatMap((day, dayIndex) => {
        const dayTasks = visibleWeekDaysByDate.get(day.date)?.tasks ?? [];
        const dayEvents = visibleTimedEvents.filter((e) => e.day === day.day);
        const columnClassName = getGridColStartClass(dayIndexToGridCol(dayIndex));
        return timeSlots.map((slot, slotIndex) => {
          const taskItem = dayTasks[slotIndex];
          const hasOverlap = dayEvents.some((e) => eventOverlapsSlot(e, slot.hour));
          const isFuture = isFutureSlot(day.date, slot.hour, todayDate, currentHour);
          const isCompleted = taskItem && !isFuture ? taskItem.done : false;
          const isDark = taskItem?.variant === "dark";

          if (!taskItem || !taskItem.task.trim() || hasOverlap) {
            return (
              <div
                key={`${day.date}-${slot.hour}`}
                className={clsx(
                  "min-h-0",
                  columnClassName,
                  getGridRowStartClass(slotIndex + 1),
                )}
              />
            );
          }

          return (
            <div
              key={taskItem.task}
              className={clsx(
                "relative z-[2] flex min-h-0 min-w-0 items-center justify-start overflow-hidden rounded-[0.3rem] px-[0.45rem]",
                columnClassName,
                getGridRowStartClass(slotIndex + 1),
                isDark ? "bg-[#161c22]" : isCompleted ? "bg-[#d8edf1]/70" : "bg-white/90 shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
              )}
            >
              <p
                className={clsx(
                  "overflow-hidden text-[0.56rem] font-[600] leading-tight break-words line-clamp-2",
                  isDark ? "text-white" : isCompleted ? "text-[#8c959c] line-through" : day.date === todayDate ? "text-[#161c22]" : "text-[#2c353c]",
                )}
              >
                {taskItem.task}
              </p>
            </div>
          );
        });
      })}
    </div>
  );
}
