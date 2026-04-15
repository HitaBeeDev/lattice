interface StatsBarProps {
  completedTodayTasks: number;
  totalTodayTasks: number;
  completedHabitsToday: number;
  totalDailyHabits: number;
  habitPct: number;
  focusMinutes: number;
  weeklyGoalAverage: number;
  currentStreak: number;
  totalHabits: number;
  completedPomodoros: number;
}

function StatsBar({
  completedTodayTasks,
  totalTodayTasks,
  completedHabitsToday,
  totalDailyHabits,
  habitPct,
  focusMinutes,
  weeklyGoalAverage,
  currentStreak,
  totalHabits,
  completedPomodoros,
}: StatsBarProps) {
  return (
    <div className="flex flex-row items-center justify-between mt-2">
      {/* Left Section */}
      <div className="flex flex-row items-center gap-[0.4rem]">
        {/* Tasks pill */}
        <div>
          <p className="text-[0.6rem] font-[500] text-[#a0a6ab] ml-2 mb-[0.3rem]">
            Tasks
          </p>

          <div
            className="bg-[#161c22] h-[2.6rem] rounded-full w-[7.4rem] flex items-center
            justify-center"
          >
            <p className="text-[#f9fafb] text-[0.9rem] font-extralight">
              {completedTodayTasks}/{totalTodayTasks} done
            </p>
          </div>
        </div>

        {/* Habits pill */}
        <div>
          <p className="text-[0.6rem] font-[500] text-[#a0a6ab] ml-3 mb-[0.3rem]">
            Habits
          </p>

          <div
            className="bg-[#72e1ee] h-[2.6rem] rounded-full w-[9.5rem] flex items-center
            justify-center"
          >
            <p className="text-[#edfdfe] text-[0.9rem] font-extralight">
              {completedHabitsToday} of {totalDailyHabits} • {habitPct}%
            </p>
          </div>
        </div>

        {/* Focus Time */}
        <div>
          <p className="text-[0.6rem] font-[500] text-[#a0a6ab] ml-3 mb-[0.3rem]">
            Focus Time
          </p>

          <div
            className="border border-[#060a0f] h-[2.6rem] rounded-full w-[6.5rem] flex items-center
            justify-center"
          >
            <p className="text-[#161c22] text-[0.9rem] font-extralight">
              {focusMinutes >= 60
                ? `${Math.floor(focusMinutes / 60)}h ${focusMinutes % 60}m`
                : `${focusMinutes}m`}
            </p>
          </div>
        </div>

        {/* Weekly Output */}
        <div>
          <p className="text-[0.6rem] font-[500] text-[#a0a6ab] ml-3 mb-[0.3rem]">
            Weekly Output
          </p>

          <div className="relative h-[2.6rem] w-[25rem] overflow-hidden rounded-full border border-white">
            <div
              className="absolute inset-y-0 left-0 bg-[#72e1ee]"
              style={{ width: `${weeklyGoalAverage}%` }}
            />
            <div
              className="absolute inset-y-0 right-0"
              style={{
                width: `${100 - weeklyGoalAverage}%`,
                backgroundImage:
                  "repeating-linear-gradient(135deg, rgba(255,255,255,0.95) 0px, rgba(255,255,255,0.95) 2px, transparent 2px, transparent 8px)",
              }}
            />
            <p className="relative z-10 flex h-full items-center justify-center text-[#161c22] text-[0.9rem] font-extralight">
              {weeklyGoalAverage}%
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-row items-center gap-[2.8rem]">
        {/* Day Streak */}
        <div className="flex flex-col items-center justify-center">
          <p className="text-[3.8rem] leading-none font-[200] text-[#161c22]">
            {currentStreak}
          </p>

          <p className="text-[0.6rem] leading-none font-[500] text-[#a0a6ab] mt-[0.3rem]">
            Day Streak
          </p>
        </div>

        {/* Active Habits */}
        <div className="flex flex-col items-center justify-center">
          <p className="text-[3.8rem] leading-none font-[200] text-[#161c22]">
            {totalHabits}
          </p>

          <p className="text-[0.6rem] leading-none font-[500] text-[#a0a6ab] mt-[0.3rem]">
            Active Habits
          </p>
        </div>

        {/* Pomodoros */}
        <div className="flex flex-col items-center justify-center">
          <p className="text-[3.8rem] leading-none font-[200] text-[#161c22]">
            {completedPomodoros}
          </p>

          <p className="text-[0.6rem] leading-none font-[500] text-[#a0a6ab] mt-[0.3rem]">
            Pomodoros
          </p>
        </div>
      </div>
    </div>
  );
}

export default StatsBar;
