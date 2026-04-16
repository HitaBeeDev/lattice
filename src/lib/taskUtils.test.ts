import { describe, expect, it } from "vitest";
import type { Task } from "../types/task";
import { computeTaskCardStats } from "./taskStats";
import { getUpcomingTasks } from "./taskWidget";

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
    date: "2024-06-01",
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

// ---------------------------------------------------------------------------
// computeTaskCardStats
// ---------------------------------------------------------------------------

describe("computeTaskCardStats", () => {
  it("returns all zeros for an empty task list", () => {
    const stats = computeTaskCardStats([]);
    expect(stats).toEqual({
      completedCount: 0,
      inProgressCount: 0,
      remainingCount: 0,
      progress: 0,
      inProgressPct: 0,
      remainingPct: 0,
    });
  });

  it("counts completed tasks and calculates percentage", () => {
    const tasks = [
      makeTask({ isCompleted: true, status: "completed" }),
      makeTask({ isCompleted: true, status: "completed" }),
      makeTask({ isCompleted: false, status: "pending" }),
      makeTask({ isCompleted: false, status: "pending" }),
    ];
    const stats = computeTaskCardStats(tasks);
    expect(stats.completedCount).toBe(2);
    expect(stats.progress).toBe(50); // 2/4 * 100
  });

  it("counts in-progress tasks (not completed) separately from remaining", () => {
    const tasks = [
      makeTask({ isCompleted: true, status: "completed" }),
      makeTask({ isCompleted: false, status: "in_progress" }),
      makeTask({ isCompleted: false, status: "pending" }),
      makeTask({ isCompleted: false, status: "pending" }),
    ];
    const stats = computeTaskCardStats(tasks);
    expect(stats.completedCount).toBe(1);
    expect(stats.inProgressCount).toBe(1);
    expect(stats.remainingCount).toBe(2);
    expect(stats.progress).toBe(25);
    expect(stats.inProgressPct).toBe(25);
    expect(stats.remainingPct).toBe(50);
  });

  it("does not count a completed+in_progress task as in-progress", () => {
    // isCompleted takes precedence; the task should not appear in inProgressCount
    const tasks = [
      makeTask({ isCompleted: true, status: "in_progress" }),
    ];
    const stats = computeTaskCardStats(tasks);
    expect(stats.completedCount).toBe(1);
    expect(stats.inProgressCount).toBe(0);
  });

  it("rounds percentages to the nearest integer", () => {
    const tasks = [
      makeTask({ isCompleted: true, status: "completed" }),
      makeTask(),
      makeTask(),
    ];
    // 1/3 ≈ 33.33 → Math.round = 33
    const stats = computeTaskCardStats(tasks);
    expect(stats.progress).toBe(33);
  });

  it("remainingCount is never negative", () => {
    // Edge: all tasks completed + some in_progress (isCompleted:true) could over-count
    const tasks = [makeTask({ isCompleted: true, status: "completed" })];
    expect(computeTaskCardStats(tasks).remainingCount).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getUpcomingTasks
// ---------------------------------------------------------------------------

describe("getUpcomingTasks", () => {
  it("returns an empty array when groupedTasks is empty", () => {
    expect(getUpcomingTasks({}, [])).toEqual([]);
  });

  it("returns only unchecked tasks", () => {
    const task1 = makeTask({ id: "checked", date: "2024-06-01" });
    const task2 = makeTask({ id: "visible", date: "2024-06-01" });
    const grouped = { "2024-06-01": [task1, task2] };
    const result = getUpcomingTasks(grouped, ["checked"]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("visible");
  });

  it("takes at most 2 groups (sorted by date) and 2 tasks per group", () => {
    const t1 = makeTask({ date: "2024-06-03" });
    const t2 = makeTask({ date: "2024-06-03" });
    const t3 = makeTask({ date: "2024-06-03" }); // 3rd — should be dropped
    const t4 = makeTask({ date: "2024-06-01" });
    const t5 = makeTask({ date: "2024-06-02" });
    const t6 = makeTask({ date: "2024-06-02" });
    const t7 = makeTask({ date: "2024-06-02" }); // 3rd in group 2 — dropped

    const grouped = {
      "2024-06-03": [t1, t2, t3],
      "2024-06-01": [t4],
      "2024-06-02": [t5, t6, t7],
    };

    const result = getUpcomingTasks(grouped, []);
    // Groups sorted: 06-01 (1 task), 06-02 (3 tasks), 06-03 (3 tasks)
    // Take first 2 groups: 06-01 → [t4], 06-02 → [t5, t6] (max 2)
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe(t4.id);
    expect(result[1].id).toBe(t5.id);
    expect(result[2].id).toBe(t6.id);
  });

  it("returns tasks in ascending date order", () => {
    const earlier = makeTask({ date: "2024-05-01" });
    const later = makeTask({ date: "2024-07-01" });
    const grouped = {
      "2024-07-01": [later],
      "2024-05-01": [earlier],
    };
    const result = getUpcomingTasks(grouped, []);
    expect(result[0].id).toBe(earlier.id);
    expect(result[1].id).toBe(later.id);
  });
});
