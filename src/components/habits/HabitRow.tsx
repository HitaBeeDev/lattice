import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilLine, Trash2 } from "lucide-react";
import {
  makeHabitSchema,
  type HabitFormValues,
} from "../../lib/habitSchema";
import type { Habit } from "../../types/habit";
import { Button } from "../ui";
import { HabitNameEditor, HabitProgress } from "./HabitRowParts";

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

export default function HabitRow({
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
      makeHabitSchema(habits.map((item) => item.name), habit.name),
    ),
    defaultValues: { name: habit.name, frequency: habit.frequency ?? "daily" },
  });

  useEffect(() => {
    if (isEditing) {
      reset({ name: habit.name });
    }
  }, [habit.name, isEditing, reset]);

  const onSubmit = (values: HabitFormValues) => saveEdit(index, values.name);
  const progressValue = Math.round(
    (habit.days.filter(Boolean).length / DAYS_PER_WEEK) * PERCENTAGE_MULTIPLIER,
  );

  return (
    <article className="rounded-[2rem] border border-white/70 bg-[rgba(242,249,249,0.8)] p-4 shadow-[0_18px_55px_rgba(80,111,122,0.1)] backdrop-blur-xl lg:p-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(220px,1.2fr)_repeat(7,minmax(72px,0.52fr))_120px_120px_180px] lg:items-center">
        <div className="rounded-[1.5rem] bg-white/75 p-4">
          {isEditing ? (
            <HabitNameEditor
              cancelEdit={cancelEdit}
              error={errors.name?.message}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              register={register}
            />
          ) : (
            <>
              <p className="font-['Sora'] text-xl text-[#101820]">{habit.name}</p>
              <p className="mt-1 text-sm text-[#617782]">
                {habit.days.filter(Boolean).length} of 7 check-ins completed
              </p>
            </>
          )}
        </div>

        {visibleWeekDates.map((date, dayIndex) => (
          <button
            aria-label={`Toggle ${habit.name} for ${date.toDateString()}`}
            className={`group rounded-[1.3rem] border px-3 py-4 transition-all ${
              habit.days[dayIndex]
                ? "border-[#72e1ee] bg-[#72e1ee] text-white shadow-[0_18px_30px_rgba(114,225,238,0.32)]"
                : "border-white/80 bg-white/70 text-[#78909b] hover:border-[#72e1ee]/70 hover:bg-white"
            }`}
            key={date.toISOString()}
            onClick={() => toggleDayMark(index, dayIndex)}
            type="button"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.16em]">
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg font-medium transition-colors ${
                  habit.days[dayIndex]
                    ? "border-white/35 bg-white/20 text-white"
                    : "border-[#dfe9ec] bg-[#f9fbfc] text-[#1b2830] group-hover:border-[#b9e9ef]"
                }`}
              >
                {habit.days[dayIndex] ? "✓" : dayIndex + 1}
              </span>
            </div>
          </button>
        ))}

        {!isEditing && (
          <>
            <Button
              className="h-14 rounded-[1.3rem]"
              onClick={() => startEdit(index)}
              size="sm"
              variant="ghost"
            >
              <PencilLine className="h-4 w-4" />
              Edit
            </Button>
            <Button
              className="h-14 rounded-[1.3rem]"
              onClick={() => deleteHabit(index)}
              size="sm"
              variant="danger"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </>
        )}

        <HabitProgress value={progressValue} />
      </div>
    </article>
  );
}
