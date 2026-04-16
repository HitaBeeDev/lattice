import { useCallback, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/database";
import { PRIORITY_OPTIONS, type TaskFormValues } from "../lib/taskSchema";
import type { Task } from "../types/task";

export interface TaskDraft extends TaskFormValues {
  id?: string;
}

export interface TaskGroupEntry {
  date: string;
  tasks: Task[];
}

export interface TasksContextValue {
  tasks: Task[];
  isLoading: boolean;
  showModal: boolean;
  isEditing: boolean;
  currentTask: TaskDraft | null;
  getCurrentDate: () => string;
  handleAddButtonClick: () => void;
  handleCloseModal: () => void;
  handleTaskAddition: (task: TaskFormValues) => void;
  handleTaskSave: (task: TaskFormValues) => void;
  handleTaskDelete: (taskId: string) => void;
  handleTaskEditClick: (taskId: string) => void;
  handleTaskCancelClick: () => void;
  groupedTasks: Record<string, Task[]>;
  checkedTasks: string[];
  handleCheckboxChange: (taskId: string) => void;
  handleTaskProgressChange: (taskId: string) => void;
  sortedTasks: [string, Task[]][];
  visibleTaskGroups: TaskGroupEntry[];
  upcomingTaskGroups: TaskGroupEntry[];
}

export const getEmptyTaskForm = (): TaskFormValues => ({
  name: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  startTime: "",
  endTime: "",
  priority: PRIORITY_OPTIONS[1],
});

const createTaskRecord = (task: TaskFormValues): Task => {
  const timestamp = new Date().toISOString();

  return {
    ...task,
    id: `task-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    isCompleted: false,
    status: "pending",
    tags: [],
    subtasks: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

const getTodayKey = (): string => new Date().toISOString().slice(0, 10);

export function useTasks(): TasksContextValue {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const taskEntries = useLiveQuery<Task[] | undefined>(() => db.tasks.toArray(), []);
  const tasks = useMemo<Task[]>(() => taskEntries ?? [], [taskEntries]);
  const [currentTask, setCurrentTask] = useState<TaskDraft | null>(null);

  const checkedTasks = useMemo<string[]>(
    () => tasks.filter((task) => task.isCompleted).map((task) => task.id),
    [tasks]
  );

  const getCurrentDate = useCallback((): string => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const days = [
      "Sunday", "Monday", "Tuesday", "Wednesday",
      "Thursday", "Friday", "Saturday",
    ];
    const currentDate = new Date();
    const dayOfWeek = days[currentDate.getDay()];
    const dayOfMonth = currentDate.getDate();
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    return `${dayOfWeek}, ${dayOfMonth} ${month} ${year}`;
  }, []);

  const handleAddButtonClick = useCallback((): void => {
    setIsEditing(false);
    setCurrentTask(null);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback((): void => {
    setShowModal(false);
    setCurrentTask(null);
    setIsEditing(false);
  }, []);

  const handleTaskAddition = useCallback((task: TaskFormValues): void => {
    void db.tasks.add(createTaskRecord(task));
    handleCloseModal();
  }, [handleCloseModal]);

  const handleTaskSave = useCallback((task: TaskFormValues): void => {
    if (!currentTask?.id) {
      return;
    }

    const existingTask = tasks.find((entry) => entry.id === currentTask.id);
    if (!existingTask) {
      return;
    }

    void db.tasks.put({
      ...existingTask,
      ...task,
      id: currentTask.id,
      updatedAt: new Date().toISOString(),
    });
    handleCloseModal();
  }, [currentTask?.id, handleCloseModal, tasks]);

  const handleTaskDelete = useCallback((taskId: string): void => {
    void db.tasks.delete(taskId);
  }, []);

  const handleTaskEditClick = useCallback((taskId: string): void => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (!taskToEdit) {
      return;
    }

    setIsEditing(true);
    setCurrentTask({
      id: taskToEdit.id,
      name: taskToEdit.name,
      description: taskToEdit.description,
      date: taskToEdit.date,
      startTime: taskToEdit.startTime,
      endTime: taskToEdit.endTime,
      priority: taskToEdit.priority,
    });
    setShowModal(true);
  }, [tasks]);

  const handleTaskCancelClick = useCallback((): void => {
    handleCloseModal();
  }, [handleCloseModal]);

  const handleCheckboxChange = useCallback((taskId: string): void => {
    const task = tasks.find((entry) => entry.id === taskId);
    if (!task) {
      return;
    }

    const isCompleted = !task.isCompleted;

    void db.tasks.put({
      ...task,
      isCompleted,
      status: isCompleted ? "completed" : "pending",
      updatedAt: new Date().toISOString(),
    });
  }, [tasks]);

  const handleTaskProgressChange = useCallback((taskId: string): void => {
    const task = tasks.find((entry) => entry.id === taskId);
    if (!task || task.isCompleted) {
      return;
    }

    void db.tasks.put({
      ...task,
      status: task.status === "in_progress" ? "pending" : "in_progress",
      updatedAt: new Date().toISOString(),
    });
  }, [tasks]);

  const groupedTasks = useMemo<Record<string, Task[]>>(
    () =>
      tasks.reduce<Record<string, Task[]>>((accumulator, task) => {
        accumulator[task.date] = [...(accumulator[task.date] ?? []), task];
        return accumulator;
      }, {}),
    [tasks]
  );

  const sortedTasks = useMemo<[string, Task[]][]>(
    () =>
      Object.entries(groupedTasks).sort(([dateA], [dateB]) => {
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      }),
    [groupedTasks]
  );

  const visibleTaskGroups = useMemo<TaskGroupEntry[]>(
    () =>
      sortedTasks
        .filter(([date]) => date >= getTodayKey())
        .map(([date, dateTasks]) => ({ date, tasks: dateTasks })),
    [sortedTasks]
  );

  const upcomingTaskGroups = useMemo<TaskGroupEntry[]>(
    () =>
      sortedTasks
        .map(([date, dateTasks]) => ({
          date,
          tasks: dateTasks.filter((task) => !task.isCompleted),
        }))
        .filter(({ date, tasks }) => date > getTodayKey() && tasks.length > 0),
    [sortedTasks]
  );

  return useMemo<TasksContextValue>(
    () => ({
      tasks,
      isLoading: taskEntries === undefined,
      showModal,
      isEditing,
      currentTask,
      getCurrentDate,
      handleAddButtonClick,
      handleCloseModal,
      handleTaskAddition,
      handleTaskSave,
      handleTaskDelete,
      handleTaskEditClick,
      handleTaskCancelClick,
      groupedTasks,
      checkedTasks,
      handleCheckboxChange,
      handleTaskProgressChange,
      sortedTasks,
      visibleTaskGroups,
      upcomingTaskGroups,
    }),
    [
      tasks,
      taskEntries,
      showModal,
      isEditing,
      currentTask,
      getCurrentDate,
      handleAddButtonClick,
      handleCloseModal,
      handleTaskAddition,
      handleTaskSave,
      handleTaskDelete,
      handleTaskEditClick,
      handleTaskCancelClick,
      groupedTasks,
      checkedTasks,
      handleCheckboxChange,
      handleTaskProgressChange,
      sortedTasks,
      visibleTaskGroups,
      upcomingTaskGroups,
    ]
  );
}
