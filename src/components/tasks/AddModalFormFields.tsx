import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { TaskFormValues } from "../../lib/taskSchema";
import { TaskInputField } from "./AddModalFields";
import PrioritySelector from "./PrioritySelector";

type AddModalFormFieldsProps = {
  errors: FieldErrors<TaskFormValues>;
  register: UseFormRegister<TaskFormValues>;
  selectedPriority: TaskFormValues["priority"];
  setValue: UseFormSetValue<TaskFormValues>;
};

export default function AddModalFormFields({
  errors,
  register,
  selectedPriority,
  setValue,
}: AddModalFormFieldsProps) {
  return (
    <div className="space-y-5">
      <TaskInputField
        error={errors.name}
        id="name"
        autoFocus
        label="Task"
        placeholder="What needs to get done?"
        register={register}
        type="text"
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <TaskInputField
          error={errors.date}
          id="date"
          label="Date"
          register={register}
          type="date"
        />
        <TaskInputField
          error={errors.startTime}
          id="startTime"
          label="Start"
          register={register}
          type="time"
        />
      </div>
      <PrioritySelector
        error={errors.priority}
        register={register}
        selectedPriority={selectedPriority}
        setValue={setValue}
      />
      <TaskInputField
        error={errors.description}
        id="description"
        label="Notes"
        placeholder="Optional"
        register={register}
        type="text"
      />
    </div>
  );
}
