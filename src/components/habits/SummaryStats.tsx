import { useHabits } from "../../context/HabitContext";
import { getPercentageFillClass } from "../../lib/progressStyles";
import habitQuotes from "./habitQuotes";
import { useRandomIndex } from "../../hooks/useRandomIndex";

export default function SummaryStats() {
  const { percentages, weekDates } = useHabits();
  const quoteIndex = useRandomIndex(habitQuotes.length);
  const strongestDay = Math.max(...percentages, 0);

  return (
    <section className="mt-4 flex flex-col gap-3 xl:grid xl:h-full xl:grid-cols-5">
      <div className="flex min-h-[13.5rem] flex-col justify-start rounded-[1.7rem] bg-white p-6 md:p-8 xl:col-span-3">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
          <div>
            <p className="text-[0.7rem] leading-none font-[300] text-[#a0a5ab] ml-1">
              Weekly check-ins
            </p>

            <p className="text-[1.4rem] leading-none font-[200] text-[#161c22] mt-5">
              Daily completion rhythm
            </p>
          </div>

          <div className="h-[1.6rem] rounded-[0.5rem] bg-[#edfdfe] flex justify-center items-center pl-[0.9rem] pr-[0.9rem]">
            <p className="text-[0.8rem] leading-none font-[300] text-[#161c22]">
              Peak: {strongestDay}%
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:mb-1 md:mt-auto md:grid-cols-7 md:items-end md:gap-[1rem]">
          {weekDates.map((date, index) => (
            <div
              className="flex flex-col justify-center md:col-span-1 md:mt-8"
              key={date.toLocaleDateString("en-CA")}
            >
              <p className="text-[0.6rem] leading-none font-[400] text-[#a0a5ab]">
                {date.toLocaleDateString("en-US", { weekday: "long" })}
              </p>

              <p className="text-[1.2rem] leading-none font-[400] text-[#161c22] mt-2">
                {percentages[index]}%
              </p>

              <div className="mt-4 h-[0.3rem] overflow-hidden rounded-full bg-[#e6e8ea]">
                <div className={getPercentageFillClass(percentages[index], "h-full rounded-full bg-[#06090f]")} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-h-[13.5rem] flex-col rounded-[1.7rem] bg-[#242b32] p-6 md:p-8 xl:col-span-2">
        <p className="text-[0.7rem] leading-none font-[300] text-[#f9fafb] ml-1">
          Reflection
        </p>

        <div className="flex items-center justify-center flex-1">
          <p className="text-[1.8rem] leading-none font-[300] text-[#e6e8ea] text-center">
            {habitQuotes[quoteIndex]}
          </p>
        </div>
      </div>
    </section>
  );
}
