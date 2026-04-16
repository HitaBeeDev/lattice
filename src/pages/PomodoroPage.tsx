import { useEffect } from "react";
import { useTimeTracker } from "../context/TimeTrackerContext";
import SessionTabs from "../components/pomodoro/SessionTabs";
import TimerCircle from "../components/pomodoro/TimerCircle";
import TimerButtons from "../components/pomodoro/TimerButtons";
const formatTodayLabel = (): string =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());
const formatFocusHours = (seconds: number): string => {
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) {
    return `${minutes}m`;
  }
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
};
function PomodoroPage() {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const { todayFocusSeconds, completedPomodoros, totalSeconds, maxSeconds } =
    useTimeTracker();
  const todayLabel = formatTodayLabel();
  const progressPct =
    maxSeconds === 0
      ? 0
      : Math.round(((maxSeconds - totalSeconds) / maxSeconds) * 100);
  return (
    <main
      className="flex w-full h-[calc(100%-7rem)] mt-[7rem] overflow-hidden"
      id="main-content"
    >
      <section className="grid w-full h-full grid-cols-3 gap-3">
        <div className="col-span-1 flex flex-col justify-between rounded-[1.7rem] bg-white p-8">
          <div>
            <p className="text-[0.7rem] leading-none font-[300] text-[#a0a5ab] ml-1 mt-3">
              {todayLabel}
            </p>

            <p className="mt-7 max-w-[10ch] text-[4rem] leading-[0.92] font-[200] tracking-[-0.05em] text-[#161c22]">
              Hold the line on your focus.
            </p>

            <p className="mt-3 max-w-[30rem] text-[0.74rem] leading-5 font-[300] text-[#a0a6ab]">
              Stay in one view, run the timer, and keep today&apos;s output
              visible without scrolling away from the session.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-full rounded-[1rem] bg-[#edfdfe] p-5">
              <p className="text-[0.62rem] font-[500] uppercase tracking-[0.12em] text-[#a0a6ab]">
                Today&apos;s focus
              </p>

              <p className="mt-3 text-[2rem] font-[200] leading-none text-[#161c22]">
                {formatFocusHours(todayFocusSeconds)}
              </p>
            </div>

            <div className="w-full rounded-[1rem] bg-[#161c22] p-5">
              <p className="text-[0.62rem] font-[500] uppercase tracking-[0.12em] text-[#d3d6d9]">
                Pomodoros
              </p>
              <p className="mt-3 text-[2rem] font-[200] leading-none text-white">
                {completedPomodoros}
              </p>
            </div>

            <div className="relative w-full overflow-hidden rounded-[1rem] p-5">
              <div className="absolute inset-0 bg-[#edfdfe]" />
              <div
                className="absolute inset-y-0 left-0 bg-[#72e1ee]"
                style={{ width: `${progressPct}%` }}
              />
              <div
                className="absolute inset-y-0 right-0"
                style={{
                  width: `${100 - progressPct}%`,
                  backgroundImage:
                    "repeating-linear-gradient(135deg, rgba(114,225,238,0.45) 0px, rgba(114,225,238,0.45) 2px, transparent 2px, transparent 8px)",
                }}
              />
              <p className="relative z-10 text-[0.62rem] font-[500] uppercase tracking-[0.12em] text-[#6c90a4]">
                Session progress
              </p>
              <p className="relative z-10 mt-3 text-[2rem] font-[200] leading-none text-[#161c22]">
                {progressPct}%
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-2 flex flex-col rounded-[1.7rem] bg-white p-8">
          <SessionTabs />

          <TimerCircle />

          <TimerButtons />
        </div>
      </section>
    </main>
  );
}
export default PomodoroPage;
