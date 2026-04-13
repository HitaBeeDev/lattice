import type { FieldError, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { PRIORITY_OPTIONS, type TaskFormValues } from "../../lib/taskSchema";
import { Button } from "../ui";
type PrioritySelectorProps = {
    error?: FieldError;
    register: UseFormRegister<TaskFormValues>;
    selectedPriority: TaskFormValues["priority"];
    setValue: UseFormSetValue<TaskFormValues>;
};
export default function PrioritySelector({ error, register, selectedPriority, setValue, }: PrioritySelectorProps) {
    return (<div>
      <p>Priority</p>
      <input type="hidden" {...register("priority")}/>
      <div>
        {PRIORITY_OPTIONS.map((priority) => (<Button key={priority} onClick={() => setValue("priority", priority, { shouldValidate: true })} aria-pressed={selectedPriority === priority} size="sm" type="button" variant={selectedPriority === priority ? "primary" : "secondary"}>
            {priority}
          </Button>))}
      </div>
      {error && <p>{error.message}</p>}
    </div>);
}
