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
    <div>
      <TaskInputField
        error={errors.name}
        id="name"
        label="Let's Get Started on a New To-Do!"
        placeholder="ToDo name:"
        register={register}
        type="text"
      />
      <TaskInputField
        error={errors.description}
        id="description"
        label="Description of your to-do list:"
        placeholder="Enter Description"
        register={register}
        type="text"
      />
      <TaskInputField
        error={errors.date}
        id="date"
        label="When are you planning to handle this?"
        register={register}
        type="date"
      />
      <TaskInputField
        error={errors.startTime}
        id="startTime"
        label="When will you begin?"
        register={register}
        type="time"
      />
      <TaskInputField
        error={errors.endTime}
        id="endTime"
        label="When will you be done?"
        register={register}
        type="time"
      />
      <PrioritySelector
        error={errors.priority}
        register={register}
        selectedPriority={selectedPriority}
        setValue={setValue}
      />
    </div>
  );
}
