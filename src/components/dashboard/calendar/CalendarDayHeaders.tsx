import clsx from "clsx";
import { WEEKDAY_ABBR, type DisplayDay } from "../../../lib/calendarUtils";

type CalendarDayHeadersProps = {
  displayDays: DisplayDay[];
  todayDate: string;
};

export default function CalendarDayHeaders({ displayDays, todayDate }: CalendarDayHeadersProps) {
  return (
    <div className="grid flex-none grid-cols-[48px_repeat(7,minmax(0,1fr))] gap-x-[6px]">
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
