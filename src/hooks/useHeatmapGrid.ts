import { useEffect, useMemo, useRef, useState } from "react";
import {
  type HabitHeatmapEntry,
  parseLocalDate,
  getCompletionRatio,
  calculateHeatmapStreak,
  buildPaddedEntries,
} from "../lib/mockHabitHeatmap";

const MIN_CELL_SIZE = 13;
const GAP = 4;

type HeatmapGridState = {
  gridRef: React.RefObject<HTMLDivElement>;
  sortedEntries: HabitHeatmapEntry[];
  currentStreak: number;
  activeDaysThisWeek: number;
  paddedEntries: HabitHeatmapEntry[];
  newestEntryDate: string | null;
  visibleEntries: HabitHeatmapEntry[];
};

export function useHeatmapGrid(entries: HabitHeatmapEntry[]): HeatmapGridState {
  const gridRef = useRef<HTMLDivElement>(null);
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
  const totalGridCells = columns * rowsUsed;
  const emptyCellCount = Math.max(0, totalGridCells - visibleEntries.length);

  const paddedEntries = useMemo(
    () => buildPaddedEntries(visibleEntries, emptyCellCount),
    [emptyCellCount, visibleEntries],
  );

  const newestEntryDate =
    visibleEntries.length > 0 ? visibleEntries[visibleEntries.length - 1].date : null;

  return {
    gridRef,
    sortedEntries,
    currentStreak,
    activeDaysThisWeek,
    paddedEntries,
    newestEntryDate,
    visibleEntries,
  };
}
