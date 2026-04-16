import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useTimer } from "./useTimer";

// useTimer uses usePersistentState which reads/writes localStorage.
// jsdom provides localStorage, so we just need to clear it between tests.

const POMODORO_SECONDS = 25 * 60; // 1500
const SHORT_BREAK_SECONDS = 15 * 60; // 900
const LONG_BREAK_SECONDS = 30 * 60; // 1800

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

describe("useTimer — initial state", () => {
  it("starts with Pomodoro session type", () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.sessionType).toBe("Pomodoro");
  });

  it("starts with 25 minutes on the clock", () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.totalSeconds).toBe(POMODORO_SECONDS);
    expect(result.current.maxSeconds).toBe(POMODORO_SECONDS);
  });

  it("starts paused", () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.isTimerActive).toBe(false);
  });

  it("starts with editing disabled", () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.isEditing).toBe(false);
  });

  it("editButtonText is 'Edit Time' initially", () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.editButtonText).toBe("Edit Time");
  });
});

// ---------------------------------------------------------------------------
// handleSessionChange
// ---------------------------------------------------------------------------

describe("useTimer — handleSessionChange", () => {
  it("switches to ShortBreak with correct duration", () => {
    const { result } = renderHook(() => useTimer());
    act(() => {
      result.current.handleSessionChange("ShortBreak");
    });
    expect(result.current.sessionType).toBe("ShortBreak");
    expect(result.current.totalSeconds).toBe(SHORT_BREAK_SECONDS);
    expect(result.current.maxSeconds).toBe(SHORT_BREAK_SECONDS);
    expect(result.current.isTimerActive).toBe(false);
  });

  it("switches to LongBreak with correct duration", () => {
    const { result } = renderHook(() => useTimer());
    act(() => {
      result.current.handleSessionChange("LongBreak");
    });
    expect(result.current.sessionType).toBe("LongBreak");
    expect(result.current.totalSeconds).toBe(LONG_BREAK_SECONDS);
  });

  it("switching sessions stops a running timer", () => {
    const { result } = renderHook(() => useTimer());
    act(() => {
      result.current.handleStart();
    });
    expect(result.current.isTimerActive).toBe(true);

    act(() => {
      result.current.handleSessionChange("ShortBreak");
    });
    expect(result.current.isTimerActive).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// handleStart / handlePause
// ---------------------------------------------------------------------------

describe("useTimer — handleStart / handlePause", () => {
  it("handleStart activates the timer", () => {
    const { result } = renderHook(() => useTimer());
    act(() => {
      result.current.handleStart();
    });
    expect(result.current.isTimerActive).toBe(true);
  });

  it("handlePause deactivates the timer", () => {
    const { result } = renderHook(() => useTimer());
    act(() => {
      result.current.handleStart();
    });
    act(() => {
      result.current.handlePause();
    });
    expect(result.current.isTimerActive).toBe(false);
  });

  it("calling handleStart when already active is a no-op", () => {
    const { result } = renderHook(() => useTimer());
    act(() => {
      result.current.handleStart();
      result.current.handleStart();
    });
    expect(result.current.isTimerActive).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// handleReset
// ---------------------------------------------------------------------------

describe("useTimer — handleReset", () => {
  it("restores totalSeconds to the current session default", () => {
    const { result } = renderHook(() => useTimer());

    // Switch to ShortBreak then reset — should stay at ShortBreak duration
    act(() => {
      result.current.handleSessionChange("ShortBreak");
    });
    act(() => {
      result.current.handleStart();
    });
    act(() => {
      result.current.handleReset();
    });

    expect(result.current.totalSeconds).toBe(SHORT_BREAK_SECONDS);
    expect(result.current.maxSeconds).toBe(SHORT_BREAK_SECONDS);
    expect(result.current.isTimerActive).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// handleUpdateTime
// ---------------------------------------------------------------------------

describe("useTimer — handleUpdateTime", () => {
  it("sets totalSeconds and maxSeconds from the given minutes", () => {
    const { result } = renderHook(() => useTimer());
    act(() => {
      result.current.handleUpdateTime(45);
    });
    expect(result.current.totalSeconds).toBe(45 * 60);
    expect(result.current.maxSeconds).toBe(45 * 60);
    expect(result.current.isTimerActive).toBe(false);
  });

  it("exits editing mode after updating time", () => {
    const { result } = renderHook(() => useTimer());
    act(() => {
      result.current.toggleEdit();
    });
    expect(result.current.isEditing).toBe(true);

    act(() => {
      result.current.handleUpdateTime(30);
    });
    expect(result.current.isEditing).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// toggleEdit
// ---------------------------------------------------------------------------

describe("useTimer — toggleEdit", () => {
  it("toggles isEditing from false to true", () => {
    const { result } = renderHook(() => useTimer());
    act(() => {
      result.current.toggleEdit();
    });
    expect(result.current.isEditing).toBe(true);
    expect(result.current.editButtonText).toBe("Cancel Edit");
  });

  it("toggles isEditing back to false on second call", () => {
    const { result } = renderHook(() => useTimer());
    act(() => {
      result.current.toggleEdit();
      result.current.toggleEdit();
    });
    expect(result.current.isEditing).toBe(false);
    expect(result.current.editButtonText).toBe("Edit Time");
  });
});

// ---------------------------------------------------------------------------
// sessionDurations constant
// ---------------------------------------------------------------------------

describe("useTimer — sessionDurations", () => {
  it("exposes the correct duration constants", () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.sessionDurations.Pomodoro).toBe(POMODORO_SECONDS);
    expect(result.current.sessionDurations.ShortBreak).toBe(SHORT_BREAK_SECONDS);
    expect(result.current.sessionDurations.LongBreak).toBe(LONG_BREAK_SECONDS);
  });
});
