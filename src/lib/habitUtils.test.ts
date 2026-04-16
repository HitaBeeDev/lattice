import { describe, expect, it } from "vitest";
import type { Habit } from "../types/habit";
import {
  calculateAveragePercentage,
  calculateCompletedHabitsCount,
  calculateDayCompletionStatus,
  calculateTotalScoreOfWeek,
  findBestDayIndex,
  findBestHabit,
} from "./habitUtils";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeHabit = (id: string, days: boolean[]): Habit => ({
  id,
  name: `Habit ${id}`,
  category: "other",
  frequency: "daily",
  days,
  isArchived: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
});

const ALL_TRUE = Array<boolean>(7).fill(true);
const ALL_FALSE = Array<boolean>(7).fill(false);

const WEEK_DATES = [
  { dayFull: "Sunday" },
  { dayFull: "Monday" },
  { dayFull: "Tuesday" },
  { dayFull: "Wednesday" },
  { dayFull: "Thursday" },
  { dayFull: "Friday" },
  { dayFull: "Saturday" },
];

// ---------------------------------------------------------------------------
// calculateCompletedHabitsCount
// ---------------------------------------------------------------------------

describe("calculateCompletedHabitsCount", () => {
  it("returns 0 for empty list", () => {
    expect(calculateCompletedHabitsCount([])).toBe(0);
  });

  it("returns 0 when no habit has every day marked", () => {
    const habits = [
      makeHabit("a", [true, false, true, true, true, true, true]),
    ];
    expect(calculateCompletedHabitsCount(habits)).toBe(0);
  });

  it("counts only habits where all 7 days are true", () => {
    const habits = [
      makeHabit("a", ALL_TRUE),
      makeHabit("b", [false, ...Array<boolean>(6).fill(true)]),
      makeHabit("c", ALL_TRUE),
    ];
    expect(calculateCompletedHabitsCount(habits)).toBe(2);
  });

  it("counts all habits when every habit is fully complete", () => {
    const habits = [makeHabit("a", ALL_TRUE), makeHabit("b", ALL_TRUE)];
    expect(calculateCompletedHabitsCount(habits)).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// calculateDayCompletionStatus
// ---------------------------------------------------------------------------

describe("calculateDayCompletionStatus", () => {
  it("returns seven zeros for empty list", () => {
    expect(calculateDayCompletionStatus([])).toEqual(Array<number>(7).fill(0));
  });

  it("increments the correct index for each marked day", () => {
    const habits = [
      makeHabit("a", [true, false, true, false, false, false, false]),
      makeHabit("b", [true, true, false, false, false, false, false]),
    ];
    expect(calculateDayCompletionStatus(habits)).toEqual([
      2, 1, 1, 0, 0, 0, 0,
    ]);
  });

  it("handles a single fully completed habit", () => {
    const habits = [makeHabit("a", ALL_TRUE)];
    expect(calculateDayCompletionStatus(habits)).toEqual(
      Array<number>(7).fill(1)
    );
  });
});

// ---------------------------------------------------------------------------
// findBestDayIndex
// ---------------------------------------------------------------------------

describe("findBestDayIndex", () => {
  it("returns 'N/A' when weekDates is empty", () => {
    expect(findBestDayIndex([1, 2, 3, 0, 0, 0, 0], [])).toBe("N/A");
  });

  it("returns the name of the day with the highest count", () => {
    // Monday (index 1) has the highest value
    expect(findBestDayIndex([1, 3, 2, 0, 0, 0, 0], WEEK_DATES)).toBe("Monday");
  });

  it("uses the first maximum when there is a tie", () => {
    // indexOf returns the first occurrence of the max
    expect(findBestDayIndex([5, 5, 3, 0, 0, 0, 0], WEEK_DATES)).toBe("Sunday");
  });
});

// ---------------------------------------------------------------------------
// findBestHabit
// ---------------------------------------------------------------------------

describe("findBestHabit", () => {
  it("returns a null habit for an empty list", () => {
    const result = findBestHabit([]);
    expect(result.habit).toBeNull();
    expect(result.completionPercentage).toBe(-1);
  });

  it("finds the habit with the highest number of marked days", () => {
    const habits = [
      makeHabit("a", [true, false, false, false, false, false, false]), // 1/7
      makeHabit("b", [true, true, true, true, true, false, false]), // 5/7
      makeHabit("c", [true, true, false, false, false, false, false]), // 2/7
    ];
    const { habit, completionPercentage } = findBestHabit(habits);
    expect(habit?.id).toBe("b");
    expect(completionPercentage).toBe(Math.ceil((5 / 7) * 100));
  });

  it("returns 100% for a fully completed habit", () => {
    const { completionPercentage } = findBestHabit([makeHabit("a", ALL_TRUE)]);
    expect(completionPercentage).toBe(100);
  });

  it("returns 0% for a habit with no days marked (ceil(0/7*100)=0)", () => {
    const { completionPercentage } = findBestHabit([makeHabit("a", ALL_FALSE)]);
    expect(completionPercentage).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// calculateAveragePercentage
// ---------------------------------------------------------------------------

describe("calculateAveragePercentage", () => {
  it("returns 0 for empty list", () => {
    expect(calculateAveragePercentage([])).toBe(0);
  });

  it("returns 100 when one habit has all days marked", () => {
    // per marked day: Math.ceil(1/1 * 100) = 100; sum=700; 700/7=100
    expect(calculateAveragePercentage([makeHabit("a", ALL_TRUE)])).toBe(100);
  });

  it("returns 0 when no days are marked", () => {
    expect(calculateAveragePercentage([makeHabit("a", ALL_FALSE)])).toBe(0);
  });

  it("calculates a partial week correctly", () => {
    // 4 out of 7 days marked → sumPercentageOfDay has 4 × 100 = 400
    // 400 / 7 ≈ 57.14 → Math.ceil = 58
    const days: boolean[] = [true, true, true, true, false, false, false];
    expect(calculateAveragePercentage([makeHabit("a", days)])).toBe(58);
  });
});

// ---------------------------------------------------------------------------
// calculateTotalScoreOfWeek
// ---------------------------------------------------------------------------

describe("calculateTotalScoreOfWeek", () => {
  it("equals calculateAveragePercentage because the formula averages it with itself", () => {
    const habits = [makeHabit("a", ALL_TRUE), makeHabit("b", ALL_FALSE)];
    const avg = calculateAveragePercentage(habits);
    expect(calculateTotalScoreOfWeek(habits)).toBe(avg);
  });
});
