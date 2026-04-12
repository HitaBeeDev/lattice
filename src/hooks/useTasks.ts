import { useCallback, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { PRIORITY_OPTIONS, type TaskFormValues } from "../lib/taskSchema";
import { db, type TaskEntry } from "../db/database";

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
  const taskEntries = useLiveQuery(() => db.tasks.toArray(), [], []);
  const tasks = useMemo(() => taskEntries ?? [], [taskEntries]);
  const [currentTask, setCurrentTask] = useState<TaskDraft | null>(null);
  const checkedTasks = useMemo(
    () => tasks.filter((task) => task.isCompleted).map((task) => task.id),
    [tasks]
  );

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
    const taskWithId: TaskEntry = {
      ...task,
      id: uniqueId,
      isCompleted: false,
    };
    void db.tasks.add(taskWithId);
    handleCloseModal();
  }, [handleCloseModal]);

  const handleTaskSave = useCallback((task: TaskFormValues) => {
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
    });
    handleCloseModal();
  }, [currentTask?.id, handleCloseModal, tasks]);

  const handleTaskDelete = useCallback((taskId: string) => {
    void db.tasks.delete(taskId);
  }, []);

  const handleTaskEditClick = useCallback((taskId: string) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (!taskToEdit) return;
    setIsEditing(true);
    setCurrentTask({ ...taskToEdit });
    setShowModal(true);
  }, [tasks]);

  const handleTaskCancelClick = useCallback(() => {
    handleCloseModal();
  }, [handleCloseModal]);

  const handleCheckboxChange = useCallback((taskIdentifier: string) => {
    const task = tasks.find((entry) => entry.id === taskIdentifier);
    if (!task) {
      return;
    }

    void db.tasks.put({ ...task, isCompleted: !task.isCompleted });
  }, [tasks]);

  const groupedTasks = tasks.reduce<Record<string, TaskEntry[]>>((acc, task) => {
    acc[task.date] = [...(acc[task.date] || []), task];
    return acc;
  }, {});

  const sortedTasks = Object.entries(groupedTasks).sort(([dateA], [dateB]) => {
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });

  return {
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
  };
}
