import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import articles from "../components/pomodoro/articles";
import type { TimerAnalytics, TimerSessionHistoryEntry } from "../types/pomodoro";
import { mockTimerAnalytics } from "../lib/mockData";
import usePersistentState from "./usePersistentState";
import { useRandomIndex } from "./useRandomIndex";

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

export interface TimeTrackerContextValue {
  totalSeconds: number;
  maxSeconds: number;
  isTimerActive: boolean;
  isEditing: boolean;
  sessionType: SessionType;
  projectName: string;
  projects: Project[];
  projectTimes: Record<string, number>;
  projectRemainingTimes: Record<string, number>;
  handleAddProject: () => void;
  handleSessionChange: (type: SessionType) => void;
  handleStart: () => void;
  handlePause: () => void;
  handleComplete: () => void;
  handleReset: () => void;
  handleUpdateTime: (minutes: number) => void;
  toggleEdit: () => void;
  editButtonText: string;
  sessionHistory: TimerSessionHistoryEntry[];
  completedPomodoros: number;
  shortBreakCount: number;
  longBreakCount: number;
  todayFocusSeconds: number;
  dailyFocusSeconds: Record<string, number>;
  sessionDurations: Record<SessionType, number>;
  currentArticleIndex: number;
}

const SESSION_DURATIONS: Record<SessionType, number> = {
  Pomodoro: 25 * 60,
  ShortBreak: 15 * 60,
  LongBreak: 30 * 60,
};

const INITIAL_TOTAL_SECONDS = SESSION_DURATIONS.Pomodoro;
const TIMER_STATE_STORAGE_KEY = "timer-session-state";
// Bumped to v3 to reseed dashboard focus analytics with non-zero mock values.
const TIMER_ANALYTICS_STORAGE_KEY = "timer-session-analytics-v3";

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

/** Returns a local-timezone ISO date string (YYYY-MM-DD) — consistent with the rest of the app. */
const getTodayKey = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getRemainingSeconds = (
  runStartedAt: string,
  runStartedRemainingSeconds: number,
  now: number = Date.now()
): number => {
  const elapsedSeconds = Math.floor((now - new Date(runStartedAt).getTime()) / 1000);
  return Math.max(runStartedRemainingSeconds - elapsedSeconds, 0);
};

export function useTimer(): TimeTrackerContextValue {
  const [timerState, setTimerState] = usePersistentState<PersistedTimerState>(
    TIMER_STATE_STORAGE_KEY,
    createInitialTimerState()
  );
  const [analytics, setAnalytics] = usePersistentState<TimerAnalytics>(
    TIMER_ANALYTICS_STORAGE_KEY,
    mockTimerAnalytics
  );
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const currentArticleIndex = useRandomIndex(articles.length);

  // On mount: if the timer was not running when the page was last closed,
  // restore it to the session type's default duration instead of the stale persisted value.
  useEffect(() => {
    setTimerState((prev) => {
      if (prev.isTimerActive) {
        return prev;
      }
      const defaultSeconds = SESSION_DURATIONS[prev.sessionType];
      return {
        ...prev,
        totalSeconds: defaultSeconds,
        maxSeconds: defaultSeconds,
        runStartedAt: null,
        runStartedRemainingSeconds: null,
      };
    });
  }, [setTimerState]);

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
    (completedSessionType: SessionType, durationSeconds: number, completedAt: string): void => {
      setAnalytics((previousAnalytics) => {
        const historyEntry: TimerSessionHistoryEntry = {
          id: `session-${completedAt}-${Math.floor(Math.random() * 10000)}`,
          sessionType: completedSessionType,
          durationSeconds,
          completedAt,
        };
        const dateKey = getTodayKey(new Date(completedAt));
        const nextDailyFocusSeconds = { ...previousAnalytics.dailyFocusSeconds };

        if (completedSessionType === "Pomodoro") {
          nextDailyFocusSeconds[dateKey] =
            (nextDailyFocusSeconds[dateKey] ?? 0) + durationSeconds;
        }

        return {
          sessionHistory: [historyEntry, ...previousAnalytics.sessionHistory],
          dailyFocusSeconds: nextDailyFocusSeconds,
          completedPomodoros:
            previousAnalytics.completedPomodoros +
            (completedSessionType === "Pomodoro" ? 1 : 0),
          shortBreakCount:
            previousAnalytics.shortBreakCount +
            (completedSessionType === "ShortBreak" ? 1 : 0),
          longBreakCount:
            previousAnalytics.longBreakCount +
            (completedSessionType === "LongBreak" ? 1 : 0),
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
    ): void => {
      if (timerIntervalRef.current !== null) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      setTimerState((previousState) => ({
        ...previousState,
        totalSeconds: 0,
        isTimerActive: false,
        runStartedAt: null,
        runStartedRemainingSeconds: null,
        projectRemainingTimes: buildProjectRemainingTimes(
          previousState.projectRemainingTimes,
          0
        ),
      }));
      recordCompletedSession(completedSessionType, durationSeconds, completedAt);
    },
    [recordCompletedSession, setTimerState]
  );

  useEffect((): (() => void) | void => {
    if (!isTimerActive || !runStartedAt || runStartedRemainingSeconds === null) {
      return;
    }

    const syncTimer = (): void => {
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

      setTimerState((previousState) => ({
        ...previousState,
        totalSeconds: remainingSeconds,
        projectRemainingTimes: buildProjectRemainingTimes(
          previousState.projectRemainingTimes,
          remainingSeconds
        ),
      }));
    };

    syncTimer();
    const intervalId = setInterval(syncTimer, 1000);
    timerIntervalRef.current = intervalId;

    return (): void => {
      clearInterval(intervalId);
      timerIntervalRef.current = null;
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

  const handleAddProject = useCallback((): void => {
    if (!projectName.trim()) {
      return;
    }

    const projectId = Date.now().toString();
    const newProject: Project = { id: projectId, name: projectName };
    const initialTime = SESSION_DURATIONS[sessionType];

    setTimerState((previousState) => ({
      ...previousState,
      projects: [...previousState.projects, newProject],
      projectTimes: { ...previousState.projectTimes, [projectId]: initialTime },
      projectRemainingTimes: {
        ...previousState.projectRemainingTimes,
        [projectId]: initialTime,
      },
      projectName: "",
    }));
  }, [projectName, sessionType, setTimerState]);

  const handlePause = useCallback((): void => {
    if (timerIntervalRef.current !== null) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setTimerState((previousState) => {
      if (
        !previousState.isTimerActive ||
        !previousState.runStartedAt ||
        previousState.runStartedRemainingSeconds === null
      ) {
        return {
          ...previousState,
          isTimerActive: false,
          runStartedAt: null,
          runStartedRemainingSeconds: null,
        };
      }

      const remainingSeconds = getRemainingSeconds(
        previousState.runStartedAt,
        previousState.runStartedRemainingSeconds
      );

      return {
        ...previousState,
        totalSeconds: remainingSeconds,
        isTimerActive: false,
        runStartedAt: null,
        runStartedRemainingSeconds: null,
        projectRemainingTimes: buildProjectRemainingTimes(
          previousState.projectRemainingTimes,
          remainingSeconds
        ),
      };
    });
  }, [setTimerState]);

  const handleSessionChange = useCallback((type: SessionType): void => {
    const newTotalSeconds = SESSION_DURATIONS[type];

    if (timerIntervalRef.current !== null) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setTimerState((previousState) => ({
      ...previousState,
      sessionType: type,
      totalSeconds: newTotalSeconds,
      maxSeconds: newTotalSeconds,
      isTimerActive: false,
      runStartedAt: null,
      runStartedRemainingSeconds: null,
      projectRemainingTimes: buildProjectRemainingTimes(
        previousState.projectRemainingTimes,
        newTotalSeconds
      ),
    }));
  }, [setTimerState]);

  const handleComplete = useCallback((): void => {
    if (totalSeconds <= 0) {
      return;
    }

    // Record only the time actually elapsed, then reset so the timer is ready
    // for the next session without needing a manual reset click.
    const elapsedSeconds = maxSeconds - totalSeconds;
    completeCurrentSession(sessionType, elapsedSeconds, new Date().toISOString());
    setTimerState((previousState) => ({
      ...previousState,
      totalSeconds: previousState.maxSeconds,
      isTimerActive: false,
      runStartedAt: null,
      runStartedRemainingSeconds: null,
    }));
  }, [completeCurrentSession, maxSeconds, sessionType, setTimerState, totalSeconds]);

  const handleStart = useCallback((): void => {
    setTimerState((previousState) => {
      if (previousState.isTimerActive) {
        return previousState;
      }

      const remainingSeconds =
        previousState.totalSeconds > 0
          ? previousState.totalSeconds
          : previousState.maxSeconds;

      return {
        ...previousState,
        totalSeconds: remainingSeconds,
        isTimerActive: true,
        runStartedAt: new Date().toISOString(),
        runStartedRemainingSeconds: remainingSeconds,
      };
    });
  }, [setTimerState]);

  const handleReset = useCallback((): void => {
    if (timerIntervalRef.current !== null) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setTimerState((previousState) => {
      const defaultSeconds = SESSION_DURATIONS[previousState.sessionType];
      return {
        ...previousState,
        totalSeconds: defaultSeconds,
        maxSeconds: defaultSeconds,
        isTimerActive: false,
        runStartedAt: null,
        runStartedRemainingSeconds: null,
        projectRemainingTimes: buildProjectRemainingTimes(
          previousState.projectRemainingTimes,
          defaultSeconds
        ),
      };
    });
  }, [setTimerState]);

  const handleUpdateTime = useCallback((minutes: number): void => {
    const newTotalSeconds = minutes * 60;

    if (timerIntervalRef.current !== null) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setTimerState((previousState) => ({
      ...previousState,
      totalSeconds: newTotalSeconds,
      maxSeconds: newTotalSeconds,
      isTimerActive: false,
      runStartedAt: null,
      runStartedRemainingSeconds: null,
      projectRemainingTimes: buildProjectRemainingTimes(
        previousState.projectRemainingTimes,
        newTotalSeconds
      ),
    }));
    setIsEditing(false);
  }, [setTimerState]);

  const toggleEdit = useCallback((): void => {
    setIsEditing((previousState) => !previousState);
  }, []);

  const editButtonText = isEditing ? "Cancel Edit" : "Edit Time";
  const todayFocusSeconds = analytics.dailyFocusSeconds[getTodayKey()] ?? 0;

  return useMemo<TimeTrackerContextValue>(
    () => ({
      totalSeconds,
      maxSeconds,
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
      handleComplete,
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
      currentArticleIndex,
    }),
    [
      analytics.completedPomodoros,
      analytics.dailyFocusSeconds,
      analytics.longBreakCount,
      analytics.sessionHistory,
      analytics.shortBreakCount,
      currentArticleIndex,
      editButtonText,
      handleAddProject,
      handleComplete,
      handlePause,
      handleReset,
      handleSessionChange,
      handleStart,
      handleUpdateTime,
      isEditing,
      isTimerActive,
      maxSeconds,
      projectName,
      projectRemainingTimes,
      projectTimes,
      projects,
      sessionType,
      todayFocusSeconds,
      toggleEdit,
      totalSeconds,
    ]
  );
}
