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
    <div className="px-6 py-5 space-y-4">
      <TaskInputField
        autoFocus
        error={errors.name}
        id="name"
        label="Task"
        placeholder="What needs to get done?"
        register={register}
        type="text"
      />

      <div className="grid grid-cols-2 gap-3">
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
          label="Start time"
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
        placeholder="Optional details"
        register={register}
        type="text"
      />
    </div>
  );
}
