import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// ---------------------------------------------------------------------------
// Context mock
// ---------------------------------------------------------------------------

vi.mock("../context/TimeTrackerContext", () => ({
  useTimeTracker: vi.fn(),
}));

import { useTimeTracker } from "../context/TimeTrackerContext";
import { useTimerEdit } from "./useTimerEdit";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeMockContext = (overrides: Record<string, unknown> = {}) => ({
  totalSeconds: 1500, // 25 minutes
  isEditing: false,
  toggleEdit: vi.fn(),
  handleUpdateTime: vi.fn(),
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useTimeTracker).mockReturnValue(
    makeMockContext() as unknown as ReturnType<typeof useTimeTracker>,
  );
});

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

describe("useTimerEdit — initial state", () => {
  it("starts with editMinutes as empty string", () => {
    const { result } = renderHook(() => useTimerEdit());
    expect(result.current.editMinutes).toBe("");
  });

  it("starts with editError as empty string", () => {
    const { result } = renderHook(() => useTimerEdit());
    expect(result.current.editError).toBe("");
  });
});

// ---------------------------------------------------------------------------
// handleToggleEdit
// ---------------------------------------------------------------------------

describe("useTimerEdit — handleToggleEdit", () => {
  it("sets editMinutes to current minutes when entering edit mode", () => {
    vi.mocked(useTimeTracker).mockReturnValue(
      makeMockContext({ totalSeconds: 1500, isEditing: false }) as unknown as ReturnType<typeof useTimeTracker>,
    );
    const { result } = renderHook(() => useTimerEdit());

    act(() => result.current.handleToggleEdit());

    expect(result.current.editMinutes).toBe("25");
  });

  it("calls toggleEdit when entering edit mode", () => {
    const toggleEdit = vi.fn();
    vi.mocked(useTimeTracker).mockReturnValue(
      makeMockContext({ isEditing: false, toggleEdit }) as unknown as ReturnType<typeof useTimeTracker>,
    );
    const { result } = renderHook(() => useTimerEdit());

    act(() => result.current.handleToggleEdit());

    expect(toggleEdit).toHaveBeenCalledOnce();
  });

  it("clears editError when exiting edit mode", () => {
    vi.mocked(useTimeTracker).mockReturnValue(
      makeMockContext({ isEditing: true }) as unknown as ReturnType<typeof useTimeTracker>,
    );
    const { result } = renderHook(() => useTimerEdit());

    act(() => result.current.handleToggleEdit());

    expect(result.current.editError).toBe("");
  });

  it("calls toggleEdit when exiting edit mode", () => {
    const toggleEdit = vi.fn();
    vi.mocked(useTimeTracker).mockReturnValue(
      makeMockContext({ isEditing: true, toggleEdit }) as unknown as ReturnType<typeof useTimeTracker>,
    );
    const { result } = renderHook(() => useTimerEdit());

    act(() => result.current.handleToggleEdit());

    expect(toggleEdit).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// setEditMinutes
// ---------------------------------------------------------------------------

describe("useTimerEdit — setEditMinutes", () => {
  it("updates editMinutes", () => {
    const { result } = renderHook(() => useTimerEdit());

    act(() => result.current.setEditMinutes("30"));

    expect(result.current.editMinutes).toBe("30");
  });
});

// ---------------------------------------------------------------------------
// handleSaveEditedTime
// ---------------------------------------------------------------------------

describe("useTimerEdit — handleSaveEditedTime", () => {
  it("calls handleUpdateTime with valid minutes", () => {
    const handleUpdateTime = vi.fn();
    vi.mocked(useTimeTracker).mockReturnValue(
      makeMockContext({ handleUpdateTime }) as unknown as ReturnType<typeof useTimeTracker>,
    );
    const { result } = renderHook(() => useTimerEdit());

    act(() => result.current.setEditMinutes("30"));
    act(() => result.current.handleSaveEditedTime());

    expect(handleUpdateTime).toHaveBeenCalledWith(30);
    expect(result.current.editError).toBe("");
  });

  it("sets editError and blocks save when minutes is 0", () => {
    const handleUpdateTime = vi.fn();
    vi.mocked(useTimeTracker).mockReturnValue(
      makeMockContext({ handleUpdateTime }) as unknown as ReturnType<typeof useTimeTracker>,
    );
    const { result } = renderHook(() => useTimerEdit());

    act(() => result.current.setEditMinutes("0"));
    act(() => result.current.handleSaveEditedTime());

    expect(result.current.editError).toBeTruthy();
    expect(handleUpdateTime).not.toHaveBeenCalled();
  });

  it("sets editError and blocks save when minutes exceeds 99", () => {
    const handleUpdateTime = vi.fn();
    vi.mocked(useTimeTracker).mockReturnValue(
      makeMockContext({ handleUpdateTime }) as unknown as ReturnType<typeof useTimeTracker>,
    );
    const { result } = renderHook(() => useTimerEdit());

    act(() => result.current.setEditMinutes("100"));
    act(() => result.current.handleSaveEditedTime());

    expect(result.current.editError).toBeTruthy();
    expect(handleUpdateTime).not.toHaveBeenCalled();
  });

  it("sets editError when minutes is not a number", () => {
    const handleUpdateTime = vi.fn();
    vi.mocked(useTimeTracker).mockReturnValue(
      makeMockContext({ handleUpdateTime }) as unknown as ReturnType<typeof useTimeTracker>,
    );
    const { result } = renderHook(() => useTimerEdit());

    act(() => result.current.setEditMinutes("abc"));
    act(() => result.current.handleSaveEditedTime());

    expect(result.current.editError).toBeTruthy();
    expect(handleUpdateTime).not.toHaveBeenCalled();
  });

  it("calls handleUpdateTime with 99 (maximum valid value)", () => {
    const handleUpdateTime = vi.fn();
    vi.mocked(useTimeTracker).mockReturnValue(
      makeMockContext({ handleUpdateTime }) as unknown as ReturnType<typeof useTimeTracker>,
    );
    const { result } = renderHook(() => useTimerEdit());

    act(() => result.current.setEditMinutes("99"));
    act(() => result.current.handleSaveEditedTime());

    expect(handleUpdateTime).toHaveBeenCalledWith(99);
    expect(result.current.editError).toBe("");
  });
});
