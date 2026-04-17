import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { makeHabitSchema, type HabitFormValues } from "../../lib/habitSchema";
import { Button, Input } from "../ui";

type HabitInlineEditFormProps = {
  habitName: string;
  habitFrequency: string;
  allHabitNames: string[];
  habitId: string;
  onSave: (habitId: string, name: string) => void;
  onCancel: () => void;
};

export default function HabitInlineEditForm({
  habitName,
  habitFrequency,
  allHabitNames,
  habitId,
  onSave,
  onCancel,
}: HabitInlineEditFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HabitFormValues>({
    resolver: zodResolver(makeHabitSchema(allHabitNames, habitName)),
    defaultValues: { name: habitName, frequency: habitFrequency as HabitFormValues["frequency"] },
  });

  // Sync form defaults when the habit being edited changes.
  useEffect(() => {
    reset({ name: habitName, frequency: habitFrequency as HabitFormValues["frequency"] });
  }, [habitName, habitFrequency, reset]);

  return (
    <form
      onSubmit={handleSubmit((values) => onSave(habitId, values.name))}
      className="flex w-full flex-col items-start gap-2 md:flex-row md:gap-1.5"
    >
      <Input
        className="h-[2rem] w-full text-[0.75rem] rounded-[0.4rem] border-[#e0e9ed]"
        error={errors.name?.message}
        id={`edit-habit-${habitId}`}
        type="text"
        {...register("name")}
      />
      <Button type="submit" size="sm" className="h-[2rem] shrink-0 px-3 text-[0.65rem]">
        Save
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-[2rem] shrink-0 px-3 text-[0.65rem]"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </form>
  );
}
