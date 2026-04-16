import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HabitProvider } from "./context/HabitContext";
import { TaskProvider } from "./context/TasksContext";
import { TimeTrackerProvider } from "./context/TimeTrackerContext";
import { cancelIdleTask, scheduleIdleTask } from "./lib/scheduleIdleTask";

type AppProps = {
  children: React.ReactNode;
};

const routeTitles: Record<string, string> = {
  "/": "Dashboard — Lattice",
  "/dashboard": "Dashboard — Lattice",
  "/habit-tracker": "Habit Tracker — Lattice",
  "/tasks": "Tasks — Lattice",
  "/pomodoro": "Pomodoro — Lattice",
};

function App({ children }: AppProps): JSX.Element {
  const location = useLocation();

  useEffect(() => {
    let isCancelled = false;
    const idleHandle = scheduleIdleTask(() => {
      void import("./db/database").then(async ({ migrateLocalStorageData, seedMockData }) => {
        if (isCancelled) {
          return;
        }

        await migrateLocalStorageData();

        if (!isCancelled) {
          await seedMockData();
        }
      });
    }, 2000);

    return () => {
      isCancelled = true;
      cancelIdleTask(idleHandle);
    };
  }, []);

  useEffect(() => {
    const ANALYTICS_RESET_VERSION = "nexstep:analytics-reset:v2";
    const idleHandle = scheduleIdleTask(() => {
      if (localStorage.getItem(ANALYTICS_RESET_VERSION) === "true") {
        return;
      }

      localStorage.removeItem("timer-session-analytics");
      localStorage.removeItem("timer-session-analytics-v2");
      localStorage.removeItem("timer-session-analytics-v3");
      localStorage.setItem(ANALYTICS_RESET_VERSION, "true");
    }, 2500);

    return () => {
      cancelIdleTask(idleHandle);
    };
  }, []);

  useEffect(() => {
    const previousMargin = document.body.style.margin;
    document.body.style.margin = "0";

    return () => {
      document.body.style.margin = previousMargin;
    };
  }, []);

  useEffect(() => {
    document.title = routeTitles[location.pathname] ?? "Lattice";
  }, [location.pathname]);

  return (
    <HabitProvider>
      <TaskProvider>
        <TimeTrackerProvider>
          <div className="min-h-screen bg-[linear-gradient(135deg,#eef1f1_0%,#edf4f4_38%,#def3f6_72%,#8ee4f2_100%)] text-[#0a1929]">
            {children}
          </div>
        </TimeTrackerProvider>
      </TaskProvider>
    </HabitProvider>
  );
}

export default App;
