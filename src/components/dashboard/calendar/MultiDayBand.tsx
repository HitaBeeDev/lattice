import clsx from "clsx";
import {
  getColSpanClass,
  getGridColStartClass,
  getGridRowStartClass,
} from "../../../lib/calendarUtils";
import type { ResolvedMultiDayTask } from "../../../hooks/useCalendarWeek";

type MultiDayBandProps = {
  clippedMultiDay: ResolvedMultiDayTask[];
  rowCount: number;
};

export default function MultiDayBand({ clippedMultiDay, rowCount }: MultiDayBandProps) {
  if (rowCount === 0) {
    return <div className="h-1 flex-none" />;
  }

  return (
    <div className="pointer-events-none grid flex-none grid-cols-[48px_repeat(7,minmax(0,1fr))] auto-rows-[20px] gap-x-[6px] gap-y-[2px] pb-1">
      {clippedMultiDay.map((task) => {
        return (
          <div
            key={task.id}
            className={clsx(
              "h-5 flex items-center overflow-hidden rounded-[0.3rem] pl-[0.5rem]",
              getGridRowStartClass(task.row + 1),
              getGridColStartClass(task.colStart),
              getColSpanClass(task.span),
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
        );
      })}
    </div>
  );
}
