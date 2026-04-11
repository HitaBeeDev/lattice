import SessionTabs from "../components/TimeTracker/SessionTabs";
import TimerCircle from "../components/TimeTracker/TimerCircle";
import TimerButtons from "../components/TimeTracker/TimerButtons";
import TimerArticles from "../components/TimeTracker/TimerArticles";

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
