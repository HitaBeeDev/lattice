import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTimeTracker } from "../../context/TimeTrackerContext";
import { Button, Input } from "../ui";
import {
  timerSchema,
  type TimerFormValues,
} from "../../lib/timerSchema";

type TimerFormInput = z.input<typeof timerSchema>;

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
  const completion = maxSeconds === 0 ? 0 : Math.round((totalSeconds / maxSeconds) * 100);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-center">
      <div className="relative mx-auto flex w-full max-w-[24rem] items-center justify-center">
        <div className="absolute h-56 w-56 rounded-full bg-[var(--app-accent-soft)] blur-3xl" />
        <svg
          aria-label={`${sessionType} timer showing ${minutes} minutes and ${seconds} seconds remaining`}
          className="relative h-auto w-full max-w-[24rem]"
          viewBox="0 0 200 200"
        >
          <circle
            stroke="rgba(15, 23, 42, 0.08)"
            cx="100"
            cy="100"
            r={radius}
            strokeWidth="10"
            fill="transparent"
          />

          <circle
            stroke="#d9f247"
            cx="100"
            cy="100"
            r={radius}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />

          <text
            x="50%"
            y="44%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-500 text-[8px] uppercase tracking-[0.22em]"
          >
            {sessionType}
          </text>
          <text
            x="50%"
            y="54%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-950 text-[20px] font-semibold tracking-[-0.08em]"
          >
            {`${minutes}:${seconds.toString().padStart(2, "0")}`}
          </text>
          <text
            x="50%"
            y="64%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-500 text-[7px]"
          >
            {completion}% remaining
          </text>
        </svg>
      </div>

      <div className="space-y-5">
        <div className="rounded-[1.8rem] border border-black/10 bg-white/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Session control
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            {sessionType === "Pomodoro" ? "Deep work block" : sessionType.replace("Break", " break")}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Keep one timing mode visible, editable, and easy to restart without leaving the page.
          </p>
        </div>

        {isEditing ? (
          <form className="rounded-[1.8rem] border border-black/10 bg-white/75 p-5" onSubmit={handleSubmit(onSubmit)}>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="pomodoro-minutes">
              Session minutes
            </label>
            <Input
              id="pomodoro-minutes"
              type="number"
              min={1}
              max={99}
              placeholder="Enter minutes"
              error={errors.minutes?.message}
              {...register("minutes")}
            />
            <div className="mt-4 flex gap-3">
              <Button type="submit">Save time</Button>
            </div>
          </form>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-black/5 bg-white/55 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Minutes</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{minutes}</p>
            </div>
            <div className="rounded-[1.5rem] border border-black/5 bg-white/55 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Seconds</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{seconds.toString().padStart(2, "0")}</p>
            </div>
            <div className="rounded-[1.5rem] border border-black/5 bg-white/55 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Remaining</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{completion}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TimerCircle;
