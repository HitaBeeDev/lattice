import { useTasks } from "../../context/TasksContext";
import AddModal from "./AddModal";
import WelcomeBanner from "./WelcomeBanner";
import ToDoList from "./ToDoList";

function ToDoListAndWelcomeSection() {
  const { showModal } = useTasks();

  return (
    <section aria-label="Task overview" className="space-y-6">
      <WelcomeBanner />

      {showModal && <AddModal />}

      <ToDoList />
    </section>);

}

export default ToDoListAndWelcomeSection;
