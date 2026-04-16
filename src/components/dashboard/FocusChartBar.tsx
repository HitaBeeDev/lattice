import clsx from "clsx";
import { getBarHeightClass } from "../../lib/progressStyles";

const FOCUS_CHART_REFERENCE_MINUTES = 480;

export type ProgressChartItem = {
  day: string;
  focusMinutes: number;
  label: string;
  isToday: boolean;
  isMuted: boolean;
  isFuture: boolean;
};

export default function FocusChartBar({ item }: { item: ProgressChartItem }) {
  const barHeightClass = getBarHeightClass(item.focusMinutes, FOCUS_CHART_REFERENCE_MINUTES);
  return (
    <div className="group relative flex w-7 flex-none flex-col items-center justify-end gap-[0.3rem]">
      <div className="flex items-center">
        <span
          className={clsx(
            "flex w-max items-center justify-center whitespace-nowrap rounded-full px-[0.4rem] py-[0.2rem] text-[0.5rem] font-[400] leading-none transition-all duration-200",
            item.isToday
              ? "bg-[#72e1ee] text-[#50585e] opacity-100 shadow-[0_6px_18px_rgba(114,225,238,0.22)]"
              : item.isFuture
                ? "opacity-0"
                : "bg-[#161c22] text-white opacity-0 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100",
          )}
        >
          {item.label}
        </span>
      </div>
      <div className="flex items-end">
        {!item.isFuture && (
          <div
            className={clsx(
              "rounded-full transition-transform duration-200 group-hover:scale-y-[1.04]",
              barHeightClass,
              item.isToday ? "bg-[#72e1ee] w-[7px] shadow-[0_0_0_1px_rgba(114,225,238,0.08)]" : item.isMuted ? "bg-[#d3d6d9] w-[6px]" : "bg-[#12171b] w-[6px]",
            )}
          />
        )}
      </div>
      {!item.isFuture && (
        <span className={clsx("h-[0.38rem] w-[0.38rem] rounded-full", item.isToday ? "bg-[#72e1ee]" : item.isMuted ? "bg-[#d3d6d9]" : "bg-[#12171b]")} />
      )}
      <span className="text-[0.55rem] font-[400] uppercase leading-none tracking-[0.08em] text-[#a0a6ab]">{item.day}</span>
    </div>
  );
}
