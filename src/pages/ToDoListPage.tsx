import ToDoListAndWelcomeSection from "../components/tasks/ToDoListAndWelcomeSection";
import UpcomingTasks from "../components/tasks/UpcomingTasks";

function ToDoListPage() {
  return (
    <main
      className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 pb-8"
      id="main-content"
      tabIndex={-1}
    >
      <ToDoListAndWelcomeSection />
      <UpcomingTasks />
    </main>
  );
}

export default ToDoListPage;
