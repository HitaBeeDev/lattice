import type { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import type { HabitFormValues } from "../../lib/habitSchema";
import { Button, Input, ProgressBar } from "../ui";

type HabitNameEditorProps = {
  cancelEdit: () => void;
  error?: string;
  handleSubmit: UseFormHandleSubmit<HabitFormValues>;
  onSubmit: (values: HabitFormValues) => void;
  register: UseFormRegister<HabitFormValues>;
};

export function HabitNameEditor({
  cancelEdit,
  error,
  handleSubmit,
  onSubmit,
  register,
}: HabitNameEditorProps) {
  return (
    <form className="flex flex-wrap items-start gap-2" onSubmit={handleSubmit(onSubmit)}>
      <label className="sr-only" htmlFor="edit-habit-name">
        Habit name
      </label>
      <Input
        className="w-full min-w-0 sm:min-w-60"
        error={error}
        id="edit-habit-name"
        type="text"
        {...register("name")}
      />
      <Button size="sm" type="submit">
        Save
      </Button>
      <Button
        onClick={cancelEdit}
        size="sm"
        type="button"
        variant="ghost"
      >
        Cancel
      </Button>
    </form>
  );
}

export function HabitProgress({ value }: { value: number }) {
  return <ProgressBar className="w-full sm:w-40" value={value} />;
}
