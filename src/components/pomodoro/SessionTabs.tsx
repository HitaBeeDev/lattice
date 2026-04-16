import { useTimeTracker } from "../../context/TimeTrackerContext";
const SESSION_LABELS = [
  { label: "Pomodoro", value: "Pomodoro" },
  { label: "Short Break", value: "ShortBreak" },
  { label: "Long Break", value: "LongBreak" },
] as const;
function SessionTabs() {
  const { handleSessionChange, sessionType } = useTimeTracker();
  return (
    <div className="flex w-full justify-center">
      <div className="inline-flex items-center rounded-full bg-[#eef4f5] p-1">
        {SESSION_LABELS.map((session) => {
          const isActive = sessionType === session.value;
          return (
            <button
              key={session.value}
              onClick={() => handleSessionChange(session.value)}
              type="button"
              className={`rounded-full px-3.5 py-1.5 text-[0.7rem] font-[400] transition ${
                isActive
                  ? "bg-[#161c22] text-white shadow-[0_8px_24px_rgba(22,28,34,0.18)]"
                  : "text-[#66727a] hover:text-[#161c22]"
              }`}
            >
              {session.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
export default SessionTabs;
