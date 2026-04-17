import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { z } from "zod";
import { timerSchema, type TimerFormValues } from "../../lib/timerSchema";
import { Input } from "../ui";

type TimerFormInput = z.input<typeof timerSchema>;

type TimerEditFormProps = {
  onUpdateTime: (minutes: number) => void;
  totalSeconds: number;
};

export default function TimerEditForm({ onUpdateTime, totalSeconds }: TimerEditFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimerFormInput, undefined, TimerFormValues>({
    resolver: zodResolver(timerSchema),
    defaultValues: { minutes: Math.floor(totalSeconds / 60) },
  });

  const onSubmit = (values: TimerFormValues) => {
    onUpdateTime(values.minutes);
    reset({ minutes: values.minutes });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label
          htmlFor="pomodoro-minutes"
          className="mb-1.5 block text-[0.65rem] font-[500] uppercase tracking-[0.12em] text-[#a0a6ab]"
        >
          Session minutes
        </label>
        <Input
          id="pomodoro-minutes"
          type="number"
          min={1}
          max={99}
          placeholder="Enter minutes"
          error={errors.minutes?.message}
          className="h-[2.7rem] rounded-[0.8rem] border border-[#e0e9ed] bg-white text-[0.9rem]"
          {...register("minutes")}
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-[2.7rem] items-center gap-2 rounded-[0.8rem] bg-[#161c22] px-4 text-[0.8rem] font-[400] text-white transition hover:bg-[#2a3340]"
      >
        <Check className="w-4 h-4" strokeWidth={1.8} />
        Save
      </button>
    </form>
  );
}
