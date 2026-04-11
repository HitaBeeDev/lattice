import SessionTabs from "./SessionTabs";
import TimerCircle from "./TimerCircle";
import TimerButtons from "./TimerButtons";
import TimerArticles from "./TimerArticles";

function TimeTrackerPage() {
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
    </div>);

}

export default TimeTrackerPage;
