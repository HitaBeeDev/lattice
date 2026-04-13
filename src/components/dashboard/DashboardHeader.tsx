import { CalendarDays, Plus, Sparkles } from "lucide-react";
import { Button } from "../ui";

type DashboardHeaderProps = {
  formattedDate: string;
  greeting: string;
  onAddTask: () => void;
};

export default function DashboardHeader({
  formattedDate,
  greeting,
  onAddTask,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <div className="app-pill">
          <Sparkles aria-hidden="true" className="mr-2 h-3.5 w-3.5" />
          Dashboard
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            {greeting}
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">{formattedDate}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="hidden rounded-2xl border border-black/10 bg-white/65 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur sm:flex sm:items-center sm:gap-2">
          <CalendarDays aria-hidden="true" className="h-4 w-4" />
          {formattedDate}
        </div>
        <Button onClick={onAddTask} type="button">
          <Plus aria-hidden="true" className="-ml-0.5 h-4 w-4" strokeWidth={2.5} />
          Add Task
        </Button>
      </div>
    </header>
  );
}
