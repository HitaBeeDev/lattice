import { Check } from "lucide-react";
import { cn } from "../ui/cn";

type HabitDayButtonsProps = {
  habitName: string;
  days: boolean[];
  visibleWeekDates: Date[];
  habitId: string;
  onToggleDay: (habitId: string, dayIndex: number) => void;
};

export default function HabitDayButtons({
  habitName,
  days,
  visibleWeekDates,
  habitId,
  onToggleDay,
}: HabitDayButtonsProps) {
  return (
    <>
      {visibleWeekDates.map((date, dayIndex) => {
        const checked = days[dayIndex];
        return (
          <div
            key={date.toLocaleDateString("en-CA")}
            className="flex items-center justify-center col-span-1"
          >
            <button
              type="button"
              aria-label={`Toggle ${habitName} for ${date.toDateString()}`}
              aria-pressed={checked}
              onClick={() => onToggleDay(habitId, dayIndex)}
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
                <span className="text-[0.65rem] font-[400] text-[#a0a5ab]">{dayIndex + 1}</span>
              )}
            </button>
          </div>
        );
      })}
    </>
  );
}
