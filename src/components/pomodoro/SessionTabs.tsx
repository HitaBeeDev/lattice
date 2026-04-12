import { cn } from "../ui";
import { useTimeTracker } from "../../context/TimeTrackerContext";

const SESSION_LABELS = [
  { label: "Pomodoro", value: "Pomodoro" },
  { label: "Short Break", value: "ShortBreak" },
  { label: "Long Break", value: "LongBreak" },
] as const;

function SessionTabs() {
  const { handleSessionChange, sessionType } = useTimeTracker();

  return (
    <div className="inline-flex flex-wrap gap-2 rounded-[1.8rem] border border-black/10 bg-white/65 p-2">
      {SESSION_LABELS.map((session) => {
        const isActive = sessionType === session.value;

        return (
          <button
            key={session.value}
            className={cn(
              "rounded-[1.1rem] px-4 py-2 text-sm font-medium transition duration-200",
              isActive
                ? "bg-slate-950 text-[var(--app-accent)] shadow-lg"
                : "text-slate-600 hover:bg-black/5 hover:text-slate-950"
            )}
            onClick={() => handleSessionChange(session.value)}
            type="button"
          >
            {session.label}
          </button>
        );
      })}
    </div>
  );
}

export default SessionTabs;
