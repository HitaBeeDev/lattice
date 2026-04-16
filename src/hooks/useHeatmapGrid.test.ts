import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useHeatmapGrid } from "./useHeatmapGrid";
import type { HabitHeatmapEntry } from "../lib/mockHabitHeatmap";

// ---------------------------------------------------------------------------
// Mock ResizeObserver — jsdom doesn't implement it
// ---------------------------------------------------------------------------

beforeEach(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeEntry = (date: string, completed: number, total: number): HabitHeatmapEntry => ({
  date,
  completedHabits: completed,
  totalHabits: total,
});

// ---------------------------------------------------------------------------
// sortedEntries
// ---------------------------------------------------------------------------

describe("useHeatmapGrid — sortedEntries", () => {
  it("sorts entries oldest-first", () => {
    const entries = [
      makeEntry("2024-03-01", 3, 7),
      makeEntry("2024-01-15", 5, 7),
      makeEntry("2024-02-10", 2, 7),
    ];
    const { result } = renderHook(() => useHeatmapGrid(entries));
    const dates = result.current.sortedEntries.map((e) => e.date);
    expect(dates).toEqual(["2024-01-15", "2024-02-10", "2024-03-01"]);
  });

  it("returns empty array when entries is empty", () => {
    const { result } = renderHook(() => useHeatmapGrid([]));
    expect(result.current.sortedEntries).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// currentStreak
// ---------------------------------------------------------------------------

describe("useHeatmapGrid — currentStreak", () => {
  it("is 0 when all entries have 0 completion", () => {
    const entries = [
      makeEntry("2024-01-01", 0, 7),
      makeEntry("2024-01-02", 0, 7),
    ];
    const { result } = renderHook(() => useHeatmapGrid(entries));
    expect(result.current.currentStreak).toBe(0);
  });

  it("counts consecutive completed entries from the end", () => {
    const entries = [
      makeEntry("2024-01-01", 0, 7), // break
      makeEntry("2024-01-02", 3, 7), // streak
      makeEntry("2024-01-03", 5, 7), // streak
      makeEntry("2024-01-04", 2, 7), // streak (latest)
    ];
    const { result } = renderHook(() => useHeatmapGrid(entries));
    expect(result.current.currentStreak).toBe(3);
  });

  it("is 0 when entries list is empty", () => {
    const { result } = renderHook(() => useHeatmapGrid([]));
    expect(result.current.currentStreak).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// activeDaysThisWeek
// ---------------------------------------------------------------------------

describe("useHeatmapGrid — activeDaysThisWeek", () => {
  it("is 0 when all entries have 0 completion", () => {
    const entries = [makeEntry("2024-01-01", 0, 7)];
    const { result } = renderHook(() => useHeatmapGrid(entries));
    expect(result.current.activeDaysThisWeek).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// visibleEntries and newestEntryDate
// ---------------------------------------------------------------------------

describe("useHeatmapGrid — visibleEntries / newestEntryDate", () => {
  it("newestEntryDate is null when no entries", () => {
    const { result } = renderHook(() => useHeatmapGrid([]));
    expect(result.current.newestEntryDate).toBeNull();
  });

  it("newestEntryDate is the latest date in the sorted list", () => {
    const entries = [
      makeEntry("2024-03-01", 3, 7),
      makeEntry("2024-01-01", 1, 7),
    ];
    const { result } = renderHook(() => useHeatmapGrid(entries));
    // With 0×0 grid size (no ResizeObserver measurement), columns=1, rows=1
    // visibleCellCount = min(1, 2) = 1 → last entry only
    expect(result.current.newestEntryDate).toBe("2024-03-01");
  });

  it("paddedEntries is empty when visibleEntries is empty", () => {
    const { result } = renderHook(() => useHeatmapGrid([]));
    expect(result.current.paddedEntries).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// gridRef
// ---------------------------------------------------------------------------

describe("useHeatmapGrid — gridRef", () => {
  it("exposes a gridRef object", () => {
    const { result } = renderHook(() => useHeatmapGrid([]));
    expect(result.current.gridRef).toBeDefined();
  });
});
