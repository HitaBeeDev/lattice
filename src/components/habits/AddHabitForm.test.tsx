import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Habit } from "../../types/habit";
import AddHabitForm from "./AddHabitForm";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeHabit = (name: string): Habit => ({
  id: `h-${name}`,
  name,
  category: "other",
  frequency: "daily",
  days: Array<boolean>(7).fill(false),
  isArchived: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
});

const renderForm = (habits: Habit[] = [], onAdd = vi.fn()) => {
  return render(<AddHabitForm habits={habits} onAdd={onAdd} />);
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe("AddHabitForm — fields", () => {
  it("renders the habit name input", () => {
    renderForm();
    expect(screen.getByPlaceholderText(/morning run/i)).toBeInTheDocument();
  });

  it("renders frequency options (daily, weekly, custom)", () => {
    renderForm();
    expect(screen.getByText("daily")).toBeInTheDocument();
    expect(screen.getByText("weekly")).toBeInTheDocument();
    expect(screen.getByText("custom")).toBeInTheDocument();
  });

  it("renders the Add habit submit button", () => {
    renderForm();
    expect(screen.getByRole("button", { name: /add habit/i })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Validation — error path
// ---------------------------------------------------------------------------

describe("AddHabitForm — validation errors", () => {
  it("shows an error when the name is empty on submit", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: /add habit/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/habit name must be at least/i),
      ).toBeInTheDocument();
    });
  });

  it("shows an error for a single-character name (below min length of 2)", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByPlaceholderText(/morning run/i), "X");
    await user.click(screen.getByRole("button", { name: /add habit/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/habit name must be at least/i),
      ).toBeInTheDocument();
    });
  });

  it("does not call onAdd when the form is invalid", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    renderForm([], onAdd);

    await user.click(screen.getByRole("button", { name: /add habit/i }));

    await waitFor(() => {
      expect(screen.getByText(/habit name must be at least/i)).toBeInTheDocument();
    });
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("shows a duplicate-name error when the same habit already exists", async () => {
    const user = userEvent.setup();
    const existingHabit = makeHabit("Morning run");
    renderForm([existingHabit]);

    await user.type(screen.getByPlaceholderText(/morning run/i), "Morning run");
    await user.click(screen.getByRole("button", { name: /add habit/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/habit with this name already exists/i),
      ).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// Submission — success path
// ---------------------------------------------------------------------------

describe("AddHabitForm — valid submission", () => {
  it("calls onAdd with the correct values for a valid daily habit", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    renderForm([], onAdd);

    await user.type(screen.getByPlaceholderText(/morning run/i), "Gym session");
    await user.click(screen.getByRole("button", { name: /add habit/i }));

    await waitFor(() => {
      expect(onAdd).toHaveBeenCalledOnce();
    });
    const submitted = onAdd.mock.calls[0][0];
    expect(submitted.name).toBe("Gym session");
    expect(submitted.frequency).toBe("daily");
  });

  it("resets the form after a successful submission", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    renderForm([], onAdd);

    const input = screen.getByPlaceholderText(/morning run/i);
    await user.type(input, "Gym session");
    await user.click(screen.getByRole("button", { name: /add habit/i }));

    await waitFor(() => {
      expect(onAdd).toHaveBeenCalled();
    });
    // After successful submit, the form should reset (input cleared)
    expect((input as HTMLInputElement).value).toBe("");
  });

  it("calls onAdd with 'custom' frequency when that option is selected", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    renderForm([], onAdd);

    await user.type(screen.getByPlaceholderText(/morning run/i), "Custom workout");

    // Click the custom frequency radio
    const customLabel = screen.getByText("custom");
    await user.click(customLabel);

    // Select at least one day to satisfy the custom-frequency refinement
    const dayButtons = screen.getAllByRole("button");
    // Day picker buttons appear after selecting "custom" — first one is a day button
    const firstDayBtn = dayButtons.find(
      (btn) => btn.getAttribute("type") === "button" && btn.getAttribute("aria-pressed") !== null,
    );
    if (firstDayBtn) await user.click(firstDayBtn);

    await user.click(screen.getByRole("button", { name: /add habit/i }));

    await waitFor(() => {
      expect(onAdd).toHaveBeenCalled();
    });
    expect(onAdd.mock.calls[0][0].frequency).toBe("custom");
  });
});
