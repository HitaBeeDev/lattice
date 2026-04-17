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
    <>
      <div className="mx-3 mt-3 rounded-[1rem] bg-white p-5 xl:hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
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
                <p className="text-[0.95rem] leading-none font-[500] text-[#161c22]">{habit.name}</p>
                <p className="mt-1.5 text-[0.7rem] leading-none font-[300] text-[#a0a5ab]">
                  {habit.days.filter(Boolean).length} of 7 check-ins completed
                </p>
              </>
            )}
          </div>

          {!isEditing ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={`Edit ${habit.name}`}
                onClick={() => onStartEdit(habit.id)}
                className="text-[#a0a5ab] transition hover:text-[#161c22]"
              >
                <PencilLine className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={`Delete ${habit.name}`}
                onClick={() => onDelete(habit.id)}
                className="text-[#ef4444] transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-5 grid grid-cols-7 gap-2">
          <HabitDayButtons
            habitName={habit.name}
            days={habit.days}
            visibleWeekDates={visibleWeekDates}
            habitId={habit.id}
            onToggleDay={onToggleDay}
            showDateLabels
            wrapperClassName="justify-start"
          />
        </div>

        <HabitProgressBar
          days={habit.days}
          className="mt-5 flex flex-col items-start justify-center"
        />
      </div>

      <div className="hidden xl:grid xl:grid-cols-[repeat(13,minmax(0,1fr))] xl:justify-between xl:items-center xl:ml-5 xl:mr-5 xl:mt-3 xl:h-[5rem] xl:rounded-[1rem] xl:bg-white xl:p-5">
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
    </>
  );
}

const MemoizedHabitRow = memo(HabitRow);

export default MemoizedHabitRow;
