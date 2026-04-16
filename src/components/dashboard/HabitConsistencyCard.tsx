import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  type HabitHeatmapEntry,
  parseLocalDate,
  formatTooltipDate,
  getCompletionRatio,
  getCompletionStyles,
  calculateHeatmapStreak,
  buildPaddedEntries,
} from "../../lib/mockHabitHeatmap";

type HabitConsistencyCardProps = {
  entries: HabitHeatmapEntry[];
};

const MIN_CELL_SIZE = 13;
const GAP = 4;

type HeatmapCellProps = {
  entry: HabitHeatmapEntry;
  cellSize: number;
  isNewest: boolean;
  onClick: () => void;
};

function HeatmapCell({ entry, cellSize, isNewest, onClick }: HeatmapCellProps) {
  const completionRatio = getCompletionRatio(entry);
  const ariaLabel = `${formatTooltipDate(entry.date)} — ${entry.completedHabits}/${entry.totalHabits} habits completed`;
  return (
    <div className="relative group">
      <button
        className={clsx(
          "block appearance-none border-0 p-0 align-top rounded-[0.24rem]",
          "ring-1 ring-[#d9edf2] transition-all duration-200 ease-out",
          "group-hover:-translate-y-[1px] group-hover:scale-[1.08] group-hover:ring-[#b4e8f0]",
          getCompletionStyles(completionRatio),
          isNewest && "ring-[#9edee9]",
        )}
        onClick={onClick}
        style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
        aria-label={ariaLabel}
        type="button"
      />
      <div className="pointer-events-none absolute bottom-[calc(100%+0.45rem)] left-1/2 z-10 w-max -translate-x-1/2 rounded-[0.85rem] bg-[#151b20] pl-[0.6rem] pr-[0.6rem] pt-[0.15rem] pb-[0.15rem] text-[0.55rem] font-[400] text-white opacity-0 transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
        {ariaLabel}
      </div>
    </div>
  );
}

export default function HabitConsistencyCard({
  entries,
}: HabitConsistencyCardProps): React.ReactElement {
  const navigate = useNavigate();
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });

  const sortedEntries = useMemo(
    () =>
      [...entries].sort(
        (l, r) => parseLocalDate(l.date).getTime() - parseLocalDate(r.date).getTime(),
      ),
    [entries],
  );

  const currentStreak = useMemo(() => calculateHeatmapStreak(sortedEntries), [sortedEntries]);

  const activeDaysThisWeek = useMemo(() => {
    const latestEntry = sortedEntries[sortedEntries.length - 1];
    const today = latestEntry ? parseLocalDate(latestEntry.date) : new Date();
    today.setHours(12, 0, 0, 0);
    const weekday = today.getDay();
    const daysSinceMonday = weekday === 0 ? 6 : weekday - 1;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - daysSinceMonday);
    return sortedEntries.filter((entry) => {
      const entryDate = parseLocalDate(entry.date);
      return entryDate >= startOfWeek && entryDate <= today && getCompletionRatio(entry) > 0;
    }).length;
  }, [sortedEntries]);

  useEffect(() => {
    if (!gridRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setGridSize({ width, height });
    });
    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  const columns = Math.max(1, Math.floor((gridSize.width + GAP) / (MIN_CELL_SIZE + GAP)));
  const rows = Math.max(1, Math.floor((gridSize.height + GAP) / (MIN_CELL_SIZE + GAP)));
  const visibleCellCount = Math.min(columns * rows, sortedEntries.length);
  const visibleEntries = sortedEntries.slice(-visibleCellCount);
  const rowsUsed = Math.max(1, Math.min(rows, Math.ceil(visibleEntries.length / columns)));
  const cellWidth =
    columns > 0 ? (gridSize.width - GAP * (columns - 1)) / columns : MIN_CELL_SIZE;
  const cellHeight =
    rowsUsed > 0 ? (gridSize.height - GAP * (rowsUsed - 1)) / rowsUsed : MIN_CELL_SIZE;
  const cellSize = Math.max(MIN_CELL_SIZE, Math.min(cellWidth, cellHeight));
  const totalGridCells = columns * rowsUsed;
  const emptyCellCount = Math.max(0, totalGridCells - visibleEntries.length);

  const paddedEntries = useMemo(
    () => buildPaddedEntries(visibleEntries, emptyCellCount),
    [emptyCellCount, visibleEntries],
  );

  const newestEntryDate =
    visibleEntries.length > 0 ? visibleEntries[visibleEntries.length - 1].date : null;

  const goToHabits = (): void => {
    navigate("/habit-tracker");
  };

  return (
    <section className="relative col-span-2 row-span-1 row-start-4 flex h-full w-full overflow-visible rounded-[1.2rem] bg-[#cee2e9]/40 p-4">
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
          <div
            className="grid content-center justify-start w-full h-full"
            style={{
              gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
              gap: `${GAP}px`,
            }}
          >
            {paddedEntries.map((entry) => (
              <HeatmapCell
                key={entry.date}
                entry={entry}
                cellSize={cellSize}
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
