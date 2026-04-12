import { useTasks } from "../../context/TasksContext";
import { Button } from "../ui";

function WelcomeBanner() {
  const { handleAddButtonClick } = useTasks();

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-slate-900 px-6 py-8 text-white lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <p className="text-2xl font-semibold">
          Hello there!
        </p>
        <p className="max-w-xl text-sm leading-6 text-slate-200">
          Excited to have you! Here&apos;s a checklist to get you started smoothly:
        </p>
      </div>

      <div>
        <Button
          className="bg-white text-slate-900 hover:bg-slate-100"
          onClick={handleAddButtonClick}
          variant="secondary"
        >
          Add Task
        </Button>
      </div>
    </div>
  );
}

export default WelcomeBanner;
