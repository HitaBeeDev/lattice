import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCalendarWeek } from "./useCalendarWeek";
import type { CalendarEvent } from "./useCalendarWeek";

// ---------------------------------------------------------------------------
// Helpers — minimal MockDashboardWeek data
// ---------------------------------------------------------------------------

// A Monday known to be 2026-04-13 — avoids importing the real mockDashboardMonth
const MONDAY = "2026-04-13";
const PREV_MONDAY = "2026-04-06";
const NEXT_MONDAY = "2026-04-20";

const DAY_NAMES = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] as const;

const shiftDate = (iso: string, days: number): string => {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const makeWeek = (mondayIso: string, weekNum: number) => ({
  week: weekNum,
  days: DAY_NAMES.map((day, i) => ({
    day,
    date: shiftDate(mondayIso, i),
    focusTimeMinutes: 0,
    habits: [],
    tasks: [],
  })),
});

const ACTIVE_WEEK = makeWeek(MONDAY, 1);
const PREV_WEEK   = makeWeek(PREV_MONDAY, 2);
const NEXT_WEEK   = makeWeek(NEXT_MONDAY, 3);
const ALL_WEEKS   = [PREV_WEEK, ACTIVE_WEEK, NEXT_WEEK];
const TODAY_DATE  = shiftDate(MONDAY, 3); // Thursday of active week

const baseOptions = {
  weeks: ALL_WEEKS,
  todayDate: TODAY_DATE,
  multiDayTasks: [],
  timedEvents: [] as CalendarEvent[],
  activeWeek: ACTIVE_WEEK,
};

// ---------------------------------------------------------------------------
// Basic shape
// ---------------------------------------------------------------------------

describe("useCalendarWeek — basic shape", () => {
  it("returns expected keys", () => {
    const { result } = renderHook(() => useCalendarWeek(baseOptions));
    const r = result.current;
    expect(r).toHaveProperty("displayDays");
    expect(r).toHaveProperty("timeSlots");
    expect(r).toHaveProperty("headerLabel");
    expect(r).toHaveProperty("clippedMultiDay");
    expect(r).toHaveProperty("visibleTimedEvents");
    expect(r).toHaveProperty("handlePreviousWeek");
    expect(r).toHaveProperty("handleNextWeek");
  });

  it("displayDays has exactly 7 entries", () => {
    const { result } = renderHook(() => useCalendarWeek(baseOptions));
    expect(result.current.displayDays).toHaveLength(7);
  });

  it("timeSlots is non-empty", () => {
    const { result } = renderHook(() => useCalendarWeek(baseOptions));
    expect(result.current.timeSlots.length).toBeGreaterThan(0);
  });

  it("headerLabel contains the year", () => {
    const { result } = renderHook(() => useCalendarWeek(baseOptions));
    expect(result.current.headerLabel).toContain("2026");
  });
});

// ---------------------------------------------------------------------------
// fixedStartHour
// ---------------------------------------------------------------------------

describe("useCalendarWeek — fixedStartHour", () => {
  it("clamps fixedStartHour below minimum", () => {
    const { result } = renderHook(() =>
      useCalendarWeek({ ...baseOptions, fixedStartHour: 0 }),
    );
    // Clamped to FIRST_VISIBLE_HOUR (6)
    expect(result.current.visibleStartHour).toBeGreaterThanOrEqual(6);
  });

  it("uses the provided fixedStartHour when within bounds", () => {
    const { result } = renderHook(() =>
      useCalendarWeek({ ...baseOptions, fixedStartHour: 8 }),
    );
    expect(result.current.visibleStartHour).toBe(8);
  });
});

// ---------------------------------------------------------------------------
// Multi-day tasks
// ---------------------------------------------------------------------------

describe("useCalendarWeek — multi-day tasks", () => {
  it("multiDayRowCount is 0 when no multi-day tasks", () => {
    const { result } = renderHook(() => useCalendarWeek(baseOptions));
    expect(result.current.multiDayRowCount).toBe(0);
  });

  it("positions a task that spans the whole active week", () => {
    const task = {
      id: "task-1",
      title: "Sprint",
      subtitle: "",
      startDate: MONDAY,
      endDate: shiftDate(MONDAY, 6),
      startHour: 9,
      variant: "dark" as const,
    };
    const { result } = renderHook(() =>
      useCalendarWeek({ ...baseOptions, multiDayTasks: [task] }),
    );
    expect(result.current.clippedMultiDay).toHaveLength(1);
    expect(result.current.clippedMultiDay[0].span).toBeGreaterThanOrEqual(1);
  });

  it("maxMultiDayRows clips overflow rows", () => {
    const tasks = [0, 1, 2].map((i) => ({
      id: `task-${i}`,
      title: `Task ${i}`,
      subtitle: "",
      startDate: shiftDate(MONDAY, i),
      endDate: shiftDate(MONDAY, i),
      startHour: 9,
      variant: "dark" as const,
    }));
    const { result } = renderHook(() =>
      useCalendarWeek({ ...baseOptions, multiDayTasks: tasks, maxMultiDayRows: 2 }),
    );
    expect(result.current.clippedMultiDay.every((t) => t.row < 2)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Timed events
// ---------------------------------------------------------------------------

describe("useCalendarWeek — timed events", () => {
  it("visibleTimedEvents is empty when week does not match active week", () => {
    const event: CalendarEvent = {
      id: "e1",
      title: "Standup",
      subtitle: "",
      day: MONDAY,
      startHour: 9,
      durationHours: 1,
      variant: "dark",
    };
    // Use a different active week
    const { result } = renderHook(() =>
      useCalendarWeek({ ...baseOptions, activeWeek: PREV_WEEK, timedEvents: [event] }),
    );
    // The current displayed week (ACTIVE_WEEK) doesn't match activeWeek (PREV_WEEK)
    expect(result.current.visibleTimedEvents).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Week navigation
// ---------------------------------------------------------------------------

describe("useCalendarWeek — week navigation", () => {
  it("handlePreviousWeek shifts displayDays to the previous week's dates", () => {
    const { result } = renderHook(() => useCalendarWeek(baseOptions));
    const beforeMonday = result.current.displayDays[0].date;

    act(() => {
      result.current.handlePreviousWeek({
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent<HTMLButtonElement>);
    });

    const afterMonday = result.current.displayDays[0].date;
    expect(afterMonday < beforeMonday).toBe(true);
  });

  it("handleNextWeek shifts displayDays to the next week's dates", () => {
    const { result } = renderHook(() => useCalendarWeek(baseOptions));
    const beforeMonday = result.current.displayDays[0].date;

    act(() => {
      result.current.handleNextWeek({
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent<HTMLButtonElement>);
    });

    const afterMonday = result.current.displayDays[0].date;
    expect(afterMonday > beforeMonday).toBe(true);
  });
});
