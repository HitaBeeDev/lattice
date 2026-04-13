import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { makeHabitSchema, type HabitFormValues, } from "../../lib/habitSchema";
import type { Habit } from "../../types/habit";
import { HabitNameEditor, HabitProgress } from "./HabitRowParts";
import { Button } from "../ui";
const DAYS_PER_WEEK = 7;
const PERCENTAGE_MULTIPLIER = 100;
interface HabitRowProps {
    editIndex: number;
    habit: Habit;
    habits: Habit[];
    index: number;
    startEdit: (index: number) => void;
    saveEdit: (index: number, name: string) => void;
    cancelEdit: () => void;
    deleteHabit: (index: number) => void;
    toggleDayMark: (habitIndex: number, dayIndex: number) => void;
    visibleWeekDates: Date[];
}
export default function HabitRow({ editIndex, habit, habits, index, startEdit, saveEdit, cancelEdit, deleteHabit, toggleDayMark, visibleWeekDates, }: HabitRowProps) {
    const isEditing = editIndex === index;
    const { register, handleSubmit, reset, formState: { errors }, } = useForm<HabitFormValues>({
        resolver: zodResolver(makeHabitSchema(habits.map((item) => item.name), habit.name)),
        defaultValues: { name: habit.name },
    });
    useEffect(() => {
        if (isEditing) {
            reset({ name: habit.name });
        }
    }, [habit.name, isEditing, reset]);
    const onSubmit = (values: HabitFormValues) => saveEdit(index, values.name);
    const progressValue = Math.round((habit.days.filter(Boolean).length / DAYS_PER_WEEK) * PERCENTAGE_MULTIPLIER);
    return (<div>
      <div>
        <div>
          {isEditing ? (<HabitNameEditor cancelEdit={cancelEdit} error={errors.name?.message} handleSubmit={handleSubmit} onSubmit={onSubmit} register={register}/>) : (<p>{habit.name}</p>)}
        </div>

        {visibleWeekDates.map((date, dayIndex) => (<button aria-label={`Toggle ${habit.name} for ${date.toDateString()}`} key={date.toISOString()} onClick={() => toggleDayMark(index, dayIndex)} type="button">
            <div />
          </button>))}

        {!isEditing && (<>
            <Button onClick={() => startEdit(index)} size="sm" variant="ghost">
              Edit
            </Button>
            <Button onClick={() => deleteHabit(index)} size="sm" variant="danger">
              Delete
            </Button>
          </>)}

        <HabitProgress value={progressValue}/>
      </div>
    </div>);
}
