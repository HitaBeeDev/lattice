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
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <div className="app-pill">Habits</div>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
            Quick add
          </p>
        </div>
        <p className="text-sm text-slate-500">{habits.length}</p>
      </div>

      <form className="flex flex-col gap-3 sm:flex-row sm:items-start" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-1">
          <Input
            error={errors.name?.message}
            id="new-habit-name"
            placeholder="Habit name"
            type="text"
            {...register("name")}
          />
        </div>
        <Button className="sm:min-w-[8.5rem]" type="submit">
          Add habit
        </Button>
      </form>
    </div>
  );
}
