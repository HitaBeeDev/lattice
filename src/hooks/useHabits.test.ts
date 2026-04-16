import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Habit } from "../types/habit";
import { useHabits } from "./useHabits";

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

// useLiveQuery returns the result of a Dexie live query.
// We mock it to return a controlled value so tests never touch IndexedDB.
vi.mock("dexie-react-hooks", () => ({
  useLiveQuery: vi.fn(),
}));

// Mock db so CRUD calls are captured without opening a real database.
vi.mock("../db/database", () => ({
  db: {
    habits: {
      add: vi.fn().mockResolvedValue("mock-id"),
      put: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    },
  },
}));

// ---------------------------------------------------------------------------
// Import mocked modules after vi.mock declarations
// ---------------------------------------------------------------------------

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/database";

const mockUseLiveQuery = vi.mocked(useLiveQuery);
const mockHabitsTable = vi.mocked(db.habits);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeHabit = (overrides: Partial<Habit> = {}): Habit => ({
  id: `habit-${Math.random().toString(36).slice(2)}`,
  name: "Morning run",
  category: "fitness",
  frequency: "daily",
  days: Array<boolean>(7).fill(false),
  isArchived: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  // Default: empty habit list (loading resolved)
  mockUseLiveQuery.mockReturnValue([]);
});

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------

describe("useHabits — loading state", () => {
  it("reports isLoading=true when useLiveQuery returns undefined", () => {
    mockUseLiveQuery.mockReturnValue(undefined);
    const { result } = renderHook(() => useHabits());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.habits).toEqual([]);
  });

  it("reports isLoading=false when useLiveQuery returns an array", () => {
    mockUseLiveQuery.mockReturnValue([]);
    const { result } = renderHook(() => useHabits());
    expect(result.current.isLoading).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Derived state
// ---------------------------------------------------------------------------

describe("useHabits — derived state", () => {
  it("totalHabits matches the number of habits", () => {
    mockUseLiveQuery.mockReturnValue([makeHabit(), makeHabit()]);
    const { result } = renderHook(() => useHabits());
    expect(result.current.totalHabits).toBe(2);
  });

  it("completedHabits counts habits with all days marked true", () => {
    const fullHabit = makeHabit({ days: Array<boolean>(7).fill(true) });
    const partialHabit = makeHabit({
      days: [true, false, true, true, true, true, true],
    });
    mockUseLiveQuery.mockReturnValue([fullHabit, partialHabit]);
    const { result } = renderHook(() => useHabits());
    expect(result.current.completedHabits).toBe(1);
  });

  it("percentages has 7 entries (one per weekday)", () => {
    mockUseLiveQuery.mockReturnValue([makeHabit()]);
    const { result } = renderHook(() => useHabits());
    expect(result.current.percentages).toHaveLength(7);
  });

  it("percentages are 0 when no days are marked", () => {
    mockUseLiveQuery.mockReturnValue([makeHabit()]);
    const { result } = renderHook(() => useHabits());
    expect(result.current.percentages.every((p) => p === 0)).toBe(true);
  });

  it("percentages are 100 for days where all habits are marked", () => {
    // Single habit with all days true → every day should be 100%
    const habit = makeHabit({ days: Array<boolean>(7).fill(true) });
    mockUseLiveQuery.mockReturnValue([habit]);
    const { result } = renderHook(() => useHabits());
    expect(result.current.percentages.every((p) => p === 100)).toBe(true);
  });

  it("averagePercentageForWeek is 0 when nothing is marked", () => {
    mockUseLiveQuery.mockReturnValue([makeHabit()]);
    const { result } = renderHook(() => useHabits());
    expect(result.current.averagePercentageForWeek).toBe(0);
  });

  it("averagePercentageForWeek is 100 when every day of every habit is marked", () => {
    const habit = makeHabit({ days: Array<boolean>(7).fill(true) });
    mockUseLiveQuery.mockReturnValue([habit]);
    const { result } = renderHook(() => useHabits());
    expect(result.current.averagePercentageForWeek).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// bestDayMessage
// ---------------------------------------------------------------------------

describe("useHabits — bestDayMessage", () => {
  it("returns the no-completion message when no day is 100%", () => {
    mockUseLiveQuery.mockReturnValue([makeHabit()]);
    const { result } = renderHook(() => useHabits());
    expect(result.current.bestDayMessage).toMatch(/haven't completed any day 100%/i);
  });

  it("returns a success message listing the best days", () => {
    const habit = makeHabit({ days: Array<boolean>(7).fill(true) });
    mockUseLiveQuery.mockReturnValue([habit]);
    const { result } = renderHook(() => useHabits());
    expect(result.current.bestDayMessage).toMatch(/best day/i);
  });
});

// ---------------------------------------------------------------------------
// bestHabitMessage
// ---------------------------------------------------------------------------

describe("useHabits — bestHabitMessage", () => {
  it("returns the no-completion message when no habit is fully done", () => {
    mockUseLiveQuery.mockReturnValue([makeHabit()]);
    const { result } = renderHook(() => useHabits());
    expect(result.current.bestHabitMessage).toMatch(/no habits with 100%/i);
  });

  it("names habits with all days completed", () => {
    const habit = makeHabit({
      name: "Yoga",
      days: Array<boolean>(7).fill(true),
    });
    mockUseLiveQuery.mockReturnValue([habit]);
    const { result } = renderHook(() => useHabits());
    expect(result.current.bestHabitMessage).toContain("Yoga");
  });
});

// ---------------------------------------------------------------------------
// CRUD operations
// ---------------------------------------------------------------------------

describe("useHabits — addHabit", () => {
  it("calls db.habits.add with a new record", () => {
    mockUseLiveQuery.mockReturnValue([]);
    const { result } = renderHook(() => useHabits());
    act(() => {
      result.current.addHabit({
        name: "Read",
        frequency: "daily",
        targetPerWeek: 7,
      });
    });
    expect(mockHabitsTable.add).toHaveBeenCalledOnce();
    const addedHabit = vi.mocked(mockHabitsTable.add).mock.calls[0][0] as Habit;
    expect(addedHabit.name).toBe("Read");
    expect(addedHabit.days).toEqual(Array<boolean>(7).fill(false));
  });
});

describe("useHabits — deleteHabit", () => {
  it("calls db.habits.delete with the correct id", () => {
    const habit = makeHabit({ id: "habit-abc" });
    mockUseLiveQuery.mockReturnValue([habit]);
    const { result } = renderHook(() => useHabits());
    act(() => {
      result.current.deleteHabit("habit-abc");
    });
    expect(mockHabitsTable.delete).toHaveBeenCalledWith("habit-abc");
  });
});

describe("useHabits — toggleDayMark", () => {
  it("calls db.habits.put with the day flipped to true", () => {
    const habit = makeHabit({
      id: "habit-1",
      days: [false, false, false, false, false, false, false],
    });
    mockUseLiveQuery.mockReturnValue([habit]);
    const { result } = renderHook(() => useHabits());
    act(() => {
      result.current.toggleDayMark("habit-1", 2);
    });
    expect(mockHabitsTable.put).toHaveBeenCalledOnce();
    const putArg = vi.mocked(mockHabitsTable.put).mock.calls[0][0] as Habit;
    expect(putArg.days[2]).toBe(true);
    // Other days should remain unchanged
    expect(putArg.days[0]).toBe(false);
  });

  it("flips a true day back to false", () => {
    const habit = makeHabit({
      id: "habit-2",
      days: [true, false, false, false, false, false, false],
    });
    mockUseLiveQuery.mockReturnValue([habit]);
    const { result } = renderHook(() => useHabits());
    act(() => {
      result.current.toggleDayMark("habit-2", 0);
    });
    const putArg = vi.mocked(mockHabitsTable.put).mock.calls[0][0] as Habit;
    expect(putArg.days[0]).toBe(false);
  });

  it("does nothing when the habit id is not found", () => {
    mockUseLiveQuery.mockReturnValue([]);
    const { result } = renderHook(() => useHabits());
    act(() => {
      result.current.toggleDayMark("nonexistent", 0);
    });
    expect(mockHabitsTable.put).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Edit state
// ---------------------------------------------------------------------------

describe("useHabits — edit state", () => {
  it("editingHabitId is null initially", () => {
    mockUseLiveQuery.mockReturnValue([]);
    const { result } = renderHook(() => useHabits());
    expect(result.current.editingHabitId).toBeNull();
  });

  it("startEdit sets editingHabitId to the given id", () => {
    mockUseLiveQuery.mockReturnValue([]);
    const { result } = renderHook(() => useHabits());
    act(() => {
      result.current.startEdit("habit-42");
    });
    expect(result.current.editingHabitId).toBe("habit-42");
  });

  it("cancelEdit clears editingHabitId", () => {
    mockUseLiveQuery.mockReturnValue([]);
    const { result } = renderHook(() => useHabits());
    act(() => {
      result.current.startEdit("habit-42");
    });
    act(() => {
      result.current.cancelEdit();
    });
    expect(result.current.editingHabitId).toBeNull();
  });

  it("saveEdit calls db.habits.put and clears editingHabitId", () => {
    const habit = makeHabit({ id: "habit-10", name: "Old Name" });
    mockUseLiveQuery.mockReturnValue([habit]);
    const { result } = renderHook(() => useHabits());
    act(() => {
      result.current.startEdit("habit-10");
    });
    act(() => {
      result.current.saveEdit("habit-10", "New Name");
    });
    expect(mockHabitsTable.put).toHaveBeenCalledOnce();
    const putArg = vi.mocked(mockHabitsTable.put).mock.calls[0][0] as Habit;
    expect(putArg.name).toBe("New Name");
    expect(result.current.editingHabitId).toBeNull();
  });

  it("saveEdit does nothing when the habit id is not found", () => {
    mockUseLiveQuery.mockReturnValue([]);
    const { result } = renderHook(() => useHabits());
    act(() => {
      result.current.saveEdit("nonexistent", "Whatever");
    });
    expect(mockHabitsTable.put).not.toHaveBeenCalled();
  });
});
