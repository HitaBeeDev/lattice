import { useTasks } from "../../context/TasksContext";
import QuickAddTaskForm from "./QuickAddTaskForm";
import HatchFill from "../ui/HatchFill";

// ── Sub-components ──────────────────────────────────────────────────────────

type TaskStatCardsProps = {
  total: number;
  open: number;
  completedPercent: number;
};

function TaskStatCards({ total, open, completedPercent }: TaskStatCardsProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-3 mt-auto">
      <div className="flex flex-col justify-center items-start rounded-[1rem] bg-[#edfdfe] w-full h-[7rem] p-7">
        <p className="text-[0.6rem] leading-none font-[500] text-[#d3d6d9]">Total tasks</p>
        <p className="text-[2rem] leading-none font-[200] text-[#161c22] mt-3">{total}</p>
      </div>

      <div className="flex flex-col justify-center items-start rounded-[1rem] bg-[#161c22] w-full h-[7rem] p-7">
        <p className="text-[0.6rem] leading-none font-[500] text-[#d3d6d9]">Open tasks</p>
        <p className="text-[2rem] leading-none font-[200] text-[#f9fafb] mt-3">{open}</p>
      </div>

      <div className="relative flex flex-col justify-center items-start rounded-[1rem] w-full h-[7rem] overflow-hidden p-7">
        <HatchFill percentage={completedPercent} />
        <p className="relative z-10 text-[0.6rem] leading-none font-[400] text-[#6c90a4]">
          Completed
        </p>
        <p className="relative z-10 text-[2rem] leading-none font-[200] text-[#161c22] mt-3">
          {completedPercent}%
        </p>
      </div>
    </div>
  );
}

// ── Page-level banner ────────────────────────────────────────────────────────

function WelcomeBanner() {
  const { handleTaskAddition, sortedTasks, checkedTasks, getCurrentDate } = useTasks();

  const total = sortedTasks.reduce((acc, [, tasks]) => acc + tasks.length, 0);
  const done = checkedTasks.length;
  const open = Math.max(total - done, 0);
  const completedPercent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <section className="grid h-full grid-cols-5 gap-3 mt-6">
      <div className="col-span-3 p-8 bg-white rounded-[1.7rem] min-h-[28rem] flex flex-col justify-start">
        <div>
          <p className="text-[0.7rem] leading-none font-[300] text-[#a0a5ab] ml-1">
            {getCurrentDate()}
          </p>
          <p className="text-[3.75rem] leading-none font-[200] text-[#161c22] w-10/12 mt-5">
            Clear the board, one task at a time.
          </p>
          <p className="w-1/2 text-[0.7rem] leading-none font-[200] text-[#a0a6ab] mt-3">
            Capture every deliverable, set a date, and move each item forward until the list runs
            dry.
          </p>
        </div>

        <TaskStatCards total={total} open={open} completedPercent={completedPercent} />
      </div>

      <div className="col-span-2 p-8 bg-white rounded-[1.7rem] min-h-[28rem] flex flex-col justify-start">
        <div>
          <p className="text-[0.7rem] leading-none font-[300] text-[#a0a5ab] ml-1">Quick add</p>
          <p className="text-[1.4rem] leading-none font-[300] text-[#161c22] mt-5">
            Add a task for today
          </p>
        </div>
        <QuickAddTaskForm onAdd={handleTaskAddition} />
      </div>
    </section>
  );
}

export default WelcomeBanner;
