import { memo } from "react";
import { getPercentageFillClass } from "../../lib/progressStyles";

const DAYS_PER_WEEK = 7;

type HabitProgressBarProps = {
  days: boolean[];
};

function HabitProgressBar({ days }: HabitProgressBarProps) {
  const progress = Math.round((days.filter(Boolean).length / DAYS_PER_WEEK) * 100);
  return (
    <div className="flex flex-col items-center justify-center col-span-2 mt-3">
      <div className="w-full h-1.5 rounded-full bg-[#f0f5f6] overflow-hidden">
        <div className={getPercentageFillClass(progress, "h-full rounded-full bg-[#72e1ee] transition-all")} />
      </div>
      <p className="text-[0.65rem] leading-none font-[400] text-[#a0a5ab] mt-2">{progress}%</p>
    </div>
  );
}

const MemoizedHabitProgressBar = memo(HabitProgressBar);

export default MemoizedHabitProgressBar;
