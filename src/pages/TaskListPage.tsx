import AddModal from "../components/tasks/AddModal";
import TaskList from "../components/tasks/TaskList";
import UpcomingTasks from "../components/tasks/UpcomingTasks";
import WelcomeBanner from "../components/tasks/WelcomeBanner";
import { useTasks } from "../context/TasksContext";

function TaskListPage() {
  const { showModal, isEditing } = useTasks();

  return (
    <main
      className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 pb-8"
      id="main-content"
      tabIndex={-1}
    >
      <WelcomeBanner />

      {showModal && isEditing && <AddModal />}

      <section className="grid h-full grid-cols-1 gap-3 lg:grid-cols-5">
        <div className="lg:col-span-3 bg-white rounded-[1.7rem]">
          <TaskList />
        </div>

        <div className="lg:col-span-2 bg-white rounded-[1.7rem] h-fit">
          <UpcomingTasks />
        </div>
      </section>
    </main>
  );
}

export default TaskListPage;
