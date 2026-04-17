import type { FieldError, UseFormRegister } from "react-hook-form";
import { Input } from "../ui";
import type { TaskFormValues } from "../../lib/taskSchema";

type TaskDateTimeFieldsProps = {
  register: UseFormRegister<TaskFormValues>;
  errors: {
    date?: FieldError;
    startTime?: FieldError;
  };
};

export default function TaskDateTimeFields({ register, errors }: TaskDateTimeFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <div>
        <label className="text-[0.6rem] font-[500] text-[#d3d6d9] mb-1.5 block" htmlFor="new-task-date">
          Date
        </label>
        <Input
          className="rounded-[0.5rem] h-[2.5rem] text-[0.8rem] border border-[#e0e9ed]"
          error={errors.date?.message}
          id="new-task-date"
          type="date"
          {...register("date")}
        />
      </div>
      <div>
        <label className="text-[0.6rem] font-[500] text-[#d3d6d9] mb-1.5 block" htmlFor="new-task-start-time">
          Start time
        </label>
        <Input
          className="rounded-[0.5rem] h-[2.5rem] text-[0.8rem] border border-[#e0e9ed]"
          error={errors.startTime?.message}
          id="new-task-start-time"
          type="time"
          {...register("startTime")}
        />
      </div>
    </div>
  );
}
