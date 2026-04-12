import { useTasks } from "../../context/TasksContext";
import { Button } from "../ui";

function WelcomeBanner() {
  const { handleAddButtonClick } = useTasks();

  return (
    <header className="app-panel-dark relative overflow-hidden flex flex-col gap-4 px-6 py-8 lg:flex-row lg:items-center lg:justify-between">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(217,242,71,0.24),_transparent_24%)]"
      />
      <div className="relative space-y-3">
        <div className="app-pill border-white/10 bg-white/5 text-white/85">Task flow</div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          Keep the work in motion.
        </h1>
        <p className="max-w-xl text-sm leading-6 text-white/85">
          Capture the next deliverable, keep timing visible, and remove ambiguity from the day.
        </p>
      </div>

      <div className="relative">
        <Button
          className="bg-white text-slate-900 shadow-none hover:bg-white"
          onClick={handleAddButtonClick}
          variant="secondary"
        >
          Add Task
        </Button>
      </div>
    </header>
  );
}

export default WelcomeBanner;
