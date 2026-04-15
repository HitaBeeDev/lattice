import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { cn } from "../ui/cn";
import { useTasks } from "../../context/TasksContext";
import { taskSchema, type TaskFormValues, PRIORITY_OPTIONS } from "../../lib/taskSchema";
import { getEmptyTaskForm } from "../../hooks/useTasks";
import { Input } from "../ui";
import type { Priority } from "../../types/task";

const PRIORITY_COLORS: Record<Priority, string> = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#22c55e",
};

function WelcomeBanner() {
  const { handleTaskAddition, sortedTasks, checkedTasks, getCurrentDate } = useTasks();

  const total = sortedTasks.reduce((acc, [, tasks]) => acc + tasks.length, 0);
  const done = checkedTasks.length;
  const open = Math.max(total - done, 0);
  const completedPercent = total > 0 ? Math.round((done / total) * 100) : 0;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: getEmptyTaskForm(),
  });

  const selectedPriority = watch("priority");

  const onSubmit = (values: TaskFormValues) => {
    handleTaskAddition(values);
    reset(getEmptyTaskForm());
  };

  return (
    <section className="grid h-full grid-cols-5 gap-3 mt-6">
      {/* Left panel — tagline + stats */}
      <div className="col-span-3 p-8 bg-white rounded-[1.7rem] min-h-[28rem] flex flex-col justify-start">
        <div>
          <p className="text-[0.7rem] leading-none font-[300] text-[#a0a5ab] ml-1">
            {getCurrentDate()}
          </p>

          <p className="text-[3.75rem] leading-none font-[200] text-[#161c22] w-10/12 mt-5">
            Clear the board, one task at a time.
          </p>

          <p className="w-1/2 text-[0.7rem] leading-none font-[200] text-[#a0a6ab] mt-3">
            Capture every deliverable, set a date, and move each item forward
            until the list runs dry.
          </p>
        </div>

        <div className="flex flex-row items-center justify-between gap-3 mt-auto">
          {/* Total tasks */}
          <div className="flex flex-col justify-center items-start rounded-[1rem] bg-[#edfdfe] w-full h-[7rem] p-7">
            <p className="text-[0.6rem] leading-none font-[500] text-[#d3d6d9]">
              Total tasks
            </p>
            <p className="text-[2rem] leading-none font-[200] text-[#161c22] mt-3">
              {total}
            </p>
          </div>

          {/* Open tasks */}
          <div className="flex flex-col justify-center items-start rounded-[1rem] bg-[#161c22] w-full h-[7rem] p-7">
            <p className="text-[0.6rem] leading-none font-[500] text-[#d3d6d9]">
              Open tasks
            </p>
            <p className="text-[2rem] leading-none font-[200] text-[#f9fafb] mt-3">
              {open}
            </p>
          </div>

          {/* Completed % */}
          <div className="relative flex flex-col justify-center items-start rounded-[1rem] w-full h-[7rem] overflow-hidden p-7">
            <div
              className="absolute inset-y-0 left-0 bg-[#72e1ee]"
              style={{ width: `${completedPercent}%` }}
            />
            <div
              className="absolute inset-y-0 right-0 bg-[#edfdfe]"
              style={{
                width: `${100 - completedPercent}%`,
                backgroundImage:
                  "repeating-linear-gradient(135deg, #aceef5 0px, #aceef5 2px, transparent 2px, transparent 8px)",
              }}
            />
            <p className="relative z-10 text-[0.6rem] leading-none font-[400] text-[#6c90a4]">
              Completed
            </p>
            <p className="relative z-10 text-[2rem] leading-none font-[200] text-[#161c22] mt-3">
              {completedPercent}%
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — quick-add form */}
      <div className="col-span-2 p-8 bg-white rounded-[1.7rem] min-h-[28rem] flex flex-col justify-start">
        <div>
          <p className="text-[0.7rem] leading-none font-[300] text-[#a0a5ab] ml-1">
            Quick add
          </p>
          <p className="text-[1.4rem] leading-none font-[300] text-[#161c22] mt-5">
            Add a task for today
          </p>
        </div>

        <form className="flex flex-col gap-3 mt-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Task name */}
          <Input
            className="rounded-[0.5rem] h-[2.5rem] text-[0.8rem] border border-[#e0e9ed]"
            error={errors.name?.message}
            id="new-task-name"
            placeholder="e.g. Review pull request"
            type="text"
            {...register("name")}
          />

          {/* Date + time row */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[0.6rem] font-[500] text-[#d3d6d9] mb-1.5">Date</p>
              <Input
                className="rounded-[0.5rem] h-[2.5rem] text-[0.8rem] border border-[#e0e9ed]"
                error={errors.date?.message}
                id="new-task-date"
                type="date"
                {...register("date")}
              />
            </div>
            <div>
              <p className="text-[0.6rem] font-[500] text-[#d3d6d9] mb-1.5">Start time</p>
              <Input
                className="rounded-[0.5rem] h-[2.5rem] text-[0.8rem] border border-[#e0e9ed]"
                id="new-task-start-time"
                type="time"
                {...register("startTime")}
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <p className="text-[0.6rem] font-[500] text-[#d3d6d9] mb-1.5">Priority</p>
            <input type="hidden" {...register("priority")} />
            <div className="flex gap-1.5">
              {PRIORITY_OPTIONS.map((priority) => (
                <button
                  key={priority}
                  type="button"
                  aria-pressed={selectedPriority === priority}
                  onClick={() => setValue("priority", priority, { shouldValidate: true })}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 rounded-[0.5rem] border py-1.5 text-[0.65rem] font-[400] transition",
                    selectedPriority === priority
                      ? "border-[#161c22] bg-[#161c22] text-white"
                      : "border-[#e0e9ed] text-[#a0a6ab] hover:border-[#b0bec5]",
                  )}
                >
                  <div
                    className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: PRIORITY_COLORS[priority] }}
                  />
                  {priority}
                </button>
              ))}
            </div>
            {errors.priority && (
              <p className="text-[0.7rem] text-[#ef4444] mt-1">{errors.priority.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <p className="text-[0.6rem] font-[500] text-[#d3d6d9] mb-1.5">Notes</p>
            <Input
              className="rounded-[0.5rem] h-[2.5rem] text-[0.8rem] border border-[#e0e9ed]"
              id="new-task-description"
              placeholder="Optional"
              type="text"
              {...register("description")}
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-[0.5rem] h-[2.5rem] bg-[#161c22] text-white text-[0.8rem] font-[400] hover:bg-[#2a3340] transition mt-1"
          >
            <Plus className="w-4 h-4" />
            Add task
          </button>
        </form>
      </div>
    </section>
  );
}

export default WelcomeBanner;
