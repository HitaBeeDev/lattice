import { mockDashboardMonth } from "../lib/mockDashboardMonth";
import { ArrowUpRight, Pause, Play, RotateCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import StatsBar from "../components/dashboard/StatsBar";
import CalendarCard from "../components/dashboard/CalendarCard";
import ProgressCard from "../components/dashboard/ProgressCard";
import { useTimeTracker } from "../context/TimeTrackerContext";
const WEEKLY_OUTPUT_TARGET_MINUTES = 3200;

const formatFocusLabel = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
};

const calculateHabitStreak = (completionDays: boolean[]): number => {
  let streak = 0;

  for (let index = completionDays.length - 1; index >= 0; index -= 1) {
    if (!completionDays[index]) {
      break;
    }

    streak += 1;
  }

  return streak;
};

const SESSION_TYPE_LABELS: Record<string, string> = {
  Pomodoro: "Work time",
  ShortBreak: "Short break",
  LongBreak: "Long break",
};

const getLocalIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function DashboardPage() {
  const navigate = useNavigate();
  const {
    totalSeconds: liveTimerSeconds,
    maxSeconds: liveTimerMax,
    isTimerActive,
    sessionType,
    handleStart,
    handlePause,
    handleReset,
  } = useTimeTracker();

  const liveTimerMinutes = Math.floor(liveTimerSeconds / 60);
  const liveTimerSecs = liveTimerSeconds % 60;
  const liveTimerDisplay = `${liveTimerMinutes}:${String(liveTimerSecs).padStart(2, "0")}`;
  const liveTimerRadius = 44;
  const liveTimerCircumference = 2 * Math.PI * liveTimerRadius;
  const liveTimerStrokeOffset =
    liveTimerMax === 0
      ? 0
      : (1 - liveTimerSeconds / liveTimerMax) * liveTimerCircumference;
  const sessionLabel = SESSION_TYPE_LABELS[sessionType] ?? "Work time";
  const realTodayDate = getLocalIsoDate(new Date());

  const activeWeek =
    mockDashboardMonth.weeks.find((week) =>
      week.days.some((day) => day.date === realTodayDate),
    ) ?? mockDashboardMonth.weeks[mockDashboardMonth.weeks.length - 1];
  const selectedDay =
    activeWeek.days.find((day) => day.date === realTodayDate) ??
    activeWeek.days[0];

  const totalTodayTasks = selectedDay.todos.length;
  const completedTodayTasks = selectedDay.todos.filter(
    (todo) => todo.done,
  ).length;
  const completedHabitsToday = selectedDay.habits.filter(
    (habit) => habit.completed,
  ).length;
  const totalDailyHabits = selectedDay.habits.length;
  const habitPct =
    totalDailyHabits === 0
      ? 0
      : Math.round((completedHabitsToday / totalDailyHabits) * 100);
  const focusMinutes = selectedDay.focusTimeMinutes;
  const sampleFocusHours = formatFocusLabel(focusMinutes);

  const focusChartData = activeWeek.days.map((day) => {
    const focusTimeMinutes = day.focusTimeMinutes;
    const isFuture = day.date > realTodayDate;

    return {
      day: day.day.slice(0, 1),
      focusMinutes: focusTimeMinutes,
      label: formatFocusLabel(focusTimeMinutes),
      isToday: day.date === selectedDay.date,
      isMuted: focusTimeMinutes <= 70,
      isFuture,
    };
  });
  const weeklyFocusMinutes = activeWeek.days.reduce(
    (total, day) => total + day.focusTimeMinutes,
    0,
  );
  const weeklyGoalAverage = Math.round(
    Math.min((weeklyFocusMinutes / WEEKLY_OUTPUT_TARGET_MINUTES) * 100, 100),
  );
  const uniqueHabitNames = new Set(
    mockDashboardMonth.weeks.flatMap((week) =>
      week.days.flatMap((day) => day.habits.map((habit) => habit.name)),
    ),
  );
  const completionDays = activeWeek.days.map((day) =>
    day.habits.some((habit) => habit.completed),
  );
  const currentStreak = calculateHabitStreak(completionDays);
  const completedPomodoros = Math.round(weeklyFocusMinutes / 25);

  // #6F757B
  // #72e1ee
  // #f4f9fb

  return (
    <main className="h-full overflow-hidden" id="main-content" tabIndex={-1}>
      <div className="h-full min-w-[1280px] flex flex-col">
        {/* Row 1: Welcome Section */}
        <div className="mt-2">
          <p className="font-['Inter'] font-[300] text-[2.1rem] text-[#060a0f]">
            Welcome in, {mockDashboardMonth.name}
          </p>
        </div>

        {/* Stats Bar */}
        <StatsBar
          completedTodayTasks={completedTodayTasks}
          totalTodayTasks={totalTodayTasks}
          completedHabitsToday={completedHabitsToday}
          totalDailyHabits={totalDailyHabits}
          habitPct={habitPct}
          focusMinutes={focusMinutes}
          weeklyGoalAverage={weeklyGoalAverage}
          currentStreak={currentStreak}
          totalHabits={uniqueHabitNames.size}
          completedPomodoros={completedPomodoros}
        />

        {/* Content Grid */}
        <div
          className="grid flex-1 min-h-0 grid-cols-4 gap-3 mt-6"
          style={{ gridTemplateRows: "repeat(4, minmax(0, 1fr))" }}
        >
          <ProgressCard
            sampleFocusHours={sampleFocusHours}
            focusChartData={focusChartData}
          />

          <CalendarCard
            activeWeek={activeWeek}
            weeks={mockDashboardMonth.weeks}
            todayDate={realTodayDate}
            multiDayTasks={[]}
          />

          <div className="w-full h-full col-span-1 col-start-4 row-span-4 row-start-1 rounded-[1.2rem] bg-[#cee2e9]/40">
            x
          </div>

          {/* Time Tracker Card */}
          <div className="col-span-1 col-start-1 row-span-2 row-start-3 flex h-full w-full flex-col rounded-[1.2rem] bg-[#cee2e9]/40 p-5">
            <div className="flex flex-row items-start justify-between">
              <p className="text-[0.85rem] mt-2 leading-none font-[400] text-[#3d454b]">
                Time Tracker
              </p>

              <Link
                to="/pomodoro"
                className="cursor-pointer rounded-full bg-white p-[0.4rem] transition-all duration-300
               hover:bg-[#f4f5f5]"
                aria-label="Open Pomodoro page"
              >
                <ArrowUpRight
                  className="h-6 w-6 text-[#0a1929]"
                  strokeWidth={1.25}
                />
              </Link>
            </div>

            <div className="flex items-center justify-center flex-1">
              <div className="fixed h-[13.6rem] w-[13.6rem] pointer-events-none">
                {/* SVG BACKGROUND */}
                <svg
                  viewBox="0 0 140 140"
                  className="absolute inset-0 w-full h-full -rotate-90"
                  aria-label={`${sessionLabel} — ${liveTimerDisplay} remaining`}
                >
                  {/* OUTER DASH */}
                  <circle
                    cx="70"
                    cy="70"
                    r={liveTimerRadius + 3}
                    fill="none"
                    stroke="#a0a6ab"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                  />

                  {/* INNER DASH */}
                  <circle
                    cx="70"
                    cy="70"
                    r={liveTimerRadius - 3}
                    fill="none"
                    stroke="#a0a6ab"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                  />

                  <circle
                    cx="70"
                    cy="70"
                    r={liveTimerRadius}
                    fill="none"
                    stroke="#72e1ee"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={liveTimerCircumference}
                    strokeDashoffset={liveTimerStrokeOffset}
                  />
                </svg>

                {/* CENTER TEXT */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                  <p className="text-[2.4rem] font-light leading-none tracking-[-0.04em] text-[#161c22]">
                    {liveTimerDisplay}
                  </p>

                  <p className="mt-1.5 text-[0.65rem] leading-none text-[#6f757b]">
                    {sessionLabel}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-between mt-auto">
              <div className="flex flex-row items-center gap-2">
                <button
                  type="button"
                  onClick={isTimerActive ? undefined : handleStart}
                  aria-label={isTimerActive ? "Timer running" : "Start timer"}
                  className="cursor-pointer rounded-full bg-white p-[0.65rem] text-[#0a1929] transition-all duration-300 hover:bg-[#f4f5f5] disabled:opacity-50"
                  disabled={isTimerActive}
                >
                  <Play className="w-4 h-4" strokeWidth={1.25} />
                </button>

                <button
                  type="button"
                  onClick={handlePause}
                  aria-label="Pause timer"
                  className="cursor-pointer rounded-full bg-white p-[0.65rem] text-[#0a1929] transition-all duration-300 hover:bg-[#f4f5f5] disabled:opacity-50"
                  disabled={!isTimerActive}
                >
                  <Pause className="w-4 h-4" strokeWidth={1.25} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleReset}
                aria-label="Reset timer"
                className="cursor-pointer rounded-full bg-white p-[0.65rem] text-[#0a1929] transition-all duration-300 hover:bg-[#f4f5f5]"
              >
                <RotateCw className="w-4 h-4" strokeWidth={1.25} />
              </button>
            </div>
          </div>

          <div className="w-full h-full col-span-2 row-span-1 row-start-4 rounded-[1.2rem] bg-[#cee2e9]/40">
            z
          </div>
        </div>
      </div>
    </main>
  );
}

export default DashboardPage;
