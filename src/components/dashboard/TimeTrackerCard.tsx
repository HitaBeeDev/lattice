import { ArrowUpRight, Pause, Play, RotateCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useTimeTracker } from "../../context/TimeTrackerContext";

const SESSION_TYPE_LABELS: Record<string, string> = {
  Pomodoro: "Work time",
  ShortBreak: "Short break",
  LongBreak: "Long break",
};

export default function TimeTrackerCard(): React.ReactElement {
  const {
    totalSeconds,
    maxSeconds,
    isTimerActive,
    sessionType,
    handleStart,
    handlePause,
    handleReset,
  } = useTimeTracker();

  const liveTimerMinutes = Math.floor(totalSeconds / 60);
  const liveTimerSecs = totalSeconds % 60;
  const liveTimerDisplay = `${liveTimerMinutes}:${String(liveTimerSecs).padStart(2, "0")}`;
  const liveTimerRadius = 44;
  const liveTimerCircumference = 2 * Math.PI * liveTimerRadius;
  const liveTimerStrokeOffset =
    maxSeconds === 0 ? 0 : (1 - totalSeconds / maxSeconds) * liveTimerCircumference;
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
        <div className="fixed h-[13.6rem] w-[13.6rem] pointer-events-none">
          <svg
            viewBox="0 0 140 140"
            className="absolute inset-0 w-full h-full -rotate-90"
            aria-label={`${sessionLabel} — ${liveTimerDisplay} remaining`}
          >
            <circle
              cx="70"
              cy="70"
              r={liveTimerRadius + 3}
              fill="none"
              stroke="#a0a6ab"
              strokeWidth="0.5"
              strokeDasharray="4 4"
            />

            <circle
              cx="70"
              cy="70"
              r={liveTimerRadius - 3}
              fill="none"
              stroke="#a0a6ab"
              strokeWidth="0.5"
              strokeDasharray="4 4"
            />

            <circle
              cx="70"
              cy="70"
              r={liveTimerRadius}
              fill="none"
              stroke="#72e1ee"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={liveTimerCircumference}
              strokeDashoffset={liveTimerStrokeOffset}
            />
          </svg>

          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
            <p className="text-[2.4rem] font-light leading-none tracking-[-0.04em] text-[#161c22]">
              {liveTimerDisplay}
            </p>

            <p className="mt-1.5 text-[0.65rem] leading-none text-[#6f757b]">
              {sessionLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between mt-auto">
        <div className="flex flex-row items-center gap-2">
          <button
            type="button"
            onClick={isTimerActive ? undefined : handleStart}
            aria-label={isTimerActive ? "Timer running" : "Start timer"}
            className="cursor-pointer rounded-full bg-white p-[0.65rem] text-[#0a1929] transition-all duration-300 hover:bg-[#f4f5f5] disabled:opacity-50"
            disabled={isTimerActive}
          >
            <Play className="w-4 h-4" strokeWidth={1.25} />
          </button>

          <button
            type="button"
            onClick={handlePause}
            aria-label="Pause timer"
            className="cursor-pointer rounded-full bg-white p-[0.65rem] text-[#0a1929] transition-all duration-300 hover:bg-[#f4f5f5] disabled:opacity-50"
            disabled={!isTimerActive}
          >
            <Pause className="w-4 h-4" strokeWidth={1.25} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleReset}
          aria-label="Reset timer"
          className="cursor-pointer rounded-full bg-white p-[0.65rem] text-[#0a1929] transition-all duration-300 hover:bg-[#f4f5f5]"
        >
          <RotateCw className="w-4 h-4" strokeWidth={1.25} />
        </button>
      </div>
    </div>
  );
}
