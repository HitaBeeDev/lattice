import { useCallback, useEffect, useMemo, useState } from "react";
import articles from "../components/pomodoro/articles";
import { useRandomIndex } from "./useRandomIndex";
import usePersistentState from "./usePersistentState";
import type { TimerAnalytics, TimerSessionHistoryEntry } from "../types/pomodoro";

export type SessionType = "Pomodoro" | "ShortBreak" | "LongBreak";

export interface Project {
  id: string;
  name: string;
}

interface PersistedTimerState {
  totalSeconds: number;
  maxSeconds: number;
  isTimerActive: boolean;
  sessionType: SessionType;
  projectName: string;
  projects: Project[];
  projectTimes: Record<string, number>;
  projectRemainingTimes: Record<string, number>;
  runStartedAt: string | null;
  runStartedRemainingSeconds: number | null;
}

const SESSION_DURATIONS: Record<SessionType, number> = {
  Pomodoro: 25 * 60,
  ShortBreak: 15 * 60,
  LongBreak: 30 * 60,
};

const INITIAL_TOTAL_SECONDS = SESSION_DURATIONS.Pomodoro;
const TIMER_RADIUS = 80;
const TIMER_STATE_STORAGE_KEY = "timer-session-state";
const TIMER_ANALYTICS_STORAGE_KEY = "timer-session-analytics";

const createInitialTimerState = (): PersistedTimerState => ({
  totalSeconds: INITIAL_TOTAL_SECONDS,
  maxSeconds: INITIAL_TOTAL_SECONDS,
  isTimerActive: false,
  sessionType: "Pomodoro",
  projectName: "",
  projects: [],
  projectTimes: {},
  projectRemainingTimes: {},
  runStartedAt: null,
  runStartedRemainingSeconds: null,
});

const EMPTY_ANALYTICS: TimerAnalytics = {
  sessionHistory: [],
  dailyFocusSeconds: {},
  completedPomodoros: 0,
  shortBreakCount: 0,
  longBreakCount: 0,
};

const buildProjectRemainingTimes = (
  projectRemainingTimes: Record<string, number>,
  remainingSeconds: number
): Record<string, number> =>
  Object.fromEntries(
    Object.keys(projectRemainingTimes).map((projectId) => [
      projectId,
      Math.max(remainingSeconds, 0),
    ])
  );

const getTodayKey = (date = new Date()): string => date.toISOString().slice(0, 10);

const getRemainingSeconds = (
  runStartedAt: string,
  runStartedRemainingSeconds: number,
  now = Date.now()
): number => {
  const elapsedSeconds = Math.floor((now - new Date(runStartedAt).getTime()) / 1000);
  return Math.max(runStartedRemainingSeconds - elapsedSeconds, 0);
};

export function useTimer() {
  const [timerState, setTimerState] = usePersistentState<PersistedTimerState>(
    TIMER_STATE_STORAGE_KEY,
    createInitialTimerState()
  );
  const [analytics, setAnalytics] = usePersistentState<TimerAnalytics>(
    TIMER_ANALYTICS_STORAGE_KEY,
    EMPTY_ANALYTICS
  );
  const [timerId, setTimerId] = useState<ReturnType<typeof setInterval> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const currentArticleIndex = useRandomIndex(articles.length);

  const {
    totalSeconds,
    maxSeconds,
    isTimerActive,
    sessionType,
    projectName,
    projects,
    projectTimes,
    projectRemainingTimes,
    runStartedAt,
    runStartedRemainingSeconds,
  } = timerState;

  const recordCompletedSession = useCallback(
    (completedSessionType: SessionType, durationSeconds: number, completedAt: string) => {
      setAnalytics((prev) => {
        const historyEntry: TimerSessionHistoryEntry = {
          id: `session-${completedAt}-${Math.floor(Math.random() * 10000)}`,
          sessionType: completedSessionType,
          durationSeconds,
          completedAt,
        };
        const dateKey = getTodayKey(new Date(completedAt));
        const nextDailyFocusSeconds = { ...prev.dailyFocusSeconds };

        if (completedSessionType === "Pomodoro") {
          nextDailyFocusSeconds[dateKey] =
            (nextDailyFocusSeconds[dateKey] ?? 0) + durationSeconds;
        }

        return {
          sessionHistory: [historyEntry, ...prev.sessionHistory],
          dailyFocusSeconds: nextDailyFocusSeconds,
          completedPomodoros:
            prev.completedPomodoros + (completedSessionType === "Pomodoro" ? 1 : 0),
          shortBreakCount:
            prev.shortBreakCount + (completedSessionType === "ShortBreak" ? 1 : 0),
          longBreakCount:
            prev.longBreakCount + (completedSessionType === "LongBreak" ? 1 : 0),
        };
      });
    },
    [setAnalytics]
  );

  const completeCurrentSession = useCallback(
    (
      completedSessionType: SessionType,
      durationSeconds: number,
      completedAt: string
    ) => {
      if (timerId !== null) {
        clearInterval(timerId);
      }

      setTimerId(null);
      setTimerState((prev) => ({
        ...prev,
        totalSeconds: 0,
        isTimerActive: false,
        runStartedAt: null,
        runStartedRemainingSeconds: null,
        projectRemainingTimes: buildProjectRemainingTimes(prev.projectRemainingTimes, 0),
      }));
      recordCompletedSession(completedSessionType, durationSeconds, completedAt);
    },
    [recordCompletedSession, timerId, setTimerState]
  );

  useEffect(() => {
    if (!isTimerActive || !runStartedAt || runStartedRemainingSeconds === null) {
      return;
    }

    const syncTimer = () => {
      const remainingSeconds = getRemainingSeconds(
        runStartedAt,
        runStartedRemainingSeconds
      );

      if (remainingSeconds <= 0) {
        const completedAt = new Date(
          new Date(runStartedAt).getTime() + runStartedRemainingSeconds * 1000
        ).toISOString();
        completeCurrentSession(sessionType, maxSeconds, completedAt);
        return;
      }

      setTimerState((prev) => ({
        ...prev,
        totalSeconds: remainingSeconds,
        projectRemainingTimes: buildProjectRemainingTimes(
          prev.projectRemainingTimes,
          remainingSeconds
        ),
      }));
    };

    syncTimer();
    const id = setInterval(syncTimer, 1000);
    setTimerId(id);

    return () => {
      clearInterval(id);
      setTimerId(null);
    };
  }, [
    completeCurrentSession,
    isTimerActive,
    maxSeconds,
    runStartedAt,
    runStartedRemainingSeconds,
    sessionType,
    setTimerState,
  ]);

  const handleAddProject = useCallback(() => {
    if (!projectName.trim()) return;
    const projectId = Date.now().toString();
    const newProject: Project = { id: projectId, name: projectName };
    const initialTime = SESSION_DURATIONS[sessionType];
    setTimerState((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
      projectTimes: { ...prev.projectTimes, [projectId]: initialTime },
      projectRemainingTimes: { ...prev.projectRemainingTimes, [projectId]: initialTime },
      projectName: "",
    }));
  }, [projectName, sessionType, setTimerState]);

  const handlePause = useCallback(() => {
    if (timerId !== null) {
      clearInterval(timerId);
    }

    setTimerId(null);
    setTimerState((prev) => {
      if (!prev.isTimerActive || !prev.runStartedAt || prev.runStartedRemainingSeconds === null) {
        return { ...prev, isTimerActive: false, runStartedAt: null, runStartedRemainingSeconds: null };
      }

      const remainingSeconds = getRemainingSeconds(
        prev.runStartedAt,
        prev.runStartedRemainingSeconds
      );

      return {
        ...prev,
        totalSeconds: remainingSeconds,
        isTimerActive: false,
        runStartedAt: null,
        runStartedRemainingSeconds: null,
        projectRemainingTimes: buildProjectRemainingTimes(
          prev.projectRemainingTimes,
          remainingSeconds
        ),
      };
    });
  }, [timerId, setTimerState]);

  const handleSessionChange = useCallback((type: SessionType) => {
    const newTotalSeconds = SESSION_DURATIONS[type];
    if (timerId !== null) {
      clearInterval(timerId);
    }

    setTimerId(null);
    setTimerState((prev) => ({
      ...prev,
      sessionType: type,
      totalSeconds: newTotalSeconds,
      maxSeconds: newTotalSeconds,
      isTimerActive: false,
      runStartedAt: null,
      runStartedRemainingSeconds: null,
      projectRemainingTimes: buildProjectRemainingTimes(
        prev.projectRemainingTimes,
        newTotalSeconds
      ),
    }));
  }, [setTimerState, timerId]);

  const handleStart = useCallback(() => {
    setTimerState((prev) => {
      if (prev.isTimerActive) {
        return prev;
      }

      const remainingSeconds = prev.totalSeconds > 0 ? prev.totalSeconds : prev.maxSeconds;

      return {
        ...prev,
        totalSeconds: remainingSeconds,
        isTimerActive: true,
        runStartedAt: new Date().toISOString(),
        runStartedRemainingSeconds: remainingSeconds,
      };
    });
  }, [setTimerState]);

  const handleReset = useCallback(() => {
    if (timerId !== null) {
      clearInterval(timerId);
    }

    setTimerId(null);
    setTimerState((prev) => ({
      ...prev,
      totalSeconds: prev.maxSeconds,
      isTimerActive: false,
      runStartedAt: null,
      runStartedRemainingSeconds: null,
      projectRemainingTimes: buildProjectRemainingTimes(
        prev.projectRemainingTimes,
        prev.maxSeconds
      ),
    }));
  }, [setTimerState, timerId]);

  const handleUpdateTime = useCallback((minutes: number) => {
    const newTotalSeconds = minutes * 60;
    if (timerId !== null) {
      clearInterval(timerId);
    }

    setTimerId(null);
    setTimerState((prev) => ({
      ...prev,
      totalSeconds: newTotalSeconds,
      maxSeconds: newTotalSeconds,
      isTimerActive: false,
      runStartedAt: null,
      runStartedRemainingSeconds: null,
      projectRemainingTimes: buildProjectRemainingTimes(
        prev.projectRemainingTimes,
        newTotalSeconds
      ),
    }));
    setIsEditing(false);
  }, [setTimerState, timerId]);

  const toggleEdit = useCallback(() => setIsEditing((prev) => !prev), []);

  const editButtonText = isEditing ? "Cancel Edit" : "Edit Time";

  const circumference = 2 * Math.PI * TIMER_RADIUS;
  const strokeDashoffset = (totalSeconds / maxSeconds) * circumference;
  const todayFocusSeconds = analytics.dailyFocusSeconds[getTodayKey()] ?? 0;

  return useMemo(
    () => ({
      totalSeconds,
      maxSeconds,
      timerId,
      isTimerActive,
      isEditing,
      sessionType,
      projectName,
      projects,
      projectTimes,
      projectRemainingTimes,
      handleAddProject,
      handleSessionChange,
      handleStart,
      handlePause,
      handleReset,
      handleUpdateTime,
      toggleEdit,
      editButtonText,
      sessionHistory: analytics.sessionHistory,
      completedPomodoros: analytics.completedPomodoros,
      shortBreakCount: analytics.shortBreakCount,
      longBreakCount: analytics.longBreakCount,
      todayFocusSeconds,
      dailyFocusSeconds: analytics.dailyFocusSeconds,
      sessionDurations: SESSION_DURATIONS,
      radius: TIMER_RADIUS,
      circumference,
      strokeDashoffset,
      currentArticleIndex,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      totalSeconds,
      maxSeconds,
      timerId,
      isTimerActive,
      isEditing,
      sessionType,
      projectName,
      projects,
      projectTimes,
      projectRemainingTimes,
      analytics,
      todayFocusSeconds,
    ]
  );
}
