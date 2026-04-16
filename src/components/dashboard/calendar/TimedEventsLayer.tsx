import clsx from "clsx";
import {
  type DisplayDay,
  getGridRowStartClass,
  getRowSpanClass,
} from "../../../lib/calendarUtils";
import type { CalendarEvent } from "../../../hooks/useCalendarWeek";

type TimedEventsLayerProps = {
  displayDays: DisplayDay[];
  visibleTimedEvents: CalendarEvent[];
  visibleStartHour: number;
};

export default function TimedEventsLayer({
  displayDays,
  visibleTimedEvents,
  visibleStartHour,
}: TimedEventsLayerProps) {
  return (
    <div className="absolute inset-0 grid grid-cols-[48px_repeat(7,minmax(0,1fr))] gap-x-[6px]">
      <div />
      {displayDays.map((day) => {
        const dayEvents = visibleTimedEvents.filter((e) => e.day === day.day);
        return (
          <div
            key={day.date}
            className="grid h-full min-w-0 grid-rows-[repeat(7,minmax(0,1fr))] overflow-hidden"
          >
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={clsx(
                  "relative left-1 right-1 min-w-0 overflow-hidden pb-[6px]",
                  getGridRowStartClass(event.startHour - visibleStartHour + 1),
                  getRowSpanClass(event.durationHours),
                )}
              >
                <div
                  className={clsx(
                    "h-full min-w-0 overflow-hidden rounded-[0.45rem] px-1.5 py-1",
                  event.variant === "dark"
                    ? "bg-[#161c22]"
                    : "bg-white/90 shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
                  )}
                >
                  <div className="flex h-full items-start">
                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <p className={clsx("truncate text-[0.56rem] font-[600] leading-tight", event.variant === "dark" ? "text-white" : "text-[#161c22]")}>
                        {event.title}
                      </p>
                      <p className={clsx("truncate text-[0.48rem] leading-tight mt-[0.15rem]", event.variant === "dark" ? "text-[#8a9199]" : "text-[#6f757b]")}>
                        {event.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
