import { useCallback, useMemo, useState } from "react";
import usePersistentState from "./usePersistentState";
import { PRIORITY_OPTIONS, type Priority, type TaskFormValues } from "../lib/taskSchema";

export interface TaskEntry {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  priority: Priority;
}

export interface TaskDraft extends TaskFormValues {
  id?: string;
}

export const EMPTY_TASK_FORM: TaskFormValues = {
  name: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  priority: PRIORITY_OPTIONS[1],
};

export function useTasks() {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tasks, setTasks] = usePersistentState<TaskEntry[]>("tasks", []);
  const [currentTask, setCurrentTask] = useState<TaskDraft | null>(null);
  const [checkedTasks, setCheckedTasks] = usePersistentState<string[]>("checkedTasks", []);

  const getCurrentDate = (): string => {
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
  };

  const handleAddButtonClick = useCallback(() => {
    setIsEditing(false);
    setCurrentTask(null);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setCurrentTask(null);
    setIsEditing(false);
  }, []);

  const handleTaskAddition = useCallback((task: TaskFormValues) => {
    const uniqueId = `task-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const taskWithId: TaskEntry = { ...task, id: uniqueId };
    setTasks((prev) => [...prev, taskWithId]);
    handleCloseModal();
  }, [handleCloseModal, setTasks]);

  const handleTaskSave = useCallback((task: TaskFormValues) => {
    if (!currentTask?.id) {
      return;
    }
    const updatedTasks = tasks.map((existingTask) =>
      existingTask.id === currentTask.id ? { ...task, id: currentTask.id } : existingTask
    );
    setTasks(updatedTasks);
    handleCloseModal();
  }, [currentTask?.id, handleCloseModal, setTasks, tasks]);

  const handleTaskDelete = useCallback((taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  }, [tasks]);

  const handleTaskEditClick = useCallback((taskId: string) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (!taskToEdit) return;
    setIsEditing(true);
    setCurrentTask({ ...taskToEdit });
    setShowModal(true);
  }, [tasks]);

  const handleTaskCancelClick = useCallback(() => {
    handleCloseModal();
  }, []);

  const handleCheckboxChange = useCallback((taskIdentifier: string) => {
    setCheckedTasks((prev) => {
      if (prev.includes(taskIdentifier)) {
        return prev.filter((id) => id !== taskIdentifier);
      }
      return [...prev, taskIdentifier];
    });
  }, []);

  const generateTaskIdentifier = (task: TaskEntry, index: number): string =>
    `${task.name}-${task.description}-${index}`;

  const groupedTasks = tasks.reduce<Record<string, TaskEntry[]>>((acc, task) => {
    acc[task.date] = [...(acc[task.date] || []), task];
    return acc;
  }, {});

  const sortedTasks = Object.entries(groupedTasks).sort(([dateA], [dateB]) => {
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });

  return useMemo(
    () => ({
      tasks,
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
      sortedTasks,
      generateTaskIdentifier,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tasks, showModal, isEditing, currentTask, checkedTasks]
  );
}
