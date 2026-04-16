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

      <section className="grid h-full grid-cols-5 gap-3">
        <div className="col-span-3 bg-white rounded-[1.7rem]">
          <TaskList />
        </div>

        <div className="col-span-2 bg-white rounded-[1.7rem]">
          <UpcomingTasks />
        </div>
      </section>

      {/* <section
        aria-labelledby="tasks-layout-heading"
        className="grid gap-6 lg:grid-cols-[minmax(0,1.9fr)_minmax(21rem,0.95fr)]"
      >
        <header className="sr-only">
          <h2 id="tasks-layout-heading">Tasks and upcoming schedule</h2>
        </header>

        <div className="min-w-0">
          <TaskList />
        </div>

        <div className="min-w-0">
          <UpcomingTasks />
        </div>
      </section> */}
    </main>
  );
}

export default TaskListPage;
