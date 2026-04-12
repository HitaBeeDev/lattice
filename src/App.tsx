import { useEffect } from "react";
import { HabitProvider } from "./context/HabitContext";
import { TaskProvider } from "./context/TasksContext";
import { TimeTrackerProvider } from "./context/TimeTrackerContext";
import { migrateLocalStorageData } from "./db/database";

type AppProps = {
  children: React.ReactNode;
};

function App({ children }: AppProps): JSX.Element {
  useEffect(() => {
    void migrateLocalStorageData();
  }, []);

  return (
    <HabitProvider>
      <TaskProvider>
        <TimeTrackerProvider>{children}</TimeTrackerProvider>
      </TaskProvider>
    </HabitProvider>);

}

export default App;
