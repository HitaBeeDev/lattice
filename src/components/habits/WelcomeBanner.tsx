import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Plus, Sparkles, Target } from "lucide-react";
import { useHabits } from "../../context/HabitContext";
import {
  makeHabitSchema,
  type HabitFormValues,
} from "../../lib/habitSchema";
import { Button, Input } from "../ui";

export default function WelcomeBanner() {
  const {
    habits,
    addHabit,
    averagePercentageForWeek,
    completedHabits,
    totalHabits,
    formattedToday,
  } = useHabits();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HabitFormValues>({
    resolver: zodResolver(makeHabitSchema(habits.map((habit) => habit.name))),
    defaultValues: { name: "" },
  });

  const onSubmit = (values: HabitFormValues) => {
    addHabit(values.name);
    reset();
  };

  const completedThisWeek = habits.reduce(
    (sum, habit) => sum + habit.days.filter(Boolean).length,
    0,
  );

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(360px,0.9fr)]">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(249,252,252,0.9)_0%,rgba(235,246,247,0.92)_50%,rgba(194,243,248,0.95)_100%)] p-7 shadow-[0_24px_70px_rgba(80,111,122,0.14)]">
        <div
          aria-hidden="true"
          className="absolute -right-16 top-0 h-52 w-52 rounded-full bg-white/40 blur-3xl"
        />

        <div className="relative flex h-full flex-col justify-between gap-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#161c22] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/85">
                <Sparkles className="h-4 w-4" />
                Habit rhythm
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-[#6d7f89]">
                  {formattedToday}
                </p>
                <h1 className="max-w-[16ch] font-['Sora'] text-4xl font-[500] leading-tight text-[#101820] sm:text-[2.9rem]">
                  Build a cleaner week, one repeatable win at a time.
                </h1>
                <p className="max-w-[60ch] text-sm leading-6 text-[#4f6570] sm:text-base">
                  Track the actions you want to see every day. The layout
                  mirrors the dashboard language, but keeps habits front and
                  center.
                </p>
              </div>
            </div>

            <div className="hidden rounded-[1.75rem] border border-white/70 bg-white/55 p-4 shadow-[0_12px_28px_rgba(96,120,130,0.12)] sm:block">
              <ArrowUpRight className="h-7 w-7 text-[#161c22]" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/70 bg-white/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#7f949d]">
                Active habits
              </p>
              <p className="mt-3 text-3xl font-[300] text-[#161c22]">
                {totalHabits}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/70 bg-white/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#7f949d]">
                Weekly output
              </p>
              <p className="mt-3 text-3xl font-[300] text-[#161c22]">
                {averagePercentageForWeek}%
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/70 bg-[#161c22] p-4 text-white">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                Checks logged
              </p>
              <p className="mt-3 text-3xl font-[300] text-white">
                {completedThisWeek}
              </p>
            </div>
          </div>
        </div>
      </div>

      <aside className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-[rgba(239,247,248,0.82)] p-6 shadow-[0_24px_70px_rgba(80,111,122,0.12)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c939d]">
              Quick add
            </p>
            <h2 className="mt-2 font-['Sora'] text-[1.8rem] font-[500] leading-tight text-[#101820]">
              Add a habit for this week
            </h2>
          </div>
          <div className="rounded-full bg-white p-3 text-[#161c22]">
            <Target className="h-5 w-5" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="rounded-[1.25rem] bg-white/75 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[#7c939d]">
              Perfect habits
            </p>
            <p className="mt-2 text-2xl font-[300] text-[#161c22]">
              {completedHabits}/{Math.max(totalHabits, 1)}
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-white/75 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[#7c939d]">
              Target status
            </p>
            <p className="mt-2 text-2xl font-[300] text-[#161c22]">
              {averagePercentageForWeek >= 70
                ? "Strong"
                : averagePercentageForWeek >= 40
                  ? "Steady"
                  : "Starting"}
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            className="h-14 rounded-[1.2rem] border-white/80 bg-white/85 text-base"
            error={errors.name?.message}
            id="new-habit-name"
            placeholder="Habit name"
            type="text"
            {...register("name")}
          />
          <Button
            className="h-14 w-full rounded-[1.2rem] text-base font-medium"
            type="submit"
          >
            <Plus className="h-4 w-4" />
            Add habit
          </Button>
        </form>
      </aside>
    </section>
  );
}
