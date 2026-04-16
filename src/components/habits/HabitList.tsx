import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, PencilLine, Trash2 } from "lucide-react";
import { cn } from "../ui/cn";
import { useHabits } from "../../context/HabitContext";
import { makeHabitSchema, type HabitFormValues } from "../../lib/habitSchema";
import { Button, EmptyState, Input } from "../ui";

const DAYS_PER_WEEK = 7;

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

  const editingHabit = habits[editIndex];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HabitFormValues>({
    resolver: zodResolver(
      makeHabitSchema(
        habits.map((h) => h.name),
        editingHabit?.name,
      ),
    ),
    defaultValues: { name: "", frequency: "daily" },
  });

  useEffect(() => {
    if (editingHabit) {
      reset({
        name: editingHabit.name,
        frequency: editingHabit.frequency ?? "daily",
      });
    }
  }, [editingHabit, reset]);

  if (habits.length === 0) {
    return (
      <EmptyState
        className="rounded-[2rem] border border-dashed border-white/80 bg-white/45 px-6 py-12 shadow-[0_18px_55px_rgba(80,111,122,0.08)]"
        description="Looks like you haven't added any habits yet. Start by creating one small routine you want to keep this week."
        title="No habits yet"
      />
    );
  }

  return (
    <div className="-mt-5">
      {habits.map((habit, index) => {
        const isEditing = editIndex === index;
        const progress = Math.round(
          (habit.days.filter(Boolean).length / DAYS_PER_WEEK) * 100,
        );

        return (
          <div
            key={habit.id}
            className="grid grid-cols-[repeat(13,minmax(0,1fr))] justify-between items-center ml-5 
            mr-5 mt-3 bg-white h-[5rem] rounded-[1rem] p-5"
          >
            {/* Habit name / inline edit */}
            <div className="flex flex-col items-start justify-center col-span-2">
              {isEditing ? (
                <form
                  onSubmit={handleSubmit((values) =>
                    saveEdit(index, values.name),
                  )}
                  className="w-full flex items-start gap-1.5"
                >
                  <Input
                    className="h-[2rem] text-[0.75rem] rounded-[0.4rem] border-[#e0e9ed]"
                    error={errors.name?.message}
                    id={`edit-habit-${index}`}
                    type="text"
                    {...register("name")}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="h-[2rem] shrink-0 px-3 text-[0.65rem]"
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-[2rem] shrink-0 px-3 text-[0.65rem]"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </Button>
                </form>
              ) : (
                <>
                  <p className="text-[0.85rem] leading-none font-[500] text-[#161c22]">
                    {habit.name}
                  </p>

                  <p className="text-[0.65rem] leading-none font-[300] text-[#a0a5ab] mt-1.5">
                    {habit.days.filter(Boolean).length} of 7 check-ins completed
                  </p>
                </>
              )}
            </div>

            {/* Day cells */}
            {visibleWeekDates.map((date, dayIndex) => {
              const checked = habit.days[dayIndex];
              return (
                <div
                  key={date.toLocaleDateString("en-CA")}
                  className="flex items-center justify-center col-span-1"
                >
                  <button
                    type="button"
                    aria-label={`Toggle ${habit.name} for ${date.toDateString()}`}
                    aria-pressed={checked}
                    onClick={() => toggleDayMark(index, dayIndex)}
                    className={cn(
                      "flex items-center justify-center h-[2rem] w-[2rem] rounded-full transition",
                      checked
                        ? "bg-[#06090f]"
                        : "border border-[#dde4e8] hover:border-[#b0bec5] hover:bg-[#f5feff]",
                    )}
                  >
                    {checked ? (
                      <Check className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <span className="text-[0.65rem] font-[400] text-[#a0a5ab]">
                        {dayIndex + 1}
                      </span>
                    )}
                  </button>
                </div>
              );
            })}

            {/* Edit */}
            <div className="flex flex-col items-center justify-center col-span-1">
              <button
                type="button"
                aria-label={`Edit ${habit.name}`}
                onClick={() => startEdit(index)}
                className="text-[#a0a5ab] hover:text-[#161c22] transition"
              >
                <PencilLine className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Delete */}
            <div className="flex flex-col items-center justify-center col-span-1">
              <button
                type="button"
                aria-label={`Delete ${habit.name}`}
                onClick={() => deleteHabit(index)}
                className="text-[#ef4444] transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Progress */}
            <div className="flex flex-col items-center justify-center col-span-2 mt-3">
              <div className="w-full h-1.5 rounded-full bg-[#f0f5f6] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#72e1ee] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-[0.65rem] leading-none font-[400] text-[#a0a5ab] mt-2">
                {progress}%
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
