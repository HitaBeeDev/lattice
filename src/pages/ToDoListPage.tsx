import ToDoListAndWelcomeSection from "../components/tasks/ToDoListAndWelcomeSection";
import UpcomingTasks from "../components/tasks/UpcomingTasks";
function ToDoListPage() {
    return (<main id="main-content" tabIndex={-1}>
      <ToDoListAndWelcomeSection />
      <UpcomingTasks />
    </main>);
}
export default ToDoListPage;
