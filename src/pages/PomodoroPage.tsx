import SessionTabs from "../components/pomodoro/SessionTabs";
import TimerCircle from "../components/pomodoro/TimerCircle";
import TimerButtons from "../components/pomodoro/TimerButtons";
import TimerArticles from "../components/pomodoro/TimerArticles";
function PomodoroPage() {
    return (<main id="main-content" tabIndex={-1}>
      <header>
        <h1>Pomodoro focus</h1>
      </header>
      <section aria-labelledby="pomodoro-timer-heading">
        <header>
          <h2 id="pomodoro-timer-heading">Pomodoro timer</h2>
        </header>
        <SessionTabs />

        <TimerCircle />

        <TimerButtons />
      </section>

      <section aria-labelledby="pomodoro-focus-heading">
        <header>
          <div aria-hidden="true"/>
          <p>
            Focus mode
          </p>
          <h2 id="pomodoro-focus-heading">
            Pomodoro focus
          </h2>
          <p>
            Choose a session, start the timer, and keep your focus visible.
          </p>
        </header>

        <article>
          <TimerArticles />
        </article>
      </section>
    </main>);
}
export default PomodoroPage;
