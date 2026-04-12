import { Plus } from "lucide-react";
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
    <header className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{greeting}</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Here is your daily productivity summary for {formattedDate}.
        </p>
      </div>

      <Button onClick={onAddTask} type="button">
        <Plus aria-hidden="true" className="-ml-0.5 h-4 w-4" strokeWidth={2.5} />
        Add Task
      </Button>
    </header>
  );
}
