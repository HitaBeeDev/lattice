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

  const { todayFocusSeconds, completedPomodoros, totalSeconds, maxSeconds } = useTimeTracker();
  const todayLabel = formatTodayLabel();
  const progressPct =
    maxSeconds === 0 ? 0 : Math.round(((maxSeconds - totalSeconds) / maxSeconds) * 100);

  return (
    <main className="flex w-full h-[calc(100%-7rem)] mt-[7rem] overflow-hidden" id="main-content">
      <section className="grid w-full h-full grid-cols-3 gap-3">
        <PomodoroSidebar
          todayLabel={todayLabel}
          todayFocusSeconds={todayFocusSeconds}
          completedPomodoros={completedPomodoros}
          progressPct={progressPct}
        />

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
