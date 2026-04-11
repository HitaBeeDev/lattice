import SessionTabs from "../components/pomodoro/SessionTabs";
import TimerCircle from "../components/pomodoro/TimerCircle";
import TimerButtons from "../components/pomodoro/TimerButtons";
import TimerArticles from "../components/pomodoro/TimerArticles";

function PomodoroPage() {
  return (
    <div>
      <div>
        <SessionTabs />

        <TimerCircle />

        <TimerButtons />
      </div>

      <div>
        <div>
          <p>Pomodoro Focus</p>
          <p>
            Choose a session, start the timer, and keep your focus visible.
          </p>
        </div>

        <div>
          <TimerArticles />
        </div>
      </div>
    </div>
  );
}

export default PomodoroPage;
