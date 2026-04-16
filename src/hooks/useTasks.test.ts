import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Task } from "../types/task";
import { useTasks } from "./useTasks";

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock("dexie-react-hooks", () => ({
  useLiveQuery: vi.fn(),
}));

vi.mock("../db/database", () => ({
  db: {
    tasks: {
      add: vi.fn().mockResolvedValue("mock-id"),
      put: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    },
  },
}));

// ---------------------------------------------------------------------------
// Import mocked modules after vi.mock declarations
// ---------------------------------------------------------------------------

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/database";

const mockUseLiveQuery = vi.mocked(useLiveQuery);
const mockTasksTable = vi.mocked(db.tasks);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// A fixed "today" string used across all grouping/sorting assertions.
// Use a date that is well in the past so "future" dates can be constructed
// relative to it without depending on the current wall-clock date.
const TODAY = "2024-06-15";

let taskCounter = 0;

const makeTask = (overrides: Partial<Task> = {}): Task => {
  taskCounter++;
  return {
    id: `task-${taskCounter}`,
    name: `Task ${taskCounter}`,
    description: "",
    date: TODAY,
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

beforeEach(() => {
  vi.clearAllMocks();
  taskCounter = 0;
  mockUseLiveQuery.mockReturnValue([]);
});

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------

describe("useTasks — loading state", () => {
  it("isLoading is true when useLiveQuery returns undefined", () => {
    mockUseLiveQuery.mockReturnValue(undefined);
    const { result } = renderHook(() => useTasks());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.tasks).toEqual([]);
  });

  it("isLoading is false when useLiveQuery returns an array", () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.isLoading).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// groupedTasks
// ---------------------------------------------------------------------------

describe("useTasks — groupedTasks", () => {
  it("is empty when there are no tasks", () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.groupedTasks).toEqual({});
  });

  it("groups tasks by their date key", () => {
    const t1 = makeTask({ date: "2024-06-15" });
    const t2 = makeTask({ date: "2024-06-15" });
    const t3 = makeTask({ date: "2024-06-20" });
    mockUseLiveQuery.mockReturnValue([t1, t2, t3]);
    const { result } = renderHook(() => useTasks());
    expect(result.current.groupedTasks["2024-06-15"]).toHaveLength(2);
    expect(result.current.groupedTasks["2024-06-20"]).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// sortedTasks
// ---------------------------------------------------------------------------

describe("useTasks — sortedTasks", () => {
  it("sorts groups in ascending date order", () => {
    const t1 = makeTask({ date: "2024-07-01" });
    const t2 = makeTask({ date: "2024-05-01" });
    const t3 = makeTask({ date: "2024-06-15" });
    mockUseLiveQuery.mockReturnValue([t1, t2, t3]);
    const { result } = renderHook(() => useTasks());
    const dates = result.current.sortedTasks.map(([date]) => date);
    expect(dates).toEqual(["2024-05-01", "2024-06-15", "2024-07-01"]);
  });
});

// ---------------------------------------------------------------------------
// checkedTasks
// ---------------------------------------------------------------------------

describe("useTasks — checkedTasks", () => {
  it("contains ids of completed tasks only", () => {
    const done = makeTask({ isCompleted: true, status: "completed" });
    const pending = makeTask({ isCompleted: false });
    mockUseLiveQuery.mockReturnValue([done, pending]);
    const { result } = renderHook(() => useTasks());
    expect(result.current.checkedTasks).toContain(done.id);
    expect(result.current.checkedTasks).not.toContain(pending.id);
  });
});

// ---------------------------------------------------------------------------
// Modal state
// ---------------------------------------------------------------------------

describe("useTasks — modal state", () => {
  it("showModal starts as false", () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.showModal).toBe(false);
  });

  it("handleAddButtonClick opens the modal and resets editing state", () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.handleAddButtonClick();
    });
    expect(result.current.showModal).toBe(true);
    expect(result.current.isEditing).toBe(false);
    expect(result.current.currentTask).toBeNull();
  });

  it("handleCloseModal closes the modal", () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.handleAddButtonClick();
    });
    act(() => {
      result.current.handleCloseModal();
    });
    expect(result.current.showModal).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// handleTaskAddition
// ---------------------------------------------------------------------------

describe("useTasks — handleTaskAddition", () => {
  it("calls db.tasks.add and closes the modal", () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.handleAddButtonClick();
    });
    act(() => {
      result.current.handleTaskAddition({
        name: "Buy groceries",
        description: "",
        date: "2024-06-20",
        startTime: "",
        endTime: "",
        priority: "Low",
      });
    });
    expect(mockTasksTable.add).toHaveBeenCalledOnce();
    expect(result.current.showModal).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// handleTaskDelete
// ---------------------------------------------------------------------------

describe("useTasks — handleTaskDelete", () => {
  it("calls db.tasks.delete with the correct id", () => {
    const task = makeTask({ id: "task-del" });
    mockUseLiveQuery.mockReturnValue([task]);
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.handleTaskDelete("task-del");
    });
    expect(mockTasksTable.delete).toHaveBeenCalledWith("task-del");
  });
});

// ---------------------------------------------------------------------------
// handleTaskEditClick
// ---------------------------------------------------------------------------

describe("useTasks — handleTaskEditClick", () => {
  it("opens modal in editing mode with the task pre-filled", () => {
    const task = makeTask({ id: "task-edit", name: "Write report" });
    mockUseLiveQuery.mockReturnValue([task]);
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.handleTaskEditClick("task-edit");
    });
    expect(result.current.showModal).toBe(true);
    expect(result.current.isEditing).toBe(true);
    expect(result.current.currentTask?.name).toBe("Write report");
  });

  it("does nothing when the task id is not found", () => {
    mockUseLiveQuery.mockReturnValue([]);
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.handleTaskEditClick("nonexistent");
    });
    expect(result.current.showModal).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// handleCheckboxChange
// ---------------------------------------------------------------------------

describe("useTasks — handleCheckboxChange", () => {
  it("marks a pending task as completed", () => {
    const task = makeTask({ id: "task-cb", isCompleted: false, status: "pending" });
    mockUseLiveQuery.mockReturnValue([task]);
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.handleCheckboxChange("task-cb");
    });
    expect(mockTasksTable.put).toHaveBeenCalledOnce();
    const putArg = vi.mocked(mockTasksTable.put).mock.calls[0][0] as Task;
    expect(putArg.isCompleted).toBe(true);
    expect(putArg.status).toBe("completed");
  });

  it("marks a completed task back to pending", () => {
    const task = makeTask({
      id: "task-uncb",
      isCompleted: true,
      status: "completed",
    });
    mockUseLiveQuery.mockReturnValue([task]);
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.handleCheckboxChange("task-uncb");
    });
    const putArg = vi.mocked(mockTasksTable.put).mock.calls[0][0] as Task;
    expect(putArg.isCompleted).toBe(false);
    expect(putArg.status).toBe("pending");
  });

  it("does nothing when id is not found", () => {
    mockUseLiveQuery.mockReturnValue([]);
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.handleCheckboxChange("nonexistent");
    });
    expect(mockTasksTable.put).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// handleTaskProgressChange
// ---------------------------------------------------------------------------

describe("useTasks — handleTaskProgressChange", () => {
  it("transitions a pending task to in_progress", () => {
    const task = makeTask({ id: "task-prog", status: "pending" });
    mockUseLiveQuery.mockReturnValue([task]);
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.handleTaskProgressChange("task-prog");
    });
    const putArg = vi.mocked(mockTasksTable.put).mock.calls[0][0] as Task;
    expect(putArg.status).toBe("in_progress");
  });

  it("transitions an in_progress task back to pending", () => {
    const task = makeTask({ id: "task-back", status: "in_progress" });
    mockUseLiveQuery.mockReturnValue([task]);
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.handleTaskProgressChange("task-back");
    });
    const putArg = vi.mocked(mockTasksTable.put).mock.calls[0][0] as Task;
    expect(putArg.status).toBe("pending");
  });

  it("does nothing for a completed task", () => {
    const task = makeTask({
      id: "task-comp",
      isCompleted: true,
      status: "completed",
    });
    mockUseLiveQuery.mockReturnValue([task]);
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.handleTaskProgressChange("task-comp");
    });
    expect(mockTasksTable.put).not.toHaveBeenCalled();
  });
});
