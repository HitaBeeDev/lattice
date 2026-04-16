import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TaskFormValues } from "../../lib/taskSchema";
import type { TaskDraft, TasksContextValue } from "../../hooks/useTasks";

// ---------------------------------------------------------------------------
// Context mock
// ---------------------------------------------------------------------------

vi.mock("../../context/TasksContext", () => ({
  useTasks: vi.fn(),
}));

import { useTasks } from "../../context/TasksContext";
import AddModal from "./AddModal";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TODAY = new Date().toISOString().slice(0, 10);

const baseContext: Pick<
  TasksContextValue,
  | "currentTask"
  | "isEditing"
  | "handleCloseModal"
  | "handleTaskAddition"
  | "handleTaskSave"
  // other fields required by useTasks but not used by AddModal
  | "tasks"
  | "isLoading"
  | "showModal"
  | "getCurrentDate"
  | "handleAddButtonClick"
  | "groupedTasks"
  | "checkedTasks"
  | "handleCheckboxChange"
  | "handleTaskProgressChange"
  | "sortedTasks"
  | "visibleTaskGroups"
  | "upcomingTaskGroups"
  | "handleTaskDelete"
  | "handleTaskEditClick"
  | "handleTaskCancelClick"
> = {
  currentTask: null,
  isEditing: false,
  handleCloseModal: vi.fn(),
  handleTaskAddition: vi.fn(),
  handleTaskSave: vi.fn(),
  tasks: [],
  isLoading: false,
  showModal: true,
  getCurrentDate: vi.fn().mockReturnValue("Monday, 1 Jan 2024"),
  handleAddButtonClick: vi.fn(),
  groupedTasks: {},
  checkedTasks: [],
  handleCheckboxChange: vi.fn(),
  handleTaskProgressChange: vi.fn(),
  sortedTasks: [],
  visibleTaskGroups: [],
  upcomingTaskGroups: [],
  handleTaskDelete: vi.fn(),
  handleTaskEditClick: vi.fn(),
  handleTaskCancelClick: vi.fn(),
};

const renderModal = (overrides: Partial<typeof baseContext> = {}) => {
  vi.mocked(useTasks).mockReturnValue({ ...baseContext, ...overrides } as ReturnType<typeof useTasks>);
  return render(<AddModal />);
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Title / mode
// ---------------------------------------------------------------------------

describe("AddModal — title", () => {
  it("shows 'New task' when not in editing mode", () => {
    renderModal({ isEditing: false });
    expect(screen.getByRole("heading", { name: "New task" })).toBeInTheDocument();
  });

  it("shows 'Edit task' when in editing mode", () => {
    const currentTask: TaskDraft = {
      id: "t1",
      name: "Write report",
      description: "",
      date: TODAY,
      startTime: "",
      endTime: "",
      priority: "Medium",
    };
    renderModal({ isEditing: true, currentTask });
    expect(screen.getByRole("heading", { name: "Edit task" })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Form fields present
// ---------------------------------------------------------------------------

describe("AddModal — form fields", () => {
  it("renders the Task, Date, Start time, and Notes fields", () => {
    renderModal();
    // Use exact strings — /task/i would partially match the "New task" dialog label too
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByLabelText("Task")).toBeInTheDocument();
    expect(within(dialog).getByLabelText("Date")).toBeInTheDocument();
    expect(within(dialog).getByLabelText("Start time")).toBeInTheDocument();
    expect(within(dialog).getByLabelText("Notes")).toBeInTheDocument();
  });

  it("renders all three priority buttons", () => {
    renderModal();
    expect(screen.getByRole("button", { name: /High/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Medium/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Low/i })).toBeInTheDocument();
  });

  it("shows the 'Create task' submit button when not editing", () => {
    renderModal({ isEditing: false });
    expect(screen.getByRole("button", { name: "Create task" })).toBeInTheDocument();
  });

  it("shows the 'Save changes' submit button when editing", () => {
    renderModal({ isEditing: true, currentTask: { name: "Old", description: "", date: TODAY, startTime: "", endTime: "", priority: "Low" } });
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Cancel
// ---------------------------------------------------------------------------

describe("AddModal — cancel", () => {
  it("calls handleCloseModal when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const handleCloseModal = vi.fn();
    renderModal({ handleCloseModal });

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(handleCloseModal).toHaveBeenCalledOnce();
  });

  it("calls handleCloseModal when the modal close (×) button is clicked", async () => {
    const user = userEvent.setup();
    const handleCloseModal = vi.fn();
    renderModal({ handleCloseModal });

    // Scope to the dialog to avoid matching the backdrop (also role=button + aria-label="Close dialog")
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "Close dialog" }));
    expect(handleCloseModal).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

describe("AddModal — validation", () => {
  it("shows 'Task name is required' when submitting with an empty name", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole("button", { name: "Create task" }));

    await waitFor(() => {
      expect(screen.getByText("Task name is required")).toBeInTheDocument();
    });
  });

  it("does not call handleTaskAddition when the form is invalid", async () => {
    const user = userEvent.setup();
    const handleTaskAddition = vi.fn();
    renderModal({ handleTaskAddition });

    await user.click(screen.getByRole("button", { name: "Create task" }));

    await waitFor(() => {
      expect(screen.getByText("Task name is required")).toBeInTheDocument();
    });
    expect(handleTaskAddition).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Submission
// ---------------------------------------------------------------------------

describe("AddModal — submission", () => {
  it("calls handleTaskAddition with the form values on valid submit (add mode)", async () => {
    const user = userEvent.setup();
    const handleTaskAddition = vi.fn();
    renderModal({ handleTaskAddition, isEditing: false });

    await user.type(within(screen.getByRole("dialog")).getByLabelText("Task"), "Buy groceries");
    await user.click(screen.getByRole("button", { name: "Create task" }));

    await waitFor(() => {
      expect(handleTaskAddition).toHaveBeenCalledOnce();
    });

    const submitted = handleTaskAddition.mock.calls[0][0] as TaskFormValues;
    expect(submitted.name).toBe("Buy groceries");
  });

  it("calls handleTaskSave (not handleTaskAddition) when editing", async () => {
    const user = userEvent.setup();
    const handleTaskSave = vi.fn();
    const handleTaskAddition = vi.fn();
    const currentTask: TaskDraft = {
      id: "t1",
      name: "Old task",
      description: "",
      date: TODAY,
      startTime: "",
      endTime: "",
      priority: "Medium",
    };

    renderModal({ isEditing: true, currentTask, handleTaskSave, handleTaskAddition });

    // Clear the pre-filled name and type a new one
    const nameInput = within(screen.getByRole("dialog")).getByLabelText("Task");
    await user.clear(nameInput);
    await user.type(nameInput, "Updated task");

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(handleTaskSave).toHaveBeenCalledOnce();
    });
    expect(handleTaskAddition).not.toHaveBeenCalled();
  });
});
