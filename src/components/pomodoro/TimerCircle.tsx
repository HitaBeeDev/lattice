import { useTimeTracker } from "../../context/TimeTrackerContext";
import TimerDisplay from "./TimerDisplay";
import TimerStatsGrid from "./TimerStatsGrid";
import TimerEditForm from "./TimerEditForm";

const TIMER_RADIUS = 80;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;

function TimerCircle() {
  const {
    totalSeconds,
    maxSeconds,
    isEditing,
    handleUpdateTime,
    sessionType,
  } = useTimeTracker();

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const completion = maxSeconds === 0 ? 0 : Math.round((totalSeconds / maxSeconds) * 100);
  const strokeDashoffset = maxSeconds === 0 ? 0 : (totalSeconds / maxSeconds) * TIMER_CIRCUMFERENCE;

  return (
    <div className="flex flex-col flex-1 mb-2">
      <TimerDisplay
        sessionType={sessionType}
        minutes={minutes}
        seconds={seconds}
        radius={TIMER_RADIUS}
        circumference={TIMER_CIRCUMFERENCE}
        strokeDashoffset={strokeDashoffset}
      />

      <div className="mt-2 rounded-[1.2rem] bg-white/80 p-3">
        {isEditing ? (
          <TimerEditForm
            key={`${sessionType}-${totalSeconds}`}
            totalSeconds={totalSeconds}
            onUpdateTime={handleUpdateTime}
          />
        ) : (
          <TimerStatsGrid minutes={minutes} seconds={seconds} completion={completion} />
        )}
      </div>
    </div>
  );
}

export default TimerCircle;
