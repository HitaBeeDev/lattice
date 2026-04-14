import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HabitProvider } from "./context/HabitContext";
import { TaskProvider } from "./context/TasksContext";
import { TimeTrackerProvider } from "./context/TimeTrackerContext";
import { migrateLocalStorageData, seedMockData } from "./db/database";

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
    void migrateLocalStorageData().then(() => seedMockData());
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
