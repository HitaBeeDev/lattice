import { describe, expect, it } from "vitest";
import {
  clamp,
  dayIndexToGridCol,
  eventHeightPct,
  eventOverlapsSlot,
  eventTopPct,
  formatHourLabel,
  getColSpanClass,
  getGridColStartClass,
  getGridRowStartClass,
  getRowSpanClass,
  getTimeSlots,
  getVisibleStartHour,
  getMondayOf,
  getWeekDays,
  isFutureDate,
  isFutureSlot,
  shiftWeek,
  toIso,
  VISIBLE_HOURS,
  FIRST_VISIBLE_HOUR,
  LAST_VISIBLE_START_HOUR,
} from "./calendarUtils";

// ---------------------------------------------------------------------------
// toIso
// ---------------------------------------------------------------------------

describe("toIso", () => {
  it("formats a date as YYYY-MM-DD using local time", () => {
    const d = new Date(2024, 5, 3); // June 3 2024 (month is 0-indexed)
    expect(toIso(d)).toBe("2024-06-03");
  });

  it("zero-pads single-digit month and day", () => {
    const d = new Date(2024, 0, 9); // Jan 9
    expect(toIso(d)).toBe("2024-01-09");
  });
});

// ---------------------------------------------------------------------------
// getMondayOf
// ---------------------------------------------------------------------------

describe("getMondayOf", () => {
  it("returns the same Monday when given a Monday", () => {
    // 2024-06-03 is a Monday
    const result = getMondayOf("2024-06-03");
    expect(toIso(result)).toBe("2024-06-03");
  });

  it("returns the previous Monday when given a Wednesday", () => {
    // 2024-06-05 is a Wednesday → Monday is 2024-06-03
    const result = getMondayOf("2024-06-05");
    expect(toIso(result)).toBe("2024-06-03");
  });

  it("returns the previous Monday when given a Sunday", () => {
    // 2024-06-09 is a Sunday → Monday is 2024-06-03
    const result = getMondayOf("2024-06-09");
    expect(toIso(result)).toBe("2024-06-03");
  });

  it("returns the previous Monday when given a Saturday", () => {
    // 2024-06-08 is a Saturday → Monday is 2024-06-03
    const result = getMondayOf("2024-06-08");
    expect(toIso(result)).toBe("2024-06-03");
  });
});

// ---------------------------------------------------------------------------
// getWeekDays
// ---------------------------------------------------------------------------

describe("getWeekDays", () => {
  it("returns 7 days starting from Sunday before the given Monday", () => {
    // Monday 2024-06-03 → week: Sun 06-02 … Sat 06-08
    const monday = new Date(2024, 5, 3);
    const days = getWeekDays(monday);
    expect(days).toHaveLength(7);
    expect(days[0]).toEqual({ day: "Sunday", date: "2024-06-02" });
    expect(days[6]).toEqual({ day: "Saturday", date: "2024-06-08" });
  });

  it("assigns correct day names", () => {
    const monday = new Date(2024, 5, 3);
    const names = getWeekDays(monday).map((d) => d.day);
    expect(names).toEqual([
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ]);
  });
});

// ---------------------------------------------------------------------------
// shiftWeek
// ---------------------------------------------------------------------------

describe("shiftWeek", () => {
  it("advances by 7 days with direction +1", () => {
    const monday = new Date(2024, 5, 3);
    expect(toIso(shiftWeek(monday, 1))).toBe("2024-06-10");
  });

  it("goes back 7 days with direction -1", () => {
    const monday = new Date(2024, 5, 3);
    expect(toIso(shiftWeek(monday, -1))).toBe("2024-05-27");
  });
});

// ---------------------------------------------------------------------------
// clamp
// ---------------------------------------------------------------------------

describe("clamp", () => {
  it("returns the value when within bounds", () => {
    expect(clamp(5, 1, 10)).toBe(5);
  });

  it("returns min when value is below min", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("returns max when value is above max", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("handles value equal to min", () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it("handles value equal to max", () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });
});

// ---------------------------------------------------------------------------
// formatHourLabel
// ---------------------------------------------------------------------------

describe("formatHourLabel", () => {
  it("formats midnight as '12:00 am'", () => {
    expect(formatHourLabel(0)).toBe("12:00 am");
  });

  it("formats noon as '12:00 pm'", () => {
    expect(formatHourLabel(12)).toBe("12:00 pm");
  });

  it("formats 1am correctly", () => {
    expect(formatHourLabel(1)).toBe("1:00 am");
  });

  it("formats 1pm correctly", () => {
    expect(formatHourLabel(13)).toBe("1:00 pm");
  });

  it("wraps values ≥ 24 using modulo", () => {
    expect(formatHourLabel(24)).toBe("12:00 am");
    expect(formatHourLabel(25)).toBe("1:00 am");
  });
});

// ---------------------------------------------------------------------------
// getVisibleStartHour
// ---------------------------------------------------------------------------

describe("getVisibleStartHour", () => {
  it("returns currentHour - 1 when within [FIRST, LAST] range", () => {
    expect(getVisibleStartHour(10)).toBe(9);
  });

  it("clamps to FIRST_VISIBLE_HOUR when currentHour - 1 is too low", () => {
    expect(getVisibleStartHour(0)).toBe(FIRST_VISIBLE_HOUR);
  });

  it("clamps to LAST_VISIBLE_START_HOUR when currentHour - 1 is too high", () => {
    expect(getVisibleStartHour(23)).toBe(LAST_VISIBLE_START_HOUR);
  });
});

// ---------------------------------------------------------------------------
// getTimeSlots
// ---------------------------------------------------------------------------

describe("getTimeSlots", () => {
  it(`returns exactly ${VISIBLE_HOURS} slots`, () => {
    expect(getTimeSlots(8)).toHaveLength(VISIBLE_HOURS);
  });

  it("starts at the given startHour", () => {
    const slots = getTimeSlots(9);
    expect(slots[0].hour).toBe(9);
    expect(slots[0].label).toBe("9:00 am");
  });

  it("increments hour by 1 per slot", () => {
    const slots = getTimeSlots(6);
    slots.forEach((slot, i) => {
      expect(slot.hour).toBe(6 + i);
    });
  });
});

// ---------------------------------------------------------------------------
// eventTopPct / eventHeightPct
// ---------------------------------------------------------------------------

describe("eventTopPct", () => {
  it("returns 0 when event starts at the visible start hour", () => {
    expect(eventTopPct(8, 8)).toBe(0);
  });

  it("returns 100/VISIBLE_HOURS for one hour offset", () => {
    expect(eventTopPct(9, 8)).toBeCloseTo(100 / VISIBLE_HOURS);
  });
});

describe("eventHeightPct", () => {
  it("returns 100/VISIBLE_HOURS for a 1-hour event", () => {
    expect(eventHeightPct(1)).toBeCloseTo(100 / VISIBLE_HOURS);
  });

  it("returns 100% for a full visible window duration", () => {
    expect(eventHeightPct(VISIBLE_HOURS)).toBeCloseTo(100);
  });
});

// ---------------------------------------------------------------------------
// isFutureDate
// ---------------------------------------------------------------------------

describe("isFutureDate", () => {
  it("returns true when date is after today", () => {
    expect(isFutureDate("2025-12-01", "2024-06-01")).toBe(true);
  });

  it("returns false when date equals today", () => {
    expect(isFutureDate("2024-06-01", "2024-06-01")).toBe(false);
  });

  it("returns false when date is before today", () => {
    expect(isFutureDate("2023-01-01", "2024-06-01")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isFutureSlot
// ---------------------------------------------------------------------------

describe("isFutureSlot", () => {
  it("returns true when the date is in the future", () => {
    expect(isFutureSlot("2025-01-01", 9, "2024-06-01", 14)).toBe(true);
  });

  it("returns true when same day and slot is after current hour", () => {
    expect(isFutureSlot("2024-06-01", 15, "2024-06-01", 14)).toBe(true);
  });

  it("returns false when same day and slot is before current hour", () => {
    expect(isFutureSlot("2024-06-01", 10, "2024-06-01", 14)).toBe(false);
  });

  it("returns false when same day and slot equals current hour", () => {
    expect(isFutureSlot("2024-06-01", 14, "2024-06-01", 14)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// eventOverlapsSlot
// ---------------------------------------------------------------------------

describe("eventOverlapsSlot", () => {
  it("returns true when slot is within the event range", () => {
    expect(eventOverlapsSlot({ startHour: 9, durationHours: 2 }, 10)).toBe(true);
  });

  it("returns true when slot is at the start hour", () => {
    expect(eventOverlapsSlot({ startHour: 9, durationHours: 2 }, 9)).toBe(true);
  });

  it("returns false when slot is at the end hour (exclusive)", () => {
    expect(eventOverlapsSlot({ startHour: 9, durationHours: 2 }, 11)).toBe(false);
  });

  it("returns false when slot is before the event", () => {
    expect(eventOverlapsSlot({ startHour: 9, durationHours: 2 }, 8)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// dayIndexToGridCol
// ---------------------------------------------------------------------------

describe("dayIndexToGridCol", () => {
  it("maps index 0 to column 2", () => {
    expect(dayIndexToGridCol(0)).toBe(2);
  });

  it("maps index 6 to column 8", () => {
    expect(dayIndexToGridCol(6)).toBe(8);
  });
});

// ---------------------------------------------------------------------------
// CSS class helpers
// ---------------------------------------------------------------------------

describe("getGridRowStartClass", () => {
  it("returns row-start-1 for rowStart 1", () => {
    expect(getGridRowStartClass(1)).toBe("row-start-1");
  });

  it("clamps out-of-range values to the nearest boundary", () => {
    expect(getGridRowStartClass(0)).toBe("row-start-1");
    expect(getGridRowStartClass(100)).toBe("row-start-7");
  });
});

describe("getGridColStartClass", () => {
  it("returns col-start-2 for colStart 2", () => {
    expect(getGridColStartClass(2)).toBe("col-start-2");
  });

  it("clamps to col-start-1 for values below 1", () => {
    expect(getGridColStartClass(0)).toBe("col-start-1");
  });
});

describe("getColSpanClass", () => {
  it("returns col-span-1 for colSpan 1", () => {
    expect(getColSpanClass(1)).toBe("col-span-1");
  });

  it("clamps to col-span-7 for values above 7", () => {
    expect(getColSpanClass(99)).toBe("col-span-7");
  });
});

describe("getRowSpanClass", () => {
  it("returns row-span-3 for rowSpan 3", () => {
    expect(getRowSpanClass(3)).toBe("row-span-3");
  });
});
