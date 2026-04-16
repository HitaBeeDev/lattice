import { useTasks } from "../../context/TasksContext";
import AddModal from "./AddModal";
import TaskList from "./TaskList";
import WelcomeBanner from "./WelcomeBanner";

function ToDoListAndWelcomeSection() {
  const { showModal, isEditing } = useTasks();

  return (
    <section
      aria-labelledby="task-overview-heading"
      className="space-y-6"
    >
      <header className="sr-only">
        <h2 id="task-overview-heading">Task overview</h2>
      </header>

      <WelcomeBanner />

      {showModal && isEditing && <AddModal />}

      <TaskList />
    </section>
  );
}

export default ToDoListAndWelcomeSection;
