import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHabits } from "../../context/HabitContext";
import { makeHabitSchema, type HabitFormValues, } from "../../lib/habitSchema";
import { Button, Input } from "../ui";
export default function WelcomeBanner() {
    const { habits, addHabit } = useHabits();
    const { register, handleSubmit, reset, formState: { errors }, } = useForm<HabitFormValues>({
        resolver: zodResolver(makeHabitSchema(habits.map((habit) => habit.name))),
        defaultValues: { name: "" },
    });
    const onSubmit = (values: HabitFormValues) => {
        addHabit(values.name);
        reset();
    };
    return (<div>
      <div>
        <div>
          <div>Habits</div>
          <p>
            Quick add
          </p>
        </div>
        <p>{habits.length}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input error={errors.name?.message} id="new-habit-name" placeholder="Habit name" type="text" {...register("name")}/>
        </div>
        <Button type="submit">
          Add habit
        </Button>
      </form>
    </div>);
}
