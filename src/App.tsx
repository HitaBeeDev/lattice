
import { HabitProvider } from "./context/HabitContext";
import { TaskProvider } from "./context/TasksContext";
import { TimeTrackerProvider } from "./context/TimeTrackerContext";

type AppProps = {
  children: React.ReactNode;
};

function App({ children }: AppProps): JSX.Element {
  return (
    <HabitProvider>
      <TaskProvider>
        <TimeTrackerProvider>{children}</TimeTrackerProvider>
      </TaskProvider>
    </HabitProvider>);

}

export default App;
