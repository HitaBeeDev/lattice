import { useHabits } from "../../context/HabitContext";
import habitQuotes from "./habitQuotes";

export default function SummaryStats() {
  const { percentages, quoteIndex, weekDates } = useHabits();
  const strongestDay = Math.max(...percentages, 0);

  return (
    <section className="grid h-full grid-cols-5 gap-3 mt-4">
      <div className="col-span-3 p-8 bg-white rounded-[1.7rem] min-h-[13.5rem] flex flex-col justify-start">
        <div className="flex flex-row items-start justify-between">
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

        <div className="grid items-end grid-cols-7 gap-[1rem] mt-auto mb-1">
          {weekDates.map((date, index) => (
            <div
              className="flex flex-col justify-center col-span-1 mt-8"
              key={date.toLocaleDateString("en-CA")}
            >
              <p className="text-[0.6rem] leading-none font-[400] text-[#a0a5ab]">
                {date.toLocaleDateString("en-US", { weekday: "long" })}
              </p>

              <p className="text-[1.2rem] leading-none font-[400] text-[#161c22] mt-2">
                {percentages[index]}%
              </p>

              <div className="mt-4 h-[0.3rem] overflow-hidden rounded-full bg-[#e6e8ea]">
                <div
                  className="h-full rounded-full bg-[#06090f]"
                  style={{ width: `${percentages[index]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-2 p-8 bg-[#242b32] rounded-[1.7rem] min-h-[13.5rem] flex flex-col">
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
