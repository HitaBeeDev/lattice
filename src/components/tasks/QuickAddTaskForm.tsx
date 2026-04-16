import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { taskSchema, type TaskFormValues } from "../../lib/taskSchema";
import { getEmptyTaskForm } from "../../hooks/useTasks";
import { Input } from "../ui";
import TaskDateTimeFields from "./TaskDateTimeFields";
import QuickAddPriorityPicker from "./QuickAddPriorityPicker";

type QuickAddTaskFormProps = {
  onAdd: (values: TaskFormValues) => void;
};

export default function QuickAddTaskForm({ onAdd }: QuickAddTaskFormProps) {
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
    onAdd(values);
    reset(getEmptyTaskForm());
  };

  return (
    <form className="flex flex-col gap-3 mt-5" onSubmit={handleSubmit(onSubmit)}>
      <Input
        className="rounded-[0.5rem] h-[2.5rem] text-[0.8rem] border border-[#e0e9ed]"
        error={errors.name?.message}
        id="new-task-name"
        placeholder="e.g. Review pull request"
        type="text"
        {...register("name")}
      />

      <TaskDateTimeFields register={register} errors={errors} />

      <input type="hidden" {...register("priority")} />
      <QuickAddPriorityPicker
        selectedPriority={selectedPriority}
        onSelect={(priority) => setValue("priority", priority, { shouldValidate: true })}
        error={errors.priority?.message}
      />

      <div>
        <p className="text-[0.6rem] font-[500] text-[#d3d6d9] mb-1.5">Notes</p>
        <Input
          className="rounded-[0.5rem] h-[2.5rem] text-[0.8rem] border border-[#e0e9ed]"
          error={errors.description?.message}
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
  );
}
