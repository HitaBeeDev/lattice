import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { cn } from "../ui/cn";
import { useHabits } from "../../context/HabitContext";
import { makeHabitSchema, type HabitFormValues } from "../../lib/habitSchema";
import { Button, Input } from "../ui";
import type { Habit } from "../../types/habit";

const WEEK_DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;

// ── Sub-components ──────────────────────────────────────────────────────────

type HabitStatCardsProps = {
  totalHabits: number;
  completedThisWeek: number;
  averagePercentageForWeek: number;
};

function HabitStatCards({
  totalHabits,
  completedThisWeek,
  averagePercentageForWeek,
}: HabitStatCardsProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-3 mt-auto">
      <div className="flex flex-col justify-center items-start rounded-[1rem] bg-[#edfdfe] w-full h-[7rem] p-7">
        <p className="text-[0.6rem] leading-none font-[500] text-[#d3d6d9]">Active habits</p>
        <p className="text-[2rem] leading-none font-[200] text-[#161c22] mt-3">{totalHabits}</p>
      </div>

      <div className="flex flex-col justify-center items-start rounded-[1rem] bg-[#161c22] w-full h-[7rem] p-7">
        <p className="text-[0.6rem] leading-none font-[500] text-[#d3d6d9]">Checks logged</p>
        <p className="text-[2rem] leading-none font-[200] text-[#f9fafb] mt-3">{completedThisWeek}</p>
      </div>

      <div className="relative flex flex-col justify-center items-start rounded-[1rem] w-full h-[7rem] overflow-hidden p-7">
        <div
          className="absolute inset-y-0 left-0 bg-[#72e1ee]"
          style={{ width: `${averagePercentageForWeek}%` }}
        />
        <div
          className="absolute inset-y-0 right-0 bg-[#edfdfe]"
          style={{
            width: `${100 - averagePercentageForWeek}%`,
            backgroundImage:
              "repeating-linear-gradient(135deg, #aceef5 0px, #aceef5 2px, transparent 2px, transparent 8px)",
          }}
        />
        <p className="relative z-10 text-[0.6rem] leading-none font-[400] text-[#6c90a4]">
          Weekly Output
        </p>
        <p className="relative z-10 text-[2rem] leading-none font-[200] text-[#161c22] mt-3">
          {averagePercentageForWeek}%
        </p>
      </div>
    </div>
  );
}

type AddHabitFormProps = {
  habits: Habit[];
  onAdd: (values: HabitFormValues) => void;
};

function AddHabitForm({ habits, onAdd }: AddHabitFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<HabitFormValues>({
    resolver: zodResolver(makeHabitSchema(habits.map((habit) => habit.name))),
    defaultValues: {
      name: "",
      frequency: "daily",
      frequencyDays: [],
      targetPerWeek: undefined,
      streakGoal: undefined,
    },
  });

  const frequency = watch("frequency");

  const onSubmit = (values: HabitFormValues) => {
    onAdd(values);
    reset();
  };

  return (
    <form className="flex flex-col gap-3 mt-5" onSubmit={handleSubmit(onSubmit)}>
      <Input
        className="rounded-[0.5rem] h-[2.5rem] text-[0.8rem] leading-none font-[200] text-[#a0a6ab] border border-[#e0e9ed]"
        error={errors.name?.message}
        id="new-habit-name"
        placeholder="e.g. Morning run"
        type="text"
        {...register("name")}
      />

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

      {frequency === "custom" && (
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
          {errors.frequencyDays && (
            <p className="text-[0.7rem] text-[#ef4444] mt-1">{errors.frequencyDays.message}</p>
          )}
        </div>
      )}

      <div>
        <p className="text-[0.6rem] font-[500] text-[#d3d6d9] mb-1.5">Goal (times/week)</p>
        <Input
          className="rounded-[0.5rem] h-[2.5rem] text-[0.8rem] leading-none font-[200] text-[#a0a6ab] border border-[#e0e9ed]"
          error={errors.targetPerWeek?.message}
          id="target-per-week"
          placeholder="e.g. 3"
          type="number"
          min={1}
          max={7}
          {...register("targetPerWeek", {
            setValueAs: (v) => (v === "" ? undefined : Number(v)),
          })}
        />
      </div>

      <div>
        <p className="text-[0.6rem] font-[500] text-[#d3d6d9] mb-1.5">Streak goal (days)</p>
        <Input
          className="rounded-[0.5rem] h-[2.5rem] text-[0.8rem] leading-none font-[200] text-[#a0a6ab] border border-[#e0e9ed]"
          error={errors.streakGoal?.message}
          id="streak-goal"
          placeholder="e.g. 30"
          type="number"
          min={1}
          {...register("streakGoal", {
            setValueAs: (v) => (v === "" ? undefined : Number(v)),
          })}
        />
      </div>

      <Button type="submit" className="w-full rounded-[0.5rem] h-[2.5rem] text-[0.75rem] font-[200]">
        <Plus className="w-4 h-4" />
        <p className="text-[0.8rem] font-[400]">Add habit</p>
      </Button>
    </form>
  );
}

// ── Page-level banner ────────────────────────────────────────────────────────

export default function WelcomeBanner() {
  const { habits, addHabit, averagePercentageForWeek, totalHabits, formattedToday } = useHabits();

  const completedThisWeek = habits.reduce(
    (sum, habit) => sum + habit.days.filter(Boolean).length,
    0,
  );

  return (
    <section className="grid h-full grid-cols-5 gap-3 mt-6">
      <div className="col-span-3 p-8 bg-white rounded-[1.7rem] min-h-[28rem] flex flex-col justify-start">
        <div>
          <p className="text-[0.7rem] leading-none font-[300] text-[#a0a5ab] ml-1">
            {formattedToday}
          </p>
          <p className="text-[3.75rem] leading-none font-[200] text-[#161c22] w-10/12 mt-5">
            Build a cleaner week, one repeatable win at a time.
          </p>
          <p className="w-1/2 text-[0.7rem] leading-none font-[200] text-[#a0a6ab] mt-3">
            Log the small actions you complete each day, and build consistency through repetition
            rather than perfection.
          </p>
        </div>

        <HabitStatCards
          totalHabits={totalHabits}
          completedThisWeek={completedThisWeek}
          averagePercentageForWeek={averagePercentageForWeek}
        />
      </div>

      <div className="col-span-2 p-8 bg-white rounded-[1.7rem] min-h-[28rem] flex flex-col justify-start">
        <div>
          <p className="text-[0.7rem] leading-none font-[300] text-[#a0a5ab] ml-1">Quick add</p>
          <p className="text-[1.4rem] leading-none font-[300] text-[#161c22] mt-5">
            Add a habit for this week
          </p>
        </div>
        <AddHabitForm habits={habits} onAdd={addHabit} />
      </div>
    </section>
  );
}
