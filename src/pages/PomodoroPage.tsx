import { useEffect } from "react";
import SessionTabs from "../components/pomodoro/SessionTabs";
import TimerCircle from "../components/pomodoro/TimerCircle";
import TimerButtons from "../components/pomodoro/TimerButtons";
import TimerArticles from "../components/pomodoro/TimerArticles";

function PomodoroPage() {
  useEffect(() => {
    document.title = "Pomodoro - NexStep";
  }, []);

  return (
    <main className="space-y-8 p-5 sm:p-6 lg:p-8">
      <section
        aria-label="Pomodoro timer"
        className="app-card space-y-6"
      >
        <SessionTabs />

        <TimerCircle />

        <TimerButtons />
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_1fr]">
        <header className="app-panel-dark relative overflow-hidden p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(217,242,71,0.22),_transparent_30%)]"
          />
          <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-accent)]">
            Focus mode
          </p>
          <h1 className="relative mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
            Pomodoro focus
          </h1>
          <p className="relative mt-2 text-sm leading-6 text-white/65">
            Choose a session, start the timer, and keep your focus visible.
          </p>
        </header>

        <article className="app-card">
          <TimerArticles />
        </article>
      </section>
    </main>
  );
}

export default PomodoroPage;
