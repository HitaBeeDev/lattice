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
    <div className="mt-auto grid grid-cols-1 gap-3 md:grid-cols-3">
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
    <section className="mt-6 flex flex-col gap-3 xl:grid xl:h-full xl:grid-cols-5">
      <div className="flex min-h-[24rem] flex-col justify-start rounded-[1.7rem] bg-white p-6 md:min-h-[28rem] md:p-8 xl:col-span-3">
        <div>
          <p className="text-[0.7rem] leading-none font-[300] text-[#a0a5ab] ml-1">
            {formattedToday}
          </p>
          <p className="mt-5 w-full text-[2.3rem] leading-none font-[200] text-[#161c22] md:w-10/12 md:text-[3.75rem]">
            Build a cleaner week, one repeatable win at a time.
          </p>
          <p className="mt-3 w-full text-[0.7rem] leading-none font-[200] text-[#a0a6ab] md:w-1/2">
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

      <div className="flex min-h-[24rem] flex-col justify-start rounded-[1.7rem] bg-white p-6 md:min-h-[28rem] md:p-8 xl:col-span-2">
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
