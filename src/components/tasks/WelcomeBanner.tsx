import { ArrowUpRight, Plus, Rows3 } from "lucide-react";
import { useTasks } from "../../context/TasksContext";
import { Button } from "../ui";

function WelcomeBanner() {
  const { handleAddButtonClick, sortedTasks, checkedTasks } = useTasks();
  const openTasks = Math.max(sortedTasks.length - checkedTasks.length, 0);

  return (
    <header className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.7fr)]">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(249,252,252,0.92)_0%,rgba(235,246,247,0.94)_48%,rgba(194,243,248,0.98)_100%)] p-7 shadow-[0_24px_70px_rgba(80,111,122,0.14)]">
        <div
          aria-hidden="true"
          className="absolute -right-14 top-0 h-48 w-48 rounded-full bg-white/35 blur-3xl"
        />

        <div className="relative flex h-full flex-col justify-between gap-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#161c22] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/85">
                <Rows3 className="h-4 w-4" />
                Task flow
              </div>
              <div className="space-y-3">
                <h1 className="max-w-[15ch] font-['Sora'] text-4xl font-[500] leading-tight text-[#101820] sm:text-[2.9rem]">
                  Keep the work in motion.
                </h1>
                <p className="max-w-[60ch] text-sm leading-6 text-[#4f6570] sm:text-base">
                  Capture the next deliverable, keep timing visible, and make
                  the board feel consistent in every direction.
                </p>
              </div>
            </div>

            <div className="hidden rounded-[1.75rem] border border-white/70 bg-white/55 p-4 shadow-[0_12px_28px_rgba(96,120,130,0.12)] sm:block">
              <ArrowUpRight className="h-7 w-7 text-[#161c22]" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/70 bg-white/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#7f949d]">
                Total tasks
              </p>
              <p className="mt-3 text-3xl font-[300] text-[#161c22]">
                {sortedTasks.length}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/70 bg-white/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#7f949d]">
                Open tasks
              </p>
              <p className="mt-3 text-3xl font-[300] text-[#161c22]">
                {openTasks}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/70 bg-[#161c22] p-4 text-white">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                Completed
              </p>
              <p className="mt-3 text-3xl font-[300] text-white">
                {checkedTasks.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-6 rounded-[2rem] border border-white/70 bg-[rgba(239,247,248,0.82)] p-6 shadow-[0_24px_70px_rgba(80,111,122,0.12)] backdrop-blur-xl">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c939d]">
            Quick action
          </p>
          <h2 className="font-['Sora'] text-[1.8rem] font-[500] leading-tight text-[#101820]">
            Add the next task
          </h2>
          <p className="text-sm leading-6 text-[#556b76]">
            Use the same spacing rhythm across the board so each card reads as
            part of one system.
          </p>
        </div>

        <Button
          className="h-14 w-full rounded-[1.2rem] text-base font-medium"
          onClick={handleAddButtonClick}
          variant="secondary"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>
    </header>
  );
}

export default WelcomeBanner;
