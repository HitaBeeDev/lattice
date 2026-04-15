import React from "react";
import { useNavigate } from "react-router-dom";

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

const parseLocalDate = (date: string): Date => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
};

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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
  const lastIndex = entries.length - 1;
  // If today has no completions yet, start from yesterday so a prior streak
  // isn't shown as 0 just because today hasn't been completed.
  const startIndex =
    getCompletionRatio(entries[lastIndex]) === 0 ? lastIndex - 1 : lastIndex;

  for (let index = startIndex; index >= 0; index -= 1) {
    if (getCompletionRatio(entries[index]) === 0) {
      break;
    }

    streak += 1;
  }

  return streak;
};

const getSeededRandom = (seed: number): number => {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
};

const buildBackfilledMockEntry = (date: Date): HabitHeatmapEntry => {
  const totalHabits = 7;
  const dateKey = formatLocalDate(date);
  const daySeed = Number(dateKey.replaceAll("-", ""));
  const weekday = date.getDay();
  const weekdayBias = weekday === 0 ? -0.28 : weekday === 6 ? -0.14 : 0.05;
  const slowTrend = Math.sin(daySeed / 17) * 0.1;
  const mediumTrend = Math.cos(daySeed / 7) * 0.08;
  const noise = (getSeededRandom(daySeed + 41) - 0.5) * 0.18;
  let completionRatio = Math.max(
    0,
    Math.min(1, 0.46 + slowTrend + mediumTrend + weekdayBias + noise),
  );

  if (getSeededRandom(daySeed + 73) < (weekday === 0 ? 0.32 : 0.12)) {
    completionRatio = 0;
  } else if (completionRatio < 0.16) {
    completionRatio = 0;
  }

  return {
    date: dateKey,
    completedHabits: Math.round(completionRatio * totalHabits),
    totalHabits,
  };
};

export function buildMockHabitHeatmapEntries(): HabitHeatmapEntry[] {
  const totalHabits = 7;
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (MOCK_HISTORY_DAYS - 1));
  let previousRatio = 0.52;

  return Array.from({ length: MOCK_HISTORY_DAYS }, (_, index) => {
    const entryDate = new Date(startDate);
    entryDate.setDate(startDate.getDate() + index);

    const dateKey = formatLocalDate(entryDate);
    const daySeed = Number(dateKey.replaceAll("-", ""));
    const weekday = entryDate.getDay();
    const weekdayBias =
      weekday === 0 ? -0.32 : weekday === 6 ? -0.18 : 0.06;
    const slowTrend = Math.sin(index / 8) * 0.11;
    const mediumTrend = Math.cos(index / 3.7) * 0.08;
    const noise = (getSeededRandom(daySeed) - 0.5) * 0.24;
    const driftedRatio =
      previousRatio * 0.58 + 0.34 + slowTrend + mediumTrend + weekdayBias + noise;
    const recoveryBoost =
      index > 0 && previousRatio === 0 && weekday !== 0 ? 0.16 : 0;
    let completionRatio = Math.max(0, Math.min(1, driftedRatio + recoveryBoost));

    // Sprinkle a few real off-days so the heatmap doesn't look uniformly active.
    if (getSeededRandom(daySeed + 17) < (weekday === 0 ? 0.42 : 0.14)) {
      completionRatio = 0;
    } else if (completionRatio < 0.14) {
      completionRatio = 0;
    }

    // Keep the current week looking active enough to feel intentional.
    const daysFromToday = MOCK_HISTORY_DAYS - 1 - index;
    if (daysFromToday < 7 && completionRatio === 0 && weekday !== 0) {
      completionRatio = 0.32 + getSeededRandom(daySeed + 29) * 0.22;
    }

    const completedHabits = Math.round(completionRatio * totalHabits);
    previousRatio = completedHabits === 0 ? 0 : completedHabits / totalHabits;

    return {
      date: dateKey,
      completedHabits,
      totalHabits,
    };
  });
}

export default function HabitConsistencyCard({
  entries,
}: HabitConsistencyCardProps): React.ReactElement {
  const navigate = useNavigate();
  const gridRef = React.useRef<HTMLDivElement | null>(null);
  const [gridSize, setGridSize] = React.useState({ width: 0, height: 0 });
  const sortedEntries = React.useMemo(
    () =>
      [...entries].sort(
        (left, right) =>
          parseLocalDate(left.date).getTime() -
          parseLocalDate(right.date).getTime(),
      ),
    [entries],
  );
  const currentStreak = React.useMemo(
    () => calculateCurrentStreak(sortedEntries),
    [sortedEntries],
  );
  const activeDaysThisWeek = React.useMemo(() => {
    const latestEntry = sortedEntries[sortedEntries.length - 1];
    const today = latestEntry ? parseLocalDate(latestEntry.date) : new Date();
    today.setHours(12, 0, 0, 0);

    const weekday = today.getDay();
    const daysSinceMonday = weekday === 0 ? 6 : weekday - 1;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - daysSinceMonday);

    const entriesThisWeek = sortedEntries.filter((entry) => {
      const entryDate = parseLocalDate(entry.date);
      return entryDate >= startOfWeek && entryDate <= today;
    });

    return entriesThisWeek.filter((entry) => getCompletionRatio(entry) > 0)
      .length;
  }, [sortedEntries]);

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
  const paddedEntries = React.useMemo(() => {
    if (emptyCellCount === 0 || visibleEntries.length === 0) {
      return visibleEntries;
    }

    const firstVisibleDate = parseLocalDate(visibleEntries[0].date);
    const leadingEntries = Array.from({ length: emptyCellCount }, (_, index) => {
      const entryDate = new Date(firstVisibleDate);
      entryDate.setDate(firstVisibleDate.getDate() - (emptyCellCount - index));

      return buildBackfilledMockEntry(entryDate);
    });

    return [...leadingEntries, ...visibleEntries];
  }, [emptyCellCount, visibleEntries]);
  const newestEntryDate =
    visibleEntries.length > 0
      ? visibleEntries[visibleEntries.length - 1].date
      : null;
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
              gridTemplateColumns: `repeat(${columnsUsed}, ${cellSize}px)`,
              gap: `${GAP}px`,
            }}
          >
            {paddedEntries.map((entry) => {
              const completionRatio = getCompletionRatio(entry);
              const isNewestDay = entry.date === newestEntryDate;

              return (
                <div key={entry.date} className="relative group">
                  <button
                    className={`block appearance-none border-0 p-0 align-top rounded-[0.24rem] ring-1 ring-[#d9edf2] transition-all duration-200 ease-out group-hover:-translate-y-[1px] group-hover:scale-[1.08] group-hover:ring-[#b4e8f0] ${getCompletionStyles(completionRatio)} ${
                      isNewestDay ? "ring-[#9edee9]" : ""
                    }`}
                    onClick={goToHabits}
                    style={{
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                    }}
                    aria-label={`${formatTooltipDate(entry.date)} — ${entry.completedHabits}/${entry.totalHabits} habits completed`}
                    type="button"
                  />

                  <div
                    className="pointer-events-none absolute bottom-[calc(100%+0.45rem)] left-1/2 z-10 w-max 
                  -translate-x-1/2 rounded-[0.85rem] bg-[#151b20] text-[0.55rem] font-[400] text-white opacity-0 
                   transition-all duration-200 group-hover:-translate-y-1 
                  group-hover:opacity-100 pl-[0.6rem] pr-[0.6rem] pt-[0.15rem] pb-[0.15rem]"
                  >
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
