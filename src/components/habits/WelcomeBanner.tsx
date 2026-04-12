import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHabits } from "../../context/HabitContext";
import {
  makeHabitSchema,
  type HabitFormValues,
} from "../../lib/habitSchema";
import { Button, Input } from "../ui";

export default function WelcomeBanner() {
  const { habits, addHabit } = useHabits();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HabitFormValues>({
    resolver: zodResolver(makeHabitSchema(habits.map((habit) => habit.name))),
    defaultValues: { name: "" },
  });

  const onSubmit = (values: HabitFormValues) => {
    addHabit(values.name);
    reset();
  };

  return (
    <div className="app-card">
      <div className="space-y-3">
        <div className="app-pill">Habit system</div>
        <p className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">
          Build repeatable momentum.
        </p>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Keep the weekly grid simple, visible, and satisfying enough that checking in becomes automatic.
        </p>
      </div>

      <form className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-start" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="new-habit-name">
            Habit name
          </label>
          <Input
            error={errors.name?.message}
            id="new-habit-name"
            placeholder="Add a new habit..."
            type="text"
            {...register("name")}
          />
        </div>
        <Button type="submit">Add Habit</Button>
      </form>
    </div>
  );
}
