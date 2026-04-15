import type {
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
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
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <label
        className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7d929c]"
        htmlFor="edit-habit-name"
      >
        Habit name
      </label>
      <Input
        className="h-12 rounded-[1rem] border-white/80 bg-white/90"
        error={error}
        id="edit-habit-name"
        type="text"
        {...register("name")}
      />
      <div className="flex gap-2">
        <Button className="h-11 flex-1 rounded-[1rem]" size="sm" type="submit">
          Save
        </Button>
        <Button
          className="h-11 flex-1 rounded-[1rem]"
          onClick={cancelEdit}
          size="sm"
          type="button"
          variant="ghost"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function HabitProgress({ value }: { value: number }) {
  return (
    <ProgressBar
      className="h-full rounded-[1.5rem] border border-white/80 bg-white/75 p-4 lg:min-h-[110px]"
      label="Progress"
      value={value}
    />
  );
}
