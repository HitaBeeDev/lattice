import React from "react";

type HabitHeatmapEntry = {
  date: string;
  completedHabits: number;
  totalHabits: number;
};

type HabitConsistencyCardProps = {
  entries: HabitHeatmapEntry[];
};

const MOCK_HISTORY_DAYS = 84;
const MIN_CELL_SIZE = 13;
const GAP = 4;

const formatTooltipDate = (date: string): string =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T12:00:00`));

const getCompletionRatio = (entry: HabitHeatmapEntry): number =>
  entry.totalHabits > 0 ? entry.completedHabits / entry.totalHabits : 0;

const getCompletionStyles = (ratio: number): string => {
  if (ratio >= 0.85) {
    return "bg-[#63d9ea] shadow-[0_8px_18px_rgba(99,217,234,0.18)]";
  }

  if (ratio >= 0.6) {
    return "bg-[#8be4ef]";
  }

  if (ratio >= 0.3) {
    return "bg-[#c4f0f5]";
  }

  if (ratio > 0) {
    return "bg-[#e8f8fb]";
  }

  return "bg-[#f7fbfc]";
};

const calculateCurrentStreak = (entries: HabitHeatmapEntry[]): number => {
  let streak = 0;

  for (let index = entries.length - 1; index >= 0; index -= 1) {
    if (getCompletionRatio(entries[index]) === 0) {
      break;
    }

    streak += 1;
  }

  return streak;
};

const calculateBestStreak = (entries: HabitHeatmapEntry[]): number => {
  let best = 0;
  let active = 0;

  entries.forEach((entry) => {
    if (getCompletionRatio(entry) > 0) {
      active += 1;
      best = Math.max(best, active);
      return;
    }

    active = 0;
  });

  return best;
};

const getSeededRandom = (seed: number): number => {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
};

export function buildMockHabitHeatmapEntries(): HabitHeatmapEntry[] {
  const totalHabits = 7;
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (MOCK_HISTORY_DAYS - 1));

  return Array.from({ length: MOCK_HISTORY_DAYS }, (_, index) => {
    const entryDate = new Date(startDate);
    entryDate.setDate(startDate.getDate() + index);

    const year = entryDate.getFullYear();
    const month = String(entryDate.getMonth() + 1).padStart(2, "0");
    const day = String(entryDate.getDate()).padStart(2, "0");
    const daySeed = Number(`${year}${month}${day}`);
    const completionNoise = getSeededRandom(daySeed);
    const weekdayBias =
      entryDate.getDay() === 0 || entryDate.getDay() === 6 ? -0.18 : 0.08;
    const completionRatio = Math.max(
      0,
      Math.min(1, 0.18 + completionNoise * 0.78 + weekdayBias),
    );
    const completedHabits = Math.round(completionRatio * totalHabits);

    return {
      date: `${year}-${month}-${day}`,
      completedHabits,
      totalHabits,
    };
  });
}

export default function HabitConsistencyCard({
  entries,
}: HabitConsistencyCardProps): React.ReactElement {
  const gridRef = React.useRef<HTMLDivElement | null>(null);
  const [gridSize, setGridSize] = React.useState({ width: 0, height: 0 });
  const sortedEntries = React.useMemo(
    () =>
      [...entries].sort(
        (left, right) =>
          new Date(`${left.date}T12:00:00`).getTime() -
          new Date(`${right.date}T12:00:00`).getTime(),
      ),
    [entries],
  );
  const weeklyEntries = React.useMemo(
    () => sortedEntries.slice(-7),
    [sortedEntries],
  );
  const currentStreak = React.useMemo(
    () => calculateCurrentStreak(sortedEntries),
    [sortedEntries],
  );
  const bestStreak = React.useMemo(
    () => calculateBestStreak(sortedEntries),
    [sortedEntries],
  );
  const activeDaysThisWeek = React.useMemo(
    () => weeklyEntries.filter((entry) => getCompletionRatio(entry) > 0).length,
    [weeklyEntries],
  );

  React.useEffect(() => {
    if (!gridRef.current) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setGridSize({ width, height });
    });

    observer.observe(gridRef.current);

    return () => observer.disconnect();
  }, []);

  const columns = Math.max(
    1,
    Math.floor((gridSize.width + GAP) / (MIN_CELL_SIZE + GAP)),
  );
  const rows = Math.max(
    1,
    Math.floor((gridSize.height + GAP) / (MIN_CELL_SIZE + GAP)),
  );
  const visibleCellCount = Math.min(columns * rows, sortedEntries.length);
  const visibleEntries = sortedEntries.slice(-visibleCellCount);
  const rowsUsed = Math.max(
    1,
    Math.min(rows, Math.ceil(visibleEntries.length / columns)),
  );
  const columnsUsed = columns;
  const cellWidth =
    columnsUsed > 0
      ? (gridSize.width - GAP * (columnsUsed - 1)) / columnsUsed
      : MIN_CELL_SIZE;
  const cellHeight =
    rowsUsed > 0
      ? (gridSize.height - GAP * (rowsUsed - 1)) / rowsUsed
      : MIN_CELL_SIZE;
  const cellSize = Math.max(MIN_CELL_SIZE, Math.min(cellWidth, cellHeight));
  const totalGridCells = columnsUsed * rowsUsed;
  const emptyCellCount = Math.max(0, totalGridCells - visibleEntries.length);
  const paddedEntries = [
    ...Array.from({ length: emptyCellCount }, () => null),
    ...visibleEntries,
  ];
  const newestEntryDate =
    visibleEntries.length > 0
      ? visibleEntries[visibleEntries.length - 1].date
      : null;

  return (
    <section className="relative col-span-2 row-span-1 row-start-4 flex h-full w-full overflow-hidden rounded-[1.2rem] bg-[#cee2e9]/40 p-4">
      <div className="relative flex flex-col w-full h-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-row items-center gap-2">
            <p className="text-[0.85rem] font-[400] leading-none text-[#3d454b]">
              Habit Consistency
            </p>

            <p className="text-[0.55rem] font-[400] leading-none text-[#a0a6ab]">
              Last {visibleEntries.length} days
            </p>
          </div>

          <div className="flex flex-row items-center gap-3">
            <p className="text-[0.55rem] font-[400] leading-none text-[#6f757b]">
              {currentStreak} day streak
            </p>

            <p className="text-[0.55rem] font-[400] leading-none text-[#6f757b]">
              Best {bestStreak} days
            </p>

            <p className="text-[0.55rem] font-[400] leading-none text-[#6f757b]">
              {activeDaysThisWeek}/{weeklyEntries.length} active days
            </p>
          </div>
        </div>

        <div ref={gridRef} className="flex-1 min-h-0 mt-3">
          <div
            className="grid content-center justify-start w-full h-full"
            style={{
              gridTemplateColumns: `repeat(${columnsUsed}, ${cellSize}px)`,
              gap: `${GAP}px`,
            }}
          >
            {paddedEntries.map((entry, index) => {
              if (!entry) {
                return (
                  <div key={`empty-${index}`} className="relative">
                    <div
                      className="rounded-[0.24rem] bg-[#f7fbfc] ring-1 ring-[#d9edf2]"
                      style={{
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                      }}
                      aria-hidden="true"
                    />
                  </div>
                );
              }

              const completionRatio = getCompletionRatio(entry);
              const isNewestDay = entry.date === newestEntryDate;

              return (
                <div key={entry.date} className="relative group">
                  <div
                    className={`rounded-[0.24rem] ring-1 ring-[#d9edf2] transition-all duration-200 ease-out group-hover:-translate-y-[1px] group-hover:scale-[1.08] group-hover:ring-[#b4e8f0] ${getCompletionStyles(completionRatio)} ${
                      isNewestDay ? "ring-[#9edee9]" : ""
                    }`}
                    style={{
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                    }}
                    aria-label={`${formatTooltipDate(entry.date)} — ${entry.completedHabits}/${entry.totalHabits} habits completed`}
                  />

                  <div className="pointer-events-none absolute bottom-[calc(100%+0.45rem)] left-1/2 z-10 w-max -translate-x-1/2 rounded-[0.85rem] bg-[#151b20] text-[0.62rem] font-[400] text-white opacity-0 shadow-[0_14px_26px_rgba(21,27,32,0.22)] transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
                    {formatTooltipDate(entry.date)} — {entry.completedHabits}/
                    {entry.totalHabits} habits completed
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
