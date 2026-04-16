import clsx from "clsx";
import {
  type TimeSlot,
  type DisplayDay,
} from "../../../lib/calendarUtils";

type TimeGridBackgroundProps = {
  timeSlots: TimeSlot[];
  displayDays: DisplayDay[];
  todayDate: string;
};

export default function TimeGridBackground({
  timeSlots,
  displayDays,
  todayDate,
}: TimeGridBackgroundProps) {
  return (
    <>
      {/* Time labels + horizontal lines */}
      <div className="absolute inset-0 grid grid-cols-[48px_1fr] pointer-events-none">
        <div className="grid grid-rows-[repeat(7,minmax(0,1fr))]">
          {timeSlots.map((slot) => (
            <div key={slot.label} className="flex items-center justify-end pr-2">
              <span className="text-[0.58rem] leading-none text-[#a0a6ab]">{slot.label}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-rows-[repeat(7,minmax(0,1fr))]">
          {timeSlots.map((slot) => (
            <div key={slot.label} className="flex items-center">
              <div className="w-full border-t border-dashed border-[#c0d4dc]/50" />
            </div>
          ))}
        </div>
      </div>

      {/* Day column backgrounds */}
      <div className="absolute inset-0 grid grid-cols-[48px_repeat(7,minmax(0,1fr))] gap-x-[6px]">
        <div />
        {displayDays.map((day) => (
          <div
            key={day.date}
            className={clsx(
              "grid h-full rounded-lg border border-dashed border-[#c0d4dc]/40 grid-rows-[repeat(7,minmax(0,1fr))]",
              day.date === todayDate && "bg-white/20",
            )}
          />
        ))}
      </div>
    </>
  );
}
