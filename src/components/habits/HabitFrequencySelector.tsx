import type { UseFormRegister } from "react-hook-form";
import { cn } from "../ui/cn";
import type { HabitFormValues } from "../../lib/habitSchema";

type HabitFrequencySelectorProps = {
  frequency: string;
  register: UseFormRegister<HabitFormValues>;
};

export default function HabitFrequencySelector({ frequency, register }: HabitFrequencySelectorProps) {
  return (
    <div>
      <p className="text-[0.6rem] font-[500] text-[#d3d6d9] mb-1.5">Frequency</p>
      <div className="flex gap-1.5">
        {(["daily", "weekly", "custom"] as const).map((opt) => (
          <label
            key={opt}
            className={cn(
              "flex-1 cursor-pointer rounded-[0.5rem] border py-1.5 text-center text-[0.65rem] font-[400] capitalize transition",
              frequency === opt
                ? "border-[#72e1ee] bg-[#edfdfe] text-[#161c22]"
                : "border-[#e0e9ed] text-[#a0a6ab] hover:border-[#72e1ee]",
            )}
          >
            <input type="radio" value={opt} className="sr-only" {...register("frequency")} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
