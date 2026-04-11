
import { HabitProvider } from "./ContextAPI/HabitContext";
import { TaskProvider } from "./ContextAPI/TasksContext";
import { TimeTrackerProvider } from "./ContextAPI/TimeTrackerContext";

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
