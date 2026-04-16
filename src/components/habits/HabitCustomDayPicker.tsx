import { Controller, type Control, type FieldError } from "react-hook-form";
import { cn } from "../ui/cn";
import type { HabitFormValues } from "../../lib/habitSchema";

const WEEK_DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;

type HabitCustomDayPickerProps = {
  control: Control<HabitFormValues>;
  error?: FieldError;
};

export default function HabitCustomDayPicker({ control, error }: HabitCustomDayPickerProps) {
  return (
    <div>
      <p className="text-[0.6rem] font-[500] text-[#d3d6d9] mb-1.5">Days</p>
      <Controller
        control={control}
        name="frequencyDays"
        render={({ field }) => (
          <div className="flex gap-1">
            {WEEK_DAYS.map((day, i) => {
              const selected = (field.value ?? []).includes(i);
              return (
                <button
                  key={day}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    const current = field.value ?? [];
                    field.onChange(
                      selected ? current.filter((d) => d !== i) : [...current, i],
                    );
                  }}
                  className={cn(
                    "flex-1 rounded-[0.4rem] border py-1 text-[0.6rem] font-[400] transition",
                    selected
                      ? "border-[#72e1ee] bg-[#72e1ee] text-[#161c22]"
                      : "border-[#e0e9ed] text-[#a0a6ab] hover:border-[#72e1ee]",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        )}
      />
      {error?.message && (
        <p className="text-[0.7rem] text-[#ef4444] mt-1">{error.message}</p>
      )}
    </div>
  );
}
