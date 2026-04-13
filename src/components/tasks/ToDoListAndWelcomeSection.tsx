import { useTasks } from "../../context/TasksContext";
import AddModal from "./AddModal";
import WelcomeBanner from "./WelcomeBanner";
import ToDoList from "./ToDoList";
function ToDoListAndWelcomeSection() {
    const { showModal } = useTasks();
    return (<section aria-labelledby="task-overview-heading">
      <header>
        <h2 id="task-overview-heading">Task overview</h2>
      </header>
      <WelcomeBanner />

      {showModal && <AddModal />}

      <ToDoList />
    </section>);
}
export default ToDoListAndWelcomeSection;
