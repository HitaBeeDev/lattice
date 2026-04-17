import { useEffect } from "react";
import { useTimeTracker } from "../context/TimeTrackerContext";
import SessionTabs from "../components/pomodoro/SessionTabs";
import TimerCircle from "../components/pomodoro/TimerCircle";
import TimerButtons from "../components/pomodoro/TimerButtons";
import PomodoroSidebar from "../components/pomodoro/PomodoroSidebar";

const formatTodayLabel = (): string =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

// ── Page component ───────────────────────────────────────────────────────────

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
      className="mt-[7rem] flex h-[calc(100%-7rem)] w-full overflow-y-auto pb-6 xl:overflow-hidden"
      id="main-content"
    >
      <section className="grid h-full w-full grid-cols-1 gap-3 xl:grid-cols-3">
        <PomodoroSidebar
          todayLabel={todayLabel}
          todayFocusSeconds={todayFocusSeconds}
          completedPomodoros={completedPomodoros}
          progressPct={progressPct}
        />

        <div className="flex flex-col rounded-[1.7rem] bg-white p-6 md:p-8 xl:col-span-2">
          <SessionTabs />
          <TimerCircle />
          <TimerButtons />
        </div>
      </section>
    </main>
  );
}

export default PomodoroPage;
