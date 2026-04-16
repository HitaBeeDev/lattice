import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TimeTrackerContextValue } from "../../hooks/useTimer";

// ---------------------------------------------------------------------------
// Context mock
// ---------------------------------------------------------------------------

vi.mock("../../context/TimeTrackerContext", () => ({
  useTimeTracker: vi.fn(),
}));

import { useTimeTracker } from "../../context/TimeTrackerContext";
import TimerCircle from "./TimerCircle";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const defaultContext: TimeTrackerContextValue = {
  totalSeconds: 1500, // 25:00
  maxSeconds: 1500,
  isTimerActive: false,
  isEditing: false,
  sessionType: "Pomodoro",
  projectName: "",
  projects: [],
  projectTimes: {},
  projectRemainingTimes: {},
  handleAddProject: vi.fn(),
  handleSessionChange: vi.fn(),
  handleStart: vi.fn(),
  handlePause: vi.fn(),
  handleComplete: vi.fn(),
  handleReset: vi.fn(),
  handleUpdateTime: vi.fn(),
  toggleEdit: vi.fn(),
  editButtonText: "Edit Time",
  sessionHistory: [],
  completedPomodoros: 0,
  shortBreakCount: 0,
  longBreakCount: 0,
  todayFocusSeconds: 0,
  dailyFocusSeconds: {},
  sessionDurations: { Pomodoro: 1500, ShortBreak: 900, LongBreak: 1800 },
  currentArticleIndex: 0,
};

const renderCircle = (overrides: Partial<TimeTrackerContextValue> = {}) => {
  vi.mocked(useTimeTracker).mockReturnValue({ ...defaultContext, ...overrides });
  return render(<TimerCircle />);
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Time display
// ---------------------------------------------------------------------------

describe("TimerCircle — time display", () => {
  it("shows 25:00 for 1500 seconds", () => {
    renderCircle({ totalSeconds: 1500 });
    expect(screen.getByText("25:00")).toBeInTheDocument();
  });

  it("zero-pads seconds below 10", () => {
    renderCircle({ totalSeconds: 65 }); // 1 min 5 sec → "1:05"
    expect(screen.getByText("1:05")).toBeInTheDocument();
  });

  it("shows 00:00 when the timer is at zero", () => {
    renderCircle({ totalSeconds: 0 });
    expect(screen.getByText("0:00")).toBeInTheDocument();
  });

  it("shows the session type label", () => {
    renderCircle({ sessionType: "ShortBreak" });
    // TimerDisplay renders sessionType text
    expect(screen.getByText("ShortBreak")).toBeInTheDocument();
  });

  it("has an SVG aria-label describing the current session and time", () => {
    renderCircle({ sessionType: "Pomodoro", totalSeconds: 1500 });
    // The SVG uses aria-label but not role="img", so query the attribute directly
    const svg = document.querySelector("svg[aria-label]");
    expect(svg?.getAttribute("aria-label")).toBe(
      "Pomodoro timer showing 25 minutes and 0 seconds remaining",
    );
  });
});

// ---------------------------------------------------------------------------
// Stats grid (when not editing)
// ---------------------------------------------------------------------------

describe("TimerCircle — stats grid (isEditing = false)", () => {
  it("shows the Minutes stat", () => {
    renderCircle({ isEditing: false, totalSeconds: 1500 });
    expect(screen.getByText("Minutes")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  it("shows the Seconds stat with zero-padding", () => {
    renderCircle({ isEditing: false, totalSeconds: 65 });
    expect(screen.getByText("Seconds")).toBeInTheDocument();
    expect(screen.getByText("05")).toBeInTheDocument();
  });

  it("shows the Remaining % stat", () => {
    renderCircle({ isEditing: false, totalSeconds: 750, maxSeconds: 1500 });
    // 750/1500 = 50%
    expect(screen.getByText("Remaining")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("does not show the edit form input when not editing", () => {
    renderCircle({ isEditing: false });
    expect(screen.queryByLabelText(/session minutes/i)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Edit form (when editing)
// ---------------------------------------------------------------------------

describe("TimerCircle — edit form (isEditing = true)", () => {
  it("shows the 'Session minutes' input when editing", () => {
    renderCircle({ isEditing: true, totalSeconds: 1500 });
    expect(screen.getByLabelText(/session minutes/i)).toBeInTheDocument();
  });

  it("pre-fills the input with the current minute count", () => {
    renderCircle({ isEditing: true, totalSeconds: 1500 }); // 25 min
    const input = screen.getByLabelText(/session minutes/i) as HTMLInputElement;
    expect(input.value).toBe("25");
  });

  it("shows a Save button in edit mode", () => {
    renderCircle({ isEditing: true, totalSeconds: 1500 });
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("does not show the stats grid when editing", () => {
    renderCircle({ isEditing: true });
    expect(screen.queryByText("Minutes")).not.toBeInTheDocument();
  });

  it("calls handleUpdateTime with the entered minutes on submit", async () => {
    const user = userEvent.setup();
    const handleUpdateTime = vi.fn();
    renderCircle({ isEditing: true, totalSeconds: 1500, handleUpdateTime });

    const input = screen.getByLabelText(/session minutes/i);
    await user.clear(input);
    await user.type(input, "45");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(handleUpdateTime).toHaveBeenCalledWith(45);
    });
  });

  it("does not call handleUpdateTime when the field is cleared (empty → coerces to 0, below minimum)", async () => {
    const user = userEvent.setup();
    const handleUpdateTime = vi.fn();
    renderCircle({ isEditing: true, totalSeconds: 1500, handleUpdateTime });

    // Clearing a number input leaves it empty; z.coerce.number("") → 0, which fails min(1)
    const input = screen.getByLabelText(/session minutes/i);
    await user.clear(input);
    await user.click(screen.getByRole("button", { name: /save/i }));

    // React Hook Form must block the invalid submission — handleUpdateTime must not fire
    expect(handleUpdateTime).not.toHaveBeenCalled();
  });
});
