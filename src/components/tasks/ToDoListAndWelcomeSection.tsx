import { useTasks } from "../../context/TasksContext";
import AddModal from "./AddModal";
import ToDoList from "./ToDoList";
import WelcomeBanner from "./WelcomeBanner";

function ToDoListAndWelcomeSection() {
  const { showModal } = useTasks();

  return (
    <section
      aria-labelledby="task-overview-heading"
      className="space-y-6"
    >
      <header className="sr-only">
        <h2 id="task-overview-heading">Task overview</h2>
      </header>

      <WelcomeBanner />

      {showModal && <AddModal />}

      <ToDoList />
    </section>
  );
}

export default ToDoListAndWelcomeSection;
