import { useTimeTracker } from "../../context/TimeTrackerContext";
const SESSION_LABELS = [
    { label: "Pomodoro", value: "Pomodoro" },
    { label: "Short Break", value: "ShortBreak" },
    { label: "Long Break", value: "LongBreak" },
] as const;
function SessionTabs() {
    const { handleSessionChange } = useTimeTracker();
    return (<div>
      {SESSION_LABELS.map((session) => {
            return (<button key={session.value} onClick={() => handleSessionChange(session.value)} type="button">
            {session.label}
          </button>);
        })}
    </div>);
}
export default SessionTabs;
