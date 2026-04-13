import SessionTabs from "../components/pomodoro/SessionTabs";
import TimerCircle from "../components/pomodoro/TimerCircle";
import TimerButtons from "../components/pomodoro/TimerButtons";
import TimerArticles from "../components/pomodoro/TimerArticles";

function PomodoroPage() {
  return (
    <main className="space-y-8 p-5 sm:p-6 lg:p-8" id="main-content" tabIndex={-1}>
      <header className="sr-only">
        <h1>Pomodoro focus</h1>
      </header>
      <section
        aria-labelledby="pomodoro-timer-heading"
        className="app-card space-y-6"
      >
        <header className="sr-only">
          <h2 id="pomodoro-timer-heading">Pomodoro timer</h2>
        </header>
        <SessionTabs />

        <TimerCircle />

        <TimerButtons />
      </section>

      <section aria-labelledby="pomodoro-focus-heading" className="grid gap-6 xl:grid-cols-[minmax(0,18rem)_1fr]">
        <header className="app-panel-dark relative overflow-hidden p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(217,242,71,0.22),_transparent_30%)]"
          />
          <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-accent)]">
            Focus mode
          </p>
          <h2
            className="relative mt-3 text-3xl font-semibold tracking-[-0.04em] text-white"
            id="pomodoro-focus-heading"
          >
            Pomodoro focus
          </h2>
          <p className="relative mt-2 text-sm leading-6 text-white/80">
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
