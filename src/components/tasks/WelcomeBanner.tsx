import { Plus } from "lucide-react";
import { useTasks } from "../../context/TasksContext";

function WelcomeBanner() {
  const { handleAddButtonClick, sortedTasks, checkedTasks } = useTasks();

  const total = sortedTasks.reduce((acc, [, tasks]) => acc + tasks.length, 0);
  const done = checkedTasks.length;
  const open = Math.max(total - done, 0);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="flex items-center justify-between px-5 pt-2">
      <div>
        <p className="text-[0.65rem] font-[300] text-[#a0a5ab] uppercase tracking-widest">
          {today}
        </p>
        <h1 className="text-[2rem] leading-none font-[200] text-[#161c22] mt-2">
          Tasks
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 h-8 px-3 bg-white rounded-full shadow-sm">
            <span className="text-[0.6rem] text-[#a0a5ab]">Total</span>
            <span className="text-[0.8rem] font-[500] text-[#161c22]">
              {total}
            </span>
          </div>

          <div className="flex items-center gap-1.5 h-8 px-3 bg-white rounded-full shadow-sm">
            <span className="text-[0.6rem] text-[#a0a5ab]">Open</span>
            <span className="text-[0.8rem] font-[500] text-[#161c22]">
              {open}
            </span>
          </div>

          <div className="flex items-center gap-1.5 h-8 px-3 bg-white rounded-full shadow-sm">
            <span className="text-[0.6rem] text-[#a0a5ab]">Done</span>
            <span className="text-[0.8rem] font-[500] text-[#22c55e]">
              {done}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddButtonClick}
          className="flex items-center gap-2 h-9 px-4 bg-[#161c22] rounded-full text-white text-[0.75rem] font-[400] hover:bg-[#2a3340] transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Task
        </button>
      </div>
    </header>
  );
}

export default WelcomeBanner;
