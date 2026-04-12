import { useMemo, useState } from "react";
import usePersistentState from "./usePersistentState";

export interface TaskEntry {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  priority: string;
}

export interface NewTaskForm {
  id?: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  priority: string;
}

const EMPTY_TASK_FORM: NewTaskForm = {
  name: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  priority: "",
};

const isTaskFormComplete = (task: NewTaskForm): boolean =>
  Boolean(
    task.name &&
      task.description &&
      task.date &&
      task.startTime &&
      task.endTime &&
      task.priority
  );

export function useTasks() {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskIndex, setEditTaskIndex] = useState<number | null>(null);
  const [tasks, setTasks] = usePersistentState<TaskEntry[]>("tasks", []);
  const [newTask, setNewTask] = useState<NewTaskForm>(EMPTY_TASK_FORM);
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

  const handleAddButtonClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewTask(EMPTY_TASK_FORM);
  };

  const handleTaskAddition = () => {
    if (!isTaskFormComplete(newTask)) {
      alert("Please fill in all required fields.");
      return;
    }
    const uniqueId = `task-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const taskWithId: TaskEntry = { ...newTask, id: uniqueId } as TaskEntry;
    setTasks([...tasks, taskWithId]);
    handleCloseModal();
  };

  const handleTaskSave = () => {
    if (!isTaskFormComplete(newTask)) {
      alert("Please make sure to fill in all required fields before proceeding.");
      return;
    }
    const updatedTasks = tasks.map((task) =>
      task.id === newTask.id ? (newTask as TaskEntry) : task
    );
    setTasks(updatedTasks);
    setIsEditing(false);
    setEditTaskIndex(null);
    handleCloseModal();
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleTaskEditClick = (taskId: string) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (!taskToEdit) return;
    setIsEditing(true);
    setEditTaskIndex(tasks.indexOf(taskToEdit));
    setNewTask({ ...taskToEdit });
    setShowModal(true);
  };

  const handleTaskCancelClick = () => {
    setIsEditing(false);
    setShowModal(false);
  };

  const updateNewTask = (field: keyof NewTaskForm, value: string) => {
    setNewTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (taskIdentifier: string) => {
    setCheckedTasks((prev) => {
      if (prev.includes(taskIdentifier)) {
        return prev.filter((id) => id !== taskIdentifier);
      }
      return [...prev, taskIdentifier];
    });
  };

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
      editTaskIndex,
      newTask,
      getCurrentDate,
      handleAddButtonClick,
      handleCloseModal,
      handleTaskAddition,
      handleTaskSave,
      handleTaskDelete,
      handleTaskEditClick,
      handleTaskCancelClick,
      updateNewTask,
      groupedTasks,
      checkedTasks,
      handleCheckboxChange,
      sortedTasks,
      generateTaskIdentifier,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tasks, showModal, isEditing, editTaskIndex, newTask, checkedTasks]
  );
}
