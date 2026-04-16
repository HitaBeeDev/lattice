import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Habit } from "../../types/habit";

// ---------------------------------------------------------------------------
// Framer Motion mock — replaces animated components with plain HTML elements
// so jsdom never triggers act() warnings from pending animations.
// ---------------------------------------------------------------------------

vi.mock("framer-motion", async () => {
  const { forwardRef, createElement } = await import("react");
  const createEl = (tag: string) =>
    forwardRef(
      (
        { children, animate, initial, exit, whileTap, transition, ...props }: Record<string, unknown>,
        ref: React.Ref<unknown>,
      ) => createElement(tag, { ...props, ref }, children as React.ReactNode),
    );
  return {
    motion: {
      button: createEl("button"),
      span: createEl("span"),
      div: createEl("div"),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useReducedMotion: () => true,
  };
});

// ---------------------------------------------------------------------------
// Context mock
// ---------------------------------------------------------------------------

vi.mock("../../context/HabitContext", () => ({
  useHabits: vi.fn(),
}));

import { useHabits } from "../../context/HabitContext";
import HabitList from "./HabitList";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeHabit = (overrides: Partial<Habit> = {}): Habit => ({
  id: "habit-1",
  name: "Morning run",
  category: "fitness",
  frequency: "daily",
  days: Array<boolean>(7).fill(false),
  isArchived: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  ...overrides,
});

// A fixed date for day-button assertions (Sunday Jun 02 2024)
const FIXED_DATE = new Date(2024, 5, 2);

const baseContext = {
  habits: [] as Habit[],
  isLoading: false,
  editingHabitId: null as string | null,
  startEdit: vi.fn(),
  saveEdit: vi.fn(),
  cancelEdit: vi.fn(),
  deleteHabit: vi.fn(),
  toggleDayMark: vi.fn(),
  visibleWeekDates: [FIXED_DATE],
  // remaining fields the hook provides but HabitList doesn't use
  addHabit: vi.fn(),
  getWeekDates: vi.fn(),
  formatDate: vi.fn(),
  formatDayOfWeek: vi.fn(),
  totalHabits: 0,
  formattedToday: "Mon, 01 Jan 2024",
  completedHabits: 0,
  bestDayMessage: "",
  bestHabitMessage: "",
  averagePercentageForWeek: 0,
  weekDates: [],
  percentages: [],
  quoteIndex: 0,
};

const renderWithContext = (overrides: Partial<typeof baseContext> = {}) => {
  vi.mocked(useHabits).mockReturnValue({ ...baseContext, ...overrides } as ReturnType<typeof useHabits>);
  return render(<HabitList />);
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

describe("HabitList — empty state", () => {
  it("shows the empty state when there are no habits", () => {
    renderWithContext({ habits: [] });
    expect(screen.getByText("No habits yet")).toBeInTheDocument();
  });

  it("does not render any habit rows when the list is empty", () => {
    renderWithContext({ habits: [] });
    expect(screen.queryByRole("button", { name: /Edit/i })).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Habit rendering
// ---------------------------------------------------------------------------

describe("HabitList — renders habits", () => {
  it("renders a row for each habit", () => {
    const habits = [
      makeHabit({ id: "h1", name: "Morning run" }),
      makeHabit({ id: "h2", name: "Read 30 min" }),
    ];
    renderWithContext({ habits });
    expect(screen.getByText("Morning run")).toBeInTheDocument();
    expect(screen.getByText("Read 30 min")).toBeInTheDocument();
  });

  it("does not show the empty state when habits are present", () => {
    renderWithContext({ habits: [makeHabit()] });
    expect(screen.queryByText("No habits yet")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Edit flow
// ---------------------------------------------------------------------------

describe("HabitList — edit flow", () => {
  it("calls startEdit with the habit id when the edit button is clicked", async () => {
    const user = userEvent.setup();
    const habit = makeHabit({ id: "h1", name: "Morning run" });
    const startEdit = vi.fn();
    renderWithContext({ habits: [habit], startEdit });

    await user.click(screen.getByRole("button", { name: "Edit Morning run" }));
    expect(startEdit).toHaveBeenCalledWith("h1");
  });

  it("shows the inline edit form when editingHabitId matches the habit", () => {
    const habit = makeHabit({ id: "h1", name: "Morning run" });
    renderWithContext({ habits: [habit], editingHabitId: "h1" });
    // HabitInlineEditForm renders a Save button
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("does not show the inline edit form for a different habit", () => {
    const habits = [
      makeHabit({ id: "h1", name: "Morning run" }),
      makeHabit({ id: "h2", name: "Read 30 min" }),
    ];
    // Only h1 is being edited
    renderWithContext({ habits, editingHabitId: "h1" });
    // h2 should still show its name as plain text (not in an input)
    expect(screen.getByText("Read 30 min")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Inline edit form — validation + submission (satisfies 6.4 "all forms" req)
// ---------------------------------------------------------------------------

describe("HabitList — inline edit form (HabitInlineEditForm)", () => {
  it("shows a validation error when the name is cleared and Save is clicked", async () => {
    const user = userEvent.setup();
    const habit = makeHabit({ id: "h1", name: "Morning run" });
    renderWithContext({ habits: [habit], editingHabitId: "h1" });

    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/habit name must be at least/i),
      ).toBeInTheDocument();
    });
  });

  it("calls saveEdit with the correct args when a valid name is submitted", async () => {
    const user = userEvent.setup();
    const habit = makeHabit({ id: "h1", name: "Morning run" });
    const saveEdit = vi.fn();
    renderWithContext({ habits: [habit], editingHabitId: "h1", saveEdit });

    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "Evening run");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(saveEdit).toHaveBeenCalledWith("h1", "Evening run");
    });
  });

  it("does not call saveEdit when the form is invalid", async () => {
    const user = userEvent.setup();
    const habit = makeHabit({ id: "h1", name: "Morning run" });
    const saveEdit = vi.fn();
    renderWithContext({ habits: [habit], editingHabitId: "h1", saveEdit });

    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/habit name must be at least/i)).toBeInTheDocument();
    });
    expect(saveEdit).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Delete flow
// ---------------------------------------------------------------------------

describe("HabitList — delete flow", () => {
  it("calls deleteHabit with the habit id when the delete button is clicked", async () => {
    const user = userEvent.setup();
    const habit = makeHabit({ id: "h1", name: "Morning run" });
    const deleteHabit = vi.fn();
    renderWithContext({ habits: [habit], deleteHabit });

    await user.click(screen.getByRole("button", { name: "Delete Morning run" }));
    expect(deleteHabit).toHaveBeenCalledWith("h1");
  });
});

// ---------------------------------------------------------------------------
// Day toggle
// ---------------------------------------------------------------------------

describe("HabitList — day toggle", () => {
  it("calls toggleDayMark with the correct habit id and day index", async () => {
    const user = userEvent.setup();
    const habit = makeHabit({ id: "h1", name: "Morning run" });
    const toggleDayMark = vi.fn();
    renderWithContext({
      habits: [habit],
      visibleWeekDates: [FIXED_DATE],
      toggleDayMark,
    });

    // The day button label is "Toggle Morning run for <date.toDateString()>"
    const dayBtn = screen.getByRole("button", {
      name: `Toggle Morning run for ${FIXED_DATE.toDateString()}`,
    });
    await user.click(dayBtn);

    expect(toggleDayMark).toHaveBeenCalledWith("h1", 0);
  });

  it("renders the day button in unchecked state (aria-pressed=false) by default", () => {
    const habit = makeHabit({ id: "h1", name: "Morning run", days: Array(7).fill(false) });
    renderWithContext({ habits: [habit], visibleWeekDates: [FIXED_DATE] });

    const dayBtn = screen.getByRole("button", {
      name: `Toggle Morning run for ${FIXED_DATE.toDateString()}`,
    });
    expect(dayBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("renders the day button in checked state (aria-pressed=true) when the day is marked", () => {
    const days = Array<boolean>(7).fill(false);
    days[0] = true; // dayIndex 0 corresponds to visibleWeekDates[0]
    const habit = makeHabit({ id: "h1", name: "Morning run", days });
    renderWithContext({ habits: [habit], visibleWeekDates: [FIXED_DATE] });

    const dayBtn = screen.getByRole("button", {
      name: `Toggle Morning run for ${FIXED_DATE.toDateString()}`,
    });
    expect(dayBtn).toHaveAttribute("aria-pressed", "true");
  });
});
