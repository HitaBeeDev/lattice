import { memo } from "react";
import { Check } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "../ui/cn";

type HabitDayButtonsProps = {
  habitName: string;
  days: boolean[];
  visibleWeekDates: Date[];
  habitId: string;
  onToggleDay: (habitId: string, dayIndex: number) => void;
};

function HabitDayButtons({
  habitName,
  days,
  visibleWeekDates,
  habitId,
  onToggleDay,
}: HabitDayButtonsProps) {
  const shouldReduce = useReducedMotion();

  return (
    <>
      {visibleWeekDates.map((date, dayIndex) => {
        const checked = days[dayIndex];
        return (
          <div
            key={date.toLocaleDateString("en-CA")}
            className="flex items-center justify-center col-span-1"
          >
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

export default memo(HabitDayButtons);
