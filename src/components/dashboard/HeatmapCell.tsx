import clsx from "clsx";
import {
  formatTooltipDate,
  getCompletionRatio,
  getCompletionStyles,
  type HabitHeatmapEntry,
} from "../../lib/mockHabitHeatmap";

type HeatmapCellProps = {
  entry: HabitHeatmapEntry;
  isNewest: boolean;
  onClick: () => void;
};

export default function HeatmapCell({ entry, isNewest, onClick }: HeatmapCellProps) {
  const completionRatio = getCompletionRatio(entry);
  const ariaLabel = `${formatTooltipDate(entry.date)} — ${entry.completedHabits}/${entry.totalHabits} habits completed`;
  return (
    <div className="relative group">
      <button
        className={clsx(
          "block h-[13px] w-[13px] appearance-none rounded-[0.24rem] border-0 p-0 align-top",
          "ring-1 ring-[#d9edf2] transition-all duration-200 ease-out",
          "group-hover:-translate-y-[1px] group-hover:scale-[1.08] group-hover:ring-[#b4e8f0]",
          getCompletionStyles(completionRatio),
          isNewest && "ring-[#9edee9]",
        )}
        onClick={onClick}
        aria-label={ariaLabel}
        type="button"
      />
      <div className="pointer-events-none absolute bottom-[calc(100%+0.45rem)] left-1/2 z-10 w-max -translate-x-1/2 rounded-[0.85rem] bg-[#151b20] pl-[0.6rem] pr-[0.6rem] pt-[0.15rem] pb-[0.15rem] text-[0.55rem] font-[400] text-white opacity-0 transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
        {ariaLabel}
      </div>
    </div>
  );
}
