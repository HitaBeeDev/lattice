import { memo } from "react";
import { Check } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "../ui/cn";

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

type HabitDayButtonsProps = {
  habitName: string;
  days: boolean[];
  visibleWeekDates: Date[];
  habitId: string;
  onToggleDay: (habitId: string, dayIndex: number) => void;
  showDateLabels?: boolean;
  wrapperClassName?: string;
};

function HabitDayButtons({
  habitName,
  days,
  visibleWeekDates,
  habitId,
  onToggleDay,
  showDateLabels = false,
  wrapperClassName,
}: HabitDayButtonsProps) {
  const shouldReduce = useReducedMotion();

  return (
    <>
      {visibleWeekDates.map((date, dayIndex) => {
        const checked = days[dayIndex];
        return (
          <div
            key={date.toLocaleDateString("en-CA")}
            className={cn(
              "flex items-center justify-center col-span-1",
              showDateLabels && "flex-col gap-1.5",
              wrapperClassName,
            )}
          >
            {showDateLabels ? (
              <div className="flex flex-col items-center justify-center">
                <p className="text-[0.55rem] leading-none font-[500] text-[#a0a5ab]">
                  {DAY_LABELS[dayIndex]}
                </p>
                <p className="mt-1 text-[0.6rem] leading-none font-[400] text-[#161c22]">
                  {date
                    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    .toUpperCase()}
                </p>
              </div>
            ) : null}
            <motion.button
              type="button"
              aria-label={`Toggle ${habitName} for ${date.toDateString()}`}
              aria-pressed={checked}
              onClick={() => onToggleDay(habitId, dayIndex)}
              whileTap={shouldReduce ? undefined : { scale: 0.82 }}
              animate={shouldReduce ? undefined : { scale: checked ? [1, 1.18, 1] : 1 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={cn(
                "flex items-center justify-center h-[2rem] w-[2rem] rounded-full transition-colors duration-200",
                checked
                  ? "bg-[#06090f]"
                  : "border border-[#dde4e8] hover:border-[#b0bec5] hover:bg-[#f5feff]",
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {checked ? (
                  <motion.span
                    key="check"
                    initial={shouldReduce ? undefined : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={shouldReduce ? undefined : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Check className="w-3.5 h-3.5 text-white" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="day"
                    initial={shouldReduce ? undefined : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={shouldReduce ? undefined : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-[0.65rem] font-[400] text-[#a0a5ab]"
                  >
                    {dayIndex + 1}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        );
      })}
    </>
  );
}

const MemoizedHabitDayButtons = memo(HabitDayButtons);

export default MemoizedHabitDayButtons;
