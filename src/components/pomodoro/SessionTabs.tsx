import { useTimeTracker } from "../../context/TimeTrackerContext";

function SessionTabs() {
  const { handleSessionChange } = useTimeTracker();

  return (
    <div>
      <button
        onClick={() => handleSessionChange("Pomodoro")}>


        Pomodoro
      </button>

      <button
        onClick={() => handleSessionChange("ShortBreak")}>


        Short Break
      </button>

      <button
        onClick={() => handleSessionChange("LongBreak")}>


        Long Break
      </button>
    </div>);

}

export default SessionTabs;
