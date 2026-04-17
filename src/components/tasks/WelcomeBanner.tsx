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
    <div className="mt-auto grid grid-cols-1 gap-3 md:grid-cols-3">
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
    <section className="mt-6 flex flex-col gap-3 xl:grid xl:h-full xl:grid-cols-5">
      <div className="flex min-h-[24rem] flex-col justify-start rounded-[1.7rem] bg-white p-6 md:min-h-[28rem] md:p-8 xl:col-span-3">
        <div>
          <p className="text-[0.7rem] leading-none font-[300] text-[#a0a5ab] ml-1">
            {getCurrentDate()}
          </p>
          <p className="mt-5 w-full text-[2.3rem] leading-none font-[200] text-[#161c22] md:w-10/12 md:text-[3.75rem]">
            Clear the board, one task at a time.
          </p>
          <p className="mt-3 w-full text-[0.7rem] leading-none font-[200] text-[#a0a6ab] md:w-1/2">
            Capture every deliverable, set a date, and move each item forward until the list runs
            dry.
          </p>
        </div>

        <TaskStatCards total={total} open={open} completedPercent={completedPercent} />
      </div>

      <div className="flex min-h-[24rem] flex-col justify-start rounded-[1.7rem] bg-white p-6 md:min-h-[28rem] md:p-8 xl:col-span-2">
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
