import { useHabits } from "../../context/HabitContext";

export default function WeekDaysHeader() {
  const { formatDate, visibleWeekDates } = useHabits();

  return (
    <section>
      <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] justify-between items-center ml-5 mr-5">
        <div className="flex flex-col items-start justify-center col-span-2">
          <p className="text-[0.75rem] leading-none font-[400] text-[#a0a5ab]">
            Weekly tracker
          </p>
        </div>

        <div className="flex flex-col items-center justify-center col-span-1">
          <p className="text-[0.6rem] leading-none font-[400] text-[#a0a5ab]">
            MON
          </p>

          <p className="text-[0.7rem] leading-none font-[400] text-[#161c22] mt-2">
            APR 13
          </p>
        </div>

        <div className="flex flex-col items-center justify-center col-span-1">
          <p className="text-[0.6rem] leading-none font-[400] text-[#a0a5ab]">
            TUE
          </p>

          <p className="text-[0.7rem] leading-none font-[400] text-[#161c22] mt-2">
            APR 14
          </p>
        </div>

        <div className="flex flex-col items-center justify-center col-span-1">
          <p className="text-[0.6rem] leading-none font-[400] text-[#a0a5ab]">
            WED
          </p>

          <p className="text-[0.7rem] leading-none font-[400] text-[#161c22] mt-2">
            APR 15
          </p>
        </div>

        <div className="flex flex-col items-center justify-center col-span-1">
          <p className="text-[0.6rem] leading-none font-[400] text-[#a0a5ab]">
            THU
          </p>

          <p className="text-[0.7rem] leading-none font-[400] text-[#161c22] mt-2">
            APR 16
          </p>
        </div>

        <div className="flex flex-col items-center justify-center col-span-1">
          <p className="text-[0.6rem] leading-none font-[400] text-[#a0a5ab]">
            FRI
          </p>

          <p className="text-[0.7rem] leading-none font-[400] text-[#161c22] mt-2">
            APR 17
          </p>
        </div>

        <div className="flex flex-col items-center justify-center col-span-1">
          <p className="text-[0.6rem] leading-none font-[400] text-[#a0a5ab]">
            SAT
          </p>

          <p className="text-[0.7rem] leading-none font-[400] text-[#161c22] mt-2">
            APR 18
          </p>
        </div>

        <div className="flex flex-col items-center justify-center col-span-1">
          <p className="text-[0.6rem] leading-none font-[400] text-[#a0a5ab]">
            SUN
          </p>

          <p className="text-[0.7rem] leading-none font-[400] text-[#161c22] mt-2">
            APR 19
          </p>
        </div>

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
