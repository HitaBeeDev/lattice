import { useNavigate } from "react-router-dom";
import type { HabitHeatmapEntry } from "../../lib/mockHabitHeatmap";
import { useHeatmapGrid } from "../../hooks/useHeatmapGrid";
import HeatmapCell from "./HeatmapCell";

type HabitConsistencyCardProps = {
  entries: HabitHeatmapEntry[];
};

// ── Main component ───────────────────────────────────────────────────────────

export default function HabitConsistencyCard({
  entries,
}: HabitConsistencyCardProps): React.ReactElement {
  const navigate = useNavigate();
  const {
    gridRef,
    currentStreak,
    activeDaysThisWeek,
    paddedEntries,
    newestEntryDate,
    visibleEntries,
  } = useHeatmapGrid(entries);

  const goToHabits = (): void => {
    navigate("/habit-tracker");
  };

  return (
    <section className="h-full w-full overflow-visible rounded-[1.2rem] bg-[#cee2e9]/40 p-4">
      <div className="relative flex flex-col w-full h-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-row items-center gap-2">
            <button
              className="text-[0.85rem] font-[400] leading-none text-[#3d454b] transition-colors duration-200 hover:text-[#1f2a33]"
              onClick={goToHabits}
              type="button"
            >
              Habit Consistency
            </button>
            <p className="text-[0.55rem] font-[400] leading-none text-[#a0a6ab]">
              Last {visibleEntries.length} days
            </p>
          </div>

          <div className="flex flex-row items-center gap-3">
            <p className="text-[0.55rem] font-[400] leading-none text-[#6f757b]">
              {currentStreak} day streak
            </p>
            <p className="text-[0.55rem] font-[400] leading-none text-[#6f757b]">
              {activeDaysThisWeek}/7 active days
            </p>
          </div>
        </div>

        <div ref={gridRef} className="flex-1 min-h-0 mt-3">
          <div className="grid h-full w-full auto-rows-[13px] grid-cols-[repeat(auto-fill,minmax(13px,13px))] content-center justify-start gap-1">
            {paddedEntries.map((entry) => (
              <HeatmapCell
                key={entry.date}
                entry={entry}
                isNewest={entry.date === newestEntryDate}
                onClick={goToHabits}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
