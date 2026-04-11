import ToDoListAndWelcomeSection from "../components/ToDoListSection/ToDoListAndWelcomeSection";
import UpcomingTasks from "../components/ToDoListSection/UpcomingTasks";

function ToDoListPage() {
  return (
    <div>
      <ToDoListAndWelcomeSection />
      <UpcomingTasks />
    </div>
  );
}

export default ToDoListPage;
