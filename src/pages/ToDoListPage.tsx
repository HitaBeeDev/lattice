import { useEffect } from "react";
import ToDoListAndWelcomeSection from "../components/tasks/ToDoListAndWelcomeSection";
import UpcomingTasks from "../components/tasks/UpcomingTasks";

function ToDoListPage() {
  useEffect(() => {
    document.title = "Tasks - NexStep";
  }, []);

  return (
    <main className="space-y-8 p-5 sm:p-6 lg:p-8">
      <ToDoListAndWelcomeSection />
      <UpcomingTasks />
    </main>
  );
}

export default ToDoListPage;
