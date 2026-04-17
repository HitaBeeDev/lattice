import { useHabits } from "../../context/HabitContext";

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function WeekDaysHeader() {
  const { visibleWeekDates } = useHabits();

  return (
    <section>
      <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] justify-between items-center ml-5 mr-5 pl-5 pr-5 mt-6">
        <div className="flex flex-col items-start justify-center col-span-2">
          <p className="text-[0.75rem] leading-none font-[400] text-[#a0a5ab]">
            Your Habit
          </p>
        </div>

        {visibleWeekDates.map((date, index) => (
          <div
            key={date.toLocaleDateString("en-CA")}
            className="flex flex-col items-center justify-center col-span-1"
          >
            <p className="text-[0.6rem] leading-none font-[400] text-[#a0a5ab]">
              {DAY_LABELS[index]}
            </p>

            <p className="text-[0.7rem] leading-none font-[400] text-[#161c22] mt-2">
              {date
                .toLocaleDateString("en-US", { month: "short", day: "numeric" })
                .toUpperCase()}
            </p>
          </div>
        ))}

        <div className="flex flex-col items-center justify-center col-span-1">
          <p className="text-[0.75rem] leading-none font-[400] text-[#a0a5ab]">
            EDIT
          </p>
        </div>

        <div className="flex flex-col items-center justify-center col-span-1">
          <p className="text-[0.75rem] leading-none font-[400] text-[#a0a5ab]">
            DELETE
          </p>
        </div>

        <div className="flex flex-col items-center justify-center col-span-2">
          <p className="text-[0.75rem] leading-none font-[400] text-[#a0a5ab]">
            PROGRESS
          </p>
        </div>
      </div>
    </section>
  );
}
