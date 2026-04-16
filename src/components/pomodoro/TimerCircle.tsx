import { Check } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTimeTracker } from "../../context/TimeTrackerContext";
import { Input } from "../ui";
import { timerSchema, type TimerFormValues } from "../../lib/timerSchema";
type TimerFormInput = z.input<typeof timerSchema>;
const SESSION_DESCRIPTIONS: Record<string, string> = {
  Pomodoro: "Deep work block",
  ShortBreak: "Reset your attention",
  LongBreak: "Step away and recover",
};
function TimerCircle() {
  const {
    totalSeconds,
    maxSeconds,
    isEditing,
    handleUpdateTime,
    radius,
    circumference,
    strokeDashoffset,
    sessionType,
  } = useTimeTracker();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimerFormInput, undefined, TimerFormValues>({
    resolver: zodResolver(timerSchema),
    defaultValues: { minutes: Math.floor(totalSeconds / 60) },
  });
  useEffect(() => {
    if (isEditing) {
      reset({ minutes: Math.floor(totalSeconds / 60) });
    }
  }, [isEditing, reset, totalSeconds]);
  const onSubmit = (values: TimerFormValues) => {
    handleUpdateTime(values.minutes);
    reset({ minutes: values.minutes });
  };
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const completion =
    maxSeconds === 0 ? 0 : Math.round((totalSeconds / maxSeconds) * 100);
  return (
    <div className="flex flex-col flex-1 mb-2">
      <div className="relative mx-auto mt-3 flex h-[24rem] w-[24rem] items-center justify-center">
        <svg
          aria-label={`${sessionType} timer showing ${minutes} minutes and ${seconds} seconds remaining`}
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full -rotate-90"
        >
          <circle
            stroke="#d7dfe2"
            cx="100"
            cy="100"
            r={radius + 10}
            strokeWidth="0.8"
            strokeDasharray="3 5"
            fill="transparent"
          />
          <circle
            stroke="#e5ecee"
            cx="100"
            cy="100"
            r={radius}
            strokeWidth="14"
            fill="transparent"
          />
          <circle
            stroke="#72e1ee"
            cx="100"
            cy="100"
            r={radius}
            strokeWidth="14"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
        </svg>

        <div className="relative z-10 text-center">
          <p className="text-[0.72rem] font-[400] uppercase tracking-[0.18em] text-[#95a0a7]">
            {sessionType}
          </p>
          <p className="mt-2.5 text-[3rem] font-[200] leading-none tracking-[-0.06em] text-[#161c22]">
            {`${minutes}:${seconds.toString().padStart(2, "0")}`}
          </p>
          <p className="mt-1.5 text-[0.72rem] font-[300] text-[#7b858c]">
            {SESSION_DESCRIPTIONS[sessionType] ??
              "Stay with the current session"}
          </p>
        </div>
      </div>

      <div className="mt-2 rounded-[1.2rem] bg-white/80 p-3">
        {isEditing ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-end gap-3"
          >
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
        ) : (
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-[0.95rem] bg-[#f5f8f9] px-3.5 py-2">
              <p className="text-[0.62rem] font-[500] uppercase tracking-[0.12em] text-[#a0a6ab]">
                Minutes
              </p>
              <p className="mt-1 text-[1.18rem] font-[300] leading-none text-[#161c22]">
                {minutes}
              </p>
            </div>

            <div className="rounded-[0.95rem] bg-[#f5f8f9] px-3.5 py-2">
              <p className="text-[0.62rem] font-[500] uppercase tracking-[0.12em] text-[#a0a6ab]">
                Seconds
              </p>
              <p className="mt-1 text-[1.18rem] font-[300] leading-none text-[#161c22]">
                {seconds.toString().padStart(2, "0")}
              </p>
            </div>

            <div className="rounded-[0.95rem] bg-[#f5f8f9] px-3.5 py-2">
              <p className="text-[0.62rem] font-[500] uppercase tracking-[0.12em] text-[#a0a6ab]">
                Remaining
              </p>
              <p className="mt-1 text-[1.18rem] font-[300] leading-none text-[#161c22]">
                {completion}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default TimerCircle;
