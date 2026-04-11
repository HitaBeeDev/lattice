import { createContext, useContext, useState, useEffect } from "react";
import usePersistentState from "../usePersistentState";

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskIndex, setEditTaskIndex] = useState(null);
  const [tasks, setTasks] = usePersistentState("tasks", []);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    priority: "",
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskAddition = () => {
    // Check if any required fields are empty
    if (
      !newTask.name ||
      !newTask.description ||
      !newTask.date ||
      !newTask.startTime ||
      !newTask.endTime ||
      !newTask.priority
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const uniqueId = `task-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const taskWithId = { ...newTask, id: uniqueId };

    setTasks([...tasks, taskWithId]);
    handleCloseModal();
  };

  const handleTaskSave = () => {
    if (
      !newTask.name ||
      !newTask.description ||
      !newTask.date ||
      !newTask.startTime ||
      !newTask.endTime ||
      !newTask.priority
    ) {
      alert(
        "Please make sure to fill in all required fields before proceeding."
      );
      return;
    }

    const updatedTasks = tasks.map((task) =>
      task.id === newTask.id ? newTask : task
    );
    setTasks(updatedTasks);
    setIsEditing(false);
    setEditTaskIndex(null);
    handleCloseModal();
  };

  const getCurrentDate = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
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
    setNewTask({
      name: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      priority: "",
    });
  };

  const handleTaskDelete = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const handleTaskEditClick = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setIsEditing(true);
    setEditTaskIndex(tasks.indexOf(taskToEdit)); // For compatibility with existing code
    setNewTask({ ...taskToEdit });
    setShowModal(true);
  };

  const handleTaskCancelClick = () => {
    setIsEditing(false);
    setShowModal(false);
  };

  const handleTaskSaveClick = () => {
    const updatedTasks = [...tasks];
    updatedTasks[editTaskIndex] = newTask;
    setTasks(updatedTasks);
    setIsEditing(false);
    setEditTaskIndex(null);
    setShowModal(false);
  };

  const updateNewTask = (field, value) => {
    setNewTask((prev) => ({ ...prev, [field]: value }));
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    acc[task.date] = [...(acc[task.date] || []), task];
    return acc;
  }, {});

  const [checkedTasks, setCheckedTasks] = useState([]);

  const handleCheckboxChange = (taskIdentifier) => {
    const newCheckedTasks = [...checkedTasks];
    if (newCheckedTasks.includes(taskIdentifier)) {
      newCheckedTasks.splice(newCheckedTasks.indexOf(taskIdentifier), 1);
    } else {
      newCheckedTasks.push(taskIdentifier);
    }
    setCheckedTasks(newCheckedTasks);
  };

  const sortedTasks = Object.entries(groupedTasks).sort(([dateA], [dateB]) => {
    const dateAObj = new Date(dateA);
    const dateBObj = new Date(dateB);
    return dateAObj - dateBObj;
  });

  const generateTaskIdentifier = (task, index) =>
    `${task.name}-${task.description}-${index}`;

  return (
    <TaskContext.Provider
      value={{
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
        handleTaskSaveClick,
        updateNewTask,
        groupedTasks,
        checkedTasks,
        handleCheckboxChange,
        sortedTasks,
        generateTaskIdentifier,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
