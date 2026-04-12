import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHabits } from "../../context/HabitContext";
import { HabitEntry } from "../../hooks/useHabits";
import {
  makeHabitSchema,
  type HabitFormValues,
} from "../../lib/habitSchema";

export default function HabitList() {
  const {
    habits,
    editIndex,
    startEdit,
    saveEdit,
    cancelEdit,
    deleteHabit,
    toggleDayMark,
    visibleWeekDates,
  } = useHabits();

  if (habits.length === 0) {
    return (
      <div>
        <p>
          Looks like you haven't added any habits yet! Let's get started on
          creating some positive ones!
        </p>
      </div>
    );
  }

  return (
    <>
      {habits.map((habit, index) => (
        <HabitRow
          key={habit.id}
          editIndex={editIndex}
          habit={habit}
          habits={habits}
          index={index}
          startEdit={startEdit}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          deleteHabit={deleteHabit}
          toggleDayMark={toggleDayMark}
          visibleWeekDates={visibleWeekDates}
        />
      ))}
    </>
  );
}

interface HabitRowProps {
  editIndex: number;
  habit: HabitEntry;
  habits: HabitEntry[];
  index: number;
  startEdit: (index: number) => void;
  saveEdit: (index: number, name: string) => void;
  cancelEdit: () => void;
  deleteHabit: (index: number) => void;
  toggleDayMark: (habitIndex: number, dayIndex: number) => void;
  visibleWeekDates: Date[];
}

function HabitRow({
  editIndex,
  habit,
  habits,
  index,
  startEdit,
  saveEdit,
  cancelEdit,
  deleteHabit,
  toggleDayMark,
  visibleWeekDates,
}: HabitRowProps) {
  const isEditing = editIndex === index;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HabitFormValues>({
    resolver: zodResolver(
      makeHabitSchema(
        habits.map((item) => item.name),
        habit.name
      )
    ),
    defaultValues: { name: habit.name },
  });

  useEffect(() => {
    if (isEditing) {
      reset({ name: habit.name });
    }
  }, [habit.name, isEditing, reset]);

  const onSubmit = (values: HabitFormValues) => {
    saveEdit(index, values.name);
  };

  return (
    <div>
      <div>
        <div>
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <input type="text" {...register("name")} />
              {errors.name && <p>{errors.name.message}</p>}
              <button type="submit">Save</button>
              <button
                onClick={cancelEdit}
                type="button"
              >
                Cancel
              </button>
            </form>
          ) : (
            <p>{habit.name}</p>
          )}
        </div>

        {visibleWeekDates.map((_, dayIndex) => (
          <div
            key={dayIndex}
            onClick={() => toggleDayMark(index, dayIndex)}
          >
            <div />
          </div>
        ))}

        {!isEditing && (
          <>
            <button onClick={() => startEdit(index)} type="button">
              Edit
            </button>
            <button onClick={() => deleteHabit(index)} type="button">
              Delete
            </button>
          </>
        )}

        <div>
          {`${Math.round((habit.days.filter((day) => day).length / 7) * 100)}%`}
        </div>
      </div>
    </div>
  );
}
