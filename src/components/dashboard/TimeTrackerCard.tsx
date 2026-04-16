import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTimeTracker } from "../../context/TimeTrackerContext";
import { useTimerEdit } from "../../hooks/useTimerEdit";
import TimerRing from "./TimerRing";
import TimerCardControls from "./TimerCardControls";
import { TIMER_CIRCUMFERENCE } from "./timerRingConstants";

const SESSION_TYPE_LABELS: Record<string, string> = {
  Pomodoro: "Work time",
  ShortBreak: "Short break",
  LongBreak: "Long break",
};

// ── Main component ───────────────────────────────────────────────────────────

export default function TimeTrackerCard(): React.ReactElement {
  const {
    totalSeconds,
    maxSeconds,
    isTimerActive,
    isEditing,
    sessionType,
    handleStart,
    handlePause,
    handleComplete,
    handleReset,
  } = useTimeTracker();

  const { editMinutes, editError, setEditMinutes, handleToggleEdit, handleSaveEditedTime } =
    useTimerEdit();

  const liveTimerMinutes = Math.floor(totalSeconds / 60);
  const liveTimerSecs = totalSeconds % 60;
  const liveTimerDisplay = `${liveTimerMinutes}:${String(liveTimerSecs).padStart(2, "0")}`;
  const strokeOffset =
    maxSeconds === 0 ? 0 : (1 - totalSeconds / maxSeconds) * TIMER_CIRCUMFERENCE;
  const sessionLabel = SESSION_TYPE_LABELS[sessionType] ?? "Work time";

  return (
    <div className="col-span-1 col-start-1 row-span-2 row-start-3 flex h-full w-full flex-col rounded-[1.2rem] bg-[#cee2e9]/40 p-5">
      <div className="flex flex-row items-start justify-between">
        <p className="text-[0.85rem] mt-2 leading-none font-[400] text-[#3d454b]">
          Time Tracker
        </p>
        <Link
          to="/pomodoro"
          className="cursor-pointer rounded-full bg-white p-[0.4rem] transition-all duration-300 hover:bg-[#f4f5f5]"
          aria-label="Open Pomodoro page"
        >
          <ArrowUpRight className="h-6 w-6 text-[#0a1929]" strokeWidth={1.25} />
        </Link>
      </div>

      <div className="flex items-center justify-center flex-1">
        <TimerRing
          display={liveTimerDisplay}
          sessionLabel={sessionLabel}
          strokeOffset={strokeOffset}
          isEditing={isEditing}
          editMinutes={editMinutes}
          editError={editError}
          onMinutesChange={(value) => {
            setEditMinutes(value);
          }}
          onSave={handleSaveEditedTime}
          onCancel={handleToggleEdit}
        />
      </div>

      <TimerCardControls
        isTimerActive={isTimerActive}
        totalSeconds={totalSeconds}
        isEditing={isEditing}
        onStart={handleStart}
        onPause={handlePause}
        onComplete={handleComplete}
        onToggleEdit={handleToggleEdit}
        onReset={handleReset}
      />
    </div>
  );
}
