import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHabits } from "../../context/HabitContext";
import {
  makeHabitSchema,
  type HabitFormValues,
} from "../../lib/habitSchema";

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
    <div>
      <div>
        <p>Welcome to the journey of building new habits!</p>
        <p>Let's embark on this exciting adventure together!</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="text"
            placeholder="Add a new habit..."
            {...register("name")}
          />
          <button type="submit">Add Habit</button>
        </div>
        {errors.name && <p>{errors.name.message}</p>}
      </form>
    </div>
  );
}
