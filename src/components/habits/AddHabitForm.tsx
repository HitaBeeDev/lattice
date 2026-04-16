import { useForm, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import {
  HABIT_STREAK_GOAL_MIN,
  HABIT_TARGET_MAX,
  HABIT_TARGET_MIN,
  makeHabitSchema,
  type HabitFormValues,
} from "../../lib/habitSchema";
import { Button, Input } from "../ui";
import type { Habit } from "../../types/habit";
import HabitFrequencySelector from "./HabitFrequencySelector";
import HabitCustomDayPicker from "./HabitCustomDayPicker";

type AddHabitFormProps = {
  habits: Habit[];
  onAdd: (values: HabitFormValues) => void;
};

export default function AddHabitForm({ habits, onAdd }: AddHabitFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<HabitFormValues>({
    resolver: zodResolver(makeHabitSchema(habits.map((habit) => habit.name))),
    defaultValues: {
      name: "",
      frequency: "daily",
      frequencyDays: [],
      targetPerWeek: undefined,
      streakGoal: undefined,
    },
  });

  const frequency = watch("frequency");

  const onSubmit = (values: HabitFormValues) => {
    onAdd(values);
    reset();
  };

  return (
    <form className="flex flex-col gap-3 mt-5" onSubmit={handleSubmit(onSubmit)}>
      <Input
        className="rounded-[0.5rem] h-[2.5rem] text-[0.8rem] leading-none font-[200] text-[#a0a6ab] border border-[#e0e9ed]"
        error={errors.name?.message}
        id="new-habit-name"
        placeholder="e.g. Morning run"
        type="text"
        {...register("name")}
      />

      <HabitFrequencySelector frequency={frequency} register={register} />

      {frequency === "custom" && (
        <HabitCustomDayPicker control={control} error={errors.frequencyDays as FieldError | undefined} />
      )}

      <div>
        <p className="text-[0.6rem] font-[500] text-[#d3d6d9] mb-1.5">Goal (times/week)</p>
        <Input
          className="rounded-[0.5rem] h-[2.5rem] text-[0.8rem] leading-none font-[200] text-[#a0a6ab] border border-[#e0e9ed]"
          error={errors.targetPerWeek?.message}
          id="target-per-week"
          placeholder="e.g. 3"
          type="number"
          min={HABIT_TARGET_MIN}
          max={HABIT_TARGET_MAX}
          {...register("targetPerWeek", {
            setValueAs: (v) => (v === "" ? undefined : Number(v)),
          })}
        />
      </div>

      <div>
        <p className="text-[0.6rem] font-[500] text-[#d3d6d9] mb-1.5">Streak goal (days)</p>
        <Input
          className="rounded-[0.5rem] h-[2.5rem] text-[0.8rem] leading-none font-[200] text-[#a0a6ab] border border-[#e0e9ed]"
          error={errors.streakGoal?.message}
          id="streak-goal"
          placeholder="e.g. 30"
          type="number"
          min={HABIT_STREAK_GOAL_MIN}
          {...register("streakGoal", {
            setValueAs: (v) => (v === "" ? undefined : Number(v)),
          })}
        />
      </div>

      <Button type="submit" className="w-full rounded-[0.5rem] h-[2.5rem] text-[0.75rem] font-[200]">
        <Plus className="w-4 h-4" />
        <p className="text-[0.8rem] font-[400]">Add habit</p>
      </Button>
    </form>
  );
}
