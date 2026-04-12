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
    <div className="rounded-3xl bg-white px-6 py-8 shadow-sm ring-1 ring-slate-200">
      <div className="space-y-2">
        <p className="text-2xl font-semibold text-slate-900">
          Welcome to the journey of building new habits!
        </p>
        <p className="text-sm leading-6 text-slate-600">
          Let&apos;s embark on this exciting adventure together!
        </p>
      </div>

      <form className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-start" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-1">
          <Input
            error={errors.name?.message}
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
