import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HabitProvider } from "./context/HabitContext";
import { TaskProvider } from "./context/TasksContext";
import { TimeTrackerProvider } from "./context/TimeTrackerContext";
import { migrateLocalStorageData } from "./db/database";

type AppProps = {
  children: React.ReactNode;
};

const routeTitles: Record<string, string> = {
  "/": "Dashboard — NexStep",
  "/dashboard": "Dashboard — NexStep",
  "/habit-tracker": "Habit Tracker — NexStep",
  "/tasks": "Tasks — NexStep",
  "/pomodoro": "Pomodoro — NexStep",
};

function App({ children }: AppProps): JSX.Element {
  const location = useLocation();

  useEffect(() => {
    void migrateLocalStorageData();
  }, []);

  useEffect(() => {
    document.title = routeTitles[location.pathname] ?? "NexStep";
  }, [location.pathname]);

  return (
    <HabitProvider>
      <TaskProvider>
        <TimeTrackerProvider>{children}</TimeTrackerProvider>
      </TaskProvider>
    </HabitProvider>
  );
}

export default App;
