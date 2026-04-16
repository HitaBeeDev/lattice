import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Task } from "../../types/task";
import type { TasksContextValue } from "../../hooks/useTasks";

// ---------------------------------------------------------------------------
// Context mock
// ---------------------------------------------------------------------------

vi.mock("../../context/TasksContext", () => ({
  useTasks: vi.fn(),
}));

import { useTasks } from "../../context/TasksContext";
import TasksWidget from "./TasksWidget";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let taskCounter = 0;
const makeTask = (overrides: Partial<Task> = {}): Task => {
  taskCounter++;
  return {
    id: `task-${taskCounter}`,
    name: `Task ${taskCounter}`,
    description: "",
    date: "2024-07-01",
    startTime: "09:00",
    endTime: "10:00",
    priority: "Medium",
    isCompleted: false,
    status: "pending",
    tags: [],
    subtasks: [],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    ...overrides,
  };
};

// Minimal context — only the fields TasksWidget actually reads
const baseContext: TasksContextValue = {
  tasks: [],
  isLoading: false,
  showModal: false,
  isEditing: false,
  currentTask: null,
  getCurrentDate: vi.fn(),
  handleAddButtonClick: vi.fn(),
  handleCloseModal: vi.fn(),
  handleTaskAddition: vi.fn(),
  handleTaskSave: vi.fn(),
  handleTaskDelete: vi.fn(),
  handleTaskEditClick: vi.fn(),
  handleTaskCancelClick: vi.fn(),
  groupedTasks: {},
  checkedTasks: [],
  handleCheckboxChange: vi.fn(),
  handleTaskProgressChange: vi.fn(),
  sortedTasks: [],
  visibleTaskGroups: [],
  upcomingTaskGroups: [],
};

const renderWidget = (overrides: Partial<TasksContextValue> = {}) => {
  vi.mocked(useTasks).mockReturnValue({ ...baseContext, ...overrides });
  return render(<TasksWidget />);
};

beforeEach(() => {
  vi.clearAllMocks();
  taskCounter = 0;
});

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------

describe("TasksWidget — loading", () => {
  it("shows a skeleton and hides the 'Delivery queue' heading while loading", () => {
    renderWidget({ isLoading: true });
    // The heading only appears in the non-loading branch
    expect(screen.queryByText("Delivery queue")).not.toBeInTheDocument();
    // Skeletons are rendered with aria-hidden so the page doesn't expose fake content
    const skeletons = document.querySelectorAll("[aria-hidden='true']");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

describe("TasksWidget — empty state", () => {
  it("shows the 'No tasks ahead' empty state when there are no upcoming tasks", () => {
    renderWidget({ groupedTasks: {}, checkedTasks: [] });
    expect(screen.getByText("No tasks ahead")).toBeInTheDocument();
  });

  it("shows the 'Delivery queue' header when loaded (even if empty)", () => {
    renderWidget({ isLoading: false });
    expect(screen.getByText("Delivery queue")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Renders tasks
// ---------------------------------------------------------------------------

describe("TasksWidget — task list", () => {
  it("renders task names for upcoming tasks", () => {
    const task = makeTask({ name: "Write unit tests" });
    renderWidget({
      groupedTasks: { [task.date]: [task] },
      checkedTasks: [],
    });
    expect(screen.getByText("Write unit tests")).toBeInTheDocument();
  });

  it("renders the task date", () => {
    const task = makeTask({ date: "2024-07-01" });
    renderWidget({
      groupedTasks: { "2024-07-01": [task] },
      checkedTasks: [],
    });
    expect(screen.getByText("2024-07-01")).toBeInTheDocument();
  });

  it("renders the task time range", () => {
    const task = makeTask({ startTime: "10:00", endTime: "11:00" });
    renderWidget({
      groupedTasks: { [task.date]: [task] },
      checkedTasks: [],
    });
    expect(screen.getByText("10:00 - 11:00")).toBeInTheDocument();
  });

  it("renders a priority badge for each task", () => {
    const task = makeTask({ priority: "High" });
    renderWidget({
      groupedTasks: { [task.date]: [task] },
      checkedTasks: [],
    });
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("does not render a completed (checked) task", () => {
    const checkedTask = makeTask({ id: "done", name: "Done task", isCompleted: true });
    const pendingTask = makeTask({ id: "todo", name: "Pending task" });

    renderWidget({
      groupedTasks: {
        [checkedTask.date]: [checkedTask, pendingTask],
      },
      checkedTasks: ["done"],
    });

    expect(screen.queryByText("Done task")).not.toBeInTheDocument();
    expect(screen.getByText("Pending task")).toBeInTheDocument();
  });

  it("renders at most 4 tasks total (2 groups × 2 tasks)", () => {
    // 3 tasks per group across 3 groups — widget should show at most 4
    const makeGroup = (date: string, count: number) =>
      Object.fromEntries([[date, Array.from({ length: count }, () => makeTask({ date }))]]);

    const grouped = {
      ...makeGroup("2024-05-01", 3),
      ...makeGroup("2024-06-01", 3),
      ...makeGroup("2024-07-01", 3),
    };

    renderWidget({ groupedTasks: grouped, checkedTasks: [] });

    // Each rendered task shows a time range "09:00 - 10:00"
    const timeRanges = screen.getAllByText("09:00 - 10:00");
    expect(timeRanges).toHaveLength(4);
  });
});
