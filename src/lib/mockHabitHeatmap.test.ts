import { describe, expect, it } from "vitest";
import {
  parseLocalDate,
  formatTooltipDate,
  getCompletionRatio,
  getCompletionStyles,
  calculateHeatmapStreak,
  buildPaddedEntries,
  buildMockHabitHeatmapEntries,
  type HabitHeatmapEntry,
} from "./mockHabitHeatmap";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeEntry = (date: string, completed: number, total = 7): HabitHeatmapEntry => ({
  date,
  completedHabits: completed,
  totalHabits: total,
});

// ---------------------------------------------------------------------------
// parseLocalDate
// ---------------------------------------------------------------------------

describe("parseLocalDate", () => {
  it("parses a YYYY-MM-DD string into a local Date", () => {
    const date = parseLocalDate("2024-06-15");
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(5); // June = 5
    expect(date.getDate()).toBe(15);
  });

  it("sets hours to 12 to avoid DST edge cases", () => {
    const date = parseLocalDate("2024-01-01");
    expect(date.getHours()).toBe(12);
  });
});

// ---------------------------------------------------------------------------
// formatTooltipDate
// ---------------------------------------------------------------------------

describe("formatTooltipDate", () => {
  it("returns a human-readable month + day string", () => {
    const formatted = formatTooltipDate("2024-06-15");
    // Expect something like "Jun 15"
    expect(formatted).toMatch(/Jun/i);
    expect(formatted).toMatch(/15/);
  });
});

// ---------------------------------------------------------------------------
// getCompletionRatio
// ---------------------------------------------------------------------------

describe("getCompletionRatio", () => {
  it("returns 0 when totalHabits is 0", () => {
    expect(getCompletionRatio(makeEntry("2024-01-01", 0, 0))).toBe(0);
  });

  it("returns 1 for full completion", () => {
    expect(getCompletionRatio(makeEntry("2024-01-01", 7, 7))).toBe(1);
  });

  it("returns 0.5 for half completion", () => {
    expect(getCompletionRatio(makeEntry("2024-01-01", 3, 6))).toBeCloseTo(0.5);
  });

  it("returns 0 for zero completions", () => {
    expect(getCompletionRatio(makeEntry("2024-01-01", 0, 7))).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getCompletionStyles
// ---------------------------------------------------------------------------

describe("getCompletionStyles", () => {
  it("returns empty-state class for ratio 0", () => {
    const cls = getCompletionStyles(0);
    expect(cls).toContain("bg-[#f7fbfc]");
  });

  it("returns low-completion class for ratio 0.1", () => {
    const cls = getCompletionStyles(0.1);
    expect(cls).toContain("bg-[#e8f8fb]");
  });

  it("returns medium-low class for ratio 0.3", () => {
    const cls = getCompletionStyles(0.3);
    expect(cls).toContain("bg-[#c4f0f5]");
  });

  it("returns medium-high class for ratio 0.6", () => {
    const cls = getCompletionStyles(0.6);
    expect(cls).toContain("bg-[#8be4ef]");
  });

  it("returns full completion class for ratio 0.85+", () => {
    const cls = getCompletionStyles(0.85);
    expect(cls).toContain("bg-[#63d9ea]");
  });
});

// ---------------------------------------------------------------------------
// calculateHeatmapStreak
// ---------------------------------------------------------------------------

describe("calculateHeatmapStreak", () => {
  it("returns 0 for empty entries", () => {
    expect(calculateHeatmapStreak([])).toBe(0);
  });

  it("returns 0 when the last entry has 0 completion and prior entry also 0", () => {
    const entries = [makeEntry("2024-01-01", 0), makeEntry("2024-01-02", 0)];
    expect(calculateHeatmapStreak(entries)).toBe(0);
  });

  it("counts consecutive completed entries from the last non-zero entry", () => {
    const entries = [
      makeEntry("2024-01-01", 0), // break
      makeEntry("2024-01-02", 3), // streak 1
      makeEntry("2024-01-03", 5), // streak 2
      makeEntry("2024-01-04", 7), // streak 3 (latest — non-zero so starts here)
    ];
    expect(calculateHeatmapStreak(entries)).toBe(3);
  });

  it("skips the last day when it has 0 completion", () => {
    const entries = [
      makeEntry("2024-01-01", 5), // streak 1
      makeEntry("2024-01-02", 3), // streak 2
      makeEntry("2024-01-03", 0), // today — skipped
    ];
    expect(calculateHeatmapStreak(entries)).toBe(2);
  });

  it("single completed entry gives streak of 1", () => {
    const entries = [makeEntry("2024-01-01", 4)];
    expect(calculateHeatmapStreak(entries)).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// buildPaddedEntries
// ---------------------------------------------------------------------------

describe("buildPaddedEntries", () => {
  it("returns visibleEntries unchanged when emptyCellCount is 0", () => {
    const entries = [makeEntry("2024-01-01", 3), makeEntry("2024-01-02", 4)];
    const result = buildPaddedEntries(entries, 0);
    expect(result).toEqual(entries);
  });

  it("returns visibleEntries unchanged when entries is empty", () => {
    const result = buildPaddedEntries([], 3);
    expect(result).toHaveLength(0);
  });

  it("prepends backfilled entries to reach the total grid size", () => {
    const entries = [makeEntry("2024-02-10", 3)];
    const result = buildPaddedEntries(entries, 2);
    expect(result).toHaveLength(3);
    // First two are backfilled (dates before 2024-02-10)
    expect(result[0].date < "2024-02-10").toBe(true);
    expect(result[1].date < "2024-02-10").toBe(true);
    // Last entry is the original
    expect(result[2]).toEqual(entries[0]);
  });
});

// ---------------------------------------------------------------------------
// buildMockHabitHeatmapEntries
// ---------------------------------------------------------------------------

describe("buildMockHabitHeatmapEntries", () => {
  it("returns 84 entries (MOCK_HISTORY_DAYS)", () => {
    const entries = buildMockHabitHeatmapEntries();
    expect(entries).toHaveLength(84);
  });

  it("all entries have totalHabits = 7", () => {
    const entries = buildMockHabitHeatmapEntries();
    expect(entries.every((e) => e.totalHabits === 7)).toBe(true);
  });

  it("all entries have valid YYYY-MM-DD dates", () => {
    const entries = buildMockHabitHeatmapEntries();
    expect(entries.every((e) => /^\d{4}-\d{2}-\d{2}$/.test(e.date))).toBe(true);
  });

  it("entries are in ascending date order", () => {
    const entries = buildMockHabitHeatmapEntries();
    for (let i = 1; i < entries.length; i++) {
      expect(entries[i].date >= entries[i - 1].date).toBe(true);
    }
  });

  it("completedHabits is between 0 and 7 for all entries", () => {
    const entries = buildMockHabitHeatmapEntries();
    expect(entries.every((e) => e.completedHabits >= 0 && e.completedHabits <= 7)).toBe(true);
  });
});
