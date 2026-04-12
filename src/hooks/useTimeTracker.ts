import { useEffect, useState } from "react";
import articles from "../components/pomodoro/articles";

export type SessionType = "Pomodoro" | "ShortBreak" | "LongBreak";

export interface Project {
  id: string;
  name: string;
}

const SESSION_DURATIONS: Record<SessionType, number> = {
  Pomodoro: 25 * 60,
  ShortBreak: 15 * 60,
  LongBreak: 30 * 60,
};

const INITIAL_TOTAL_SECONDS = SESSION_DURATIONS.Pomodoro;
const TIMER_RADIUS = 80;

export function useTimeTracker() {
  const [totalSeconds, setTotalSeconds] = useState(INITIAL_TOTAL_SECONDS);
  const [maxSeconds, setMaxSeconds] = useState(INITIAL_TOTAL_SECONDS);
  const [timerId, setTimerId] = useState<ReturnType<typeof setInterval> | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTime, setEditTime] = useState("");
  const [sessionType, setSessionType] = useState<SessionType>("Pomodoro");

  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTimes, setProjectTimes] = useState<Record<string, number>>({});
  const [projectRemainingTimes, setProjectRemainingTimes] = useState<Record<string, number>>({});

  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentArticleIndex((prev) => (prev + 1) % articles.length);
    }, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isTimerActive) return;

    const id = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 0) {
          clearInterval(id);
          setIsTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
      setProjectRemainingTimes((prev) => {
        const updated: Record<string, number> = {};
        for (const projectId in prev) {
          updated[projectId] = prev[projectId] - 1;
        }
        return updated;
      });
    }, 1000);

    setTimerId(id);
    return () => clearInterval(id);
  }, [isTimerActive]);

  const handleAddProject = () => {
    if (!projectName.trim()) return;
    const projectId = Date.now().toString();
    const newProject: Project = { id: projectId, name: projectName };
    const initialTime = SESSION_DURATIONS[sessionType];
    setProjects((prev) => [...prev, newProject]);
    setProjectTimes((prev) => ({ ...prev, [projectId]: initialTime }));
    setProjectRemainingTimes((prev) => ({ ...prev, [projectId]: initialTime }));
    setProjectName("");
  };

  const handlePause = () => {
    if (timerId !== null) clearInterval(timerId);
    setIsTimerActive(false);
  };

  const handleSessionChange = (type: SessionType) => {
    setSessionType(type);
    const newTotalSeconds = SESSION_DURATIONS[type];
    setTotalSeconds(newTotalSeconds);
    setMaxSeconds(newTotalSeconds);
    if (isTimerActive) handlePause();
  };

  const handleStart = () => setIsTimerActive(true);

  const handleReset = () => {
    if (timerId !== null) clearInterval(timerId);
    setTimerId(null);
    setIsTimerActive(false);
    setTotalSeconds(maxSeconds);
  };

  const handleUpdateTime = () => {
    const newTotalSeconds = parseInt(editTime, 10) * 60;
    if (!isNaN(newTotalSeconds) && newTotalSeconds > 0) {
      setTotalSeconds(newTotalSeconds);
      setMaxSeconds(newTotalSeconds);
      setProjectRemainingTimes((prev) => {
        const updated: Record<string, number> = {};
        for (const id in prev) {
          updated[id] = newTotalSeconds;
        }
        return updated;
      });
    }
    setIsEditing(false);
    setEditTime("");
  };

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const editButtonText = isEditing ? "Cancel Edit" : "Edit Time";

  const circumference = 2 * Math.PI * TIMER_RADIUS;
  const strokeDashoffset = (totalSeconds / maxSeconds) * circumference;

  return {
    totalSeconds,
    setTotalSeconds,
    maxSeconds,
    setMaxSeconds,
    timerId,
    setTimerId,
    isTimerActive,
    setIsTimerActive,
    isEditing,
    setIsEditing,
    editTime,
    setEditTime,
    sessionType,
    setSessionType,
    projectName,
    setProjectName,
    projects,
    setProjects,
    projectTimes,
    setProjectTimes,
    projectRemainingTimes,
    setProjectRemainingTimes,
    handleAddProject,
    handleSessionChange,
    handleStart,
    handlePause,
    handleReset,
    handleUpdateTime,
    toggleEdit,
    editButtonText,
    sessionDurations: SESSION_DURATIONS,
    radius: TIMER_RADIUS,
    circumference,
    strokeDashoffset,
    currentArticleIndex,
  };
}
