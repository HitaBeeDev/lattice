import { memo } from "react";
import { PencilLine, Trash2 } from "lucide-react";
import type { Habit } from "../../types/habit";
import HabitInlineEditForm from "./HabitInlineEditForm";
import HabitDayButtons from "./HabitDayButtons";
import HabitProgressBar from "./HabitProgressBar";

type HabitRowProps = {
  habit: Habit;
  isEditing: boolean;
  allHabitNames: string[];
  visibleWeekDates: Date[];
  onStartEdit: (habitId: string) => void;
  onSaveEdit: (habitId: string, name: string) => void;
  onCancelEdit: () => void;
  onDelete: (habitId: string) => void;
  onToggleDay: (habitId: string, dayIndex: number) => void;
};

function HabitRow({
  habit,
  isEditing,
  allHabitNames,
  visibleWeekDates,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onToggleDay,
}: HabitRowProps) {
  return (
    <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] justify-between items-center ml-5 mr-5 mt-3 bg-white h-[5rem] rounded-[1rem] p-5">
      <div className="flex flex-col items-start justify-center col-span-2">
        {isEditing ? (
          <HabitInlineEditForm
            habitName={habit.name}
            habitFrequency={habit.frequency ?? "daily"}
            allHabitNames={allHabitNames}
            habitId={habit.id}
            onSave={onSaveEdit}
            onCancel={onCancelEdit}
          />
        ) : (
          <>
            <p className="text-[0.85rem] leading-none font-[500] text-[#161c22]">{habit.name}</p>
            <p className="text-[0.65rem] leading-none font-[300] text-[#a0a5ab] mt-1.5">
              {habit.days.filter(Boolean).length} of 7 check-ins completed
            </p>
          </>
        )}
      </div>

      <HabitDayButtons
        habitName={habit.name}
        days={habit.days}
        visibleWeekDates={visibleWeekDates}
        habitId={habit.id}
        onToggleDay={onToggleDay}
      />

      <div className="flex flex-col items-center justify-center col-span-1">
        <button
          type="button"
          aria-label={`Edit ${habit.name}`}
          onClick={() => onStartEdit(habit.id)}
          className="text-[#a0a5ab] hover:text-[#161c22] transition"
        >
          <PencilLine className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center col-span-1">
        <button
          type="button"
          aria-label={`Delete ${habit.name}`}
          onClick={() => onDelete(habit.id)}
          className="text-[#ef4444] transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <HabitProgressBar days={habit.days} />
    </div>
  );
}

const MemoizedHabitRow = memo(HabitRow);

export default MemoizedHabitRow;
