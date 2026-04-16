import { useHabits } from "../../context/HabitContext";
import { HatchFill } from "../ui";
import AddHabitForm from "./AddHabitForm";

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
        <p className="text-[2rem] leading-none font-[200] text-[#f9fafb] mt-3">
          {completedThisWeek}
        </p>
      </div>

      <div className="relative flex flex-col justify-center items-start rounded-[1rem] w-full h-[7rem] overflow-hidden p-7">
        <HatchFill
          filledClassName="bg-[#72e1ee]"
          hatchClassName="bg-hatch-accent bg-[#edfdfe]"
          percentage={averagePercentageForWeek}
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
