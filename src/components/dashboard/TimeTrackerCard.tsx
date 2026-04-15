import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Pause,
  Pencil,
  Play,
  RotateCw,
  Square,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTimeTracker } from "../../context/TimeTrackerContext";
import { timerSchema } from "../../lib/timerSchema";

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
    isEditing,
    sessionType,
    handleStart,
    handlePause,
    handleComplete,
    handleReset,
    handleUpdateTime,
    toggleEdit,
  } = useTimeTracker();
  const [editMinutes, setEditMinutes] = useState<string>("");
  const [editError, setEditError] = useState<string>("");

  const liveTimerMinutes = Math.floor(totalSeconds / 60);
  const liveTimerSecs = totalSeconds % 60;
  const liveTimerDisplay = `${liveTimerMinutes}:${String(liveTimerSecs).padStart(2, "0")}`;
  const liveTimerRadius = 44;
  const liveTimerCircumference = 2 * Math.PI * liveTimerRadius;
  const liveTimerStrokeOffset =
    maxSeconds === 0
      ? 0
      : (1 - totalSeconds / maxSeconds) * liveTimerCircumference;
  const sessionLabel = SESSION_TYPE_LABELS[sessionType] ?? "Work time";

  const handleToggleEdit = (): void => {
    if (!isEditing) {
      setEditMinutes(String(Math.floor(totalSeconds / 60)));
    } else {
      setEditError("");
    }

    toggleEdit();
  };

  const handleSaveEditedTime = (): void => {
    const parsedMinutes = timerSchema.safeParse({ minutes: editMinutes });

    if (!parsedMinutes.success) {
      setEditError(parsedMinutes.error.issues[0]?.message ?? "Invalid time");
      return;
    }

    setEditError("");
    handleUpdateTime(parsedMinutes.data.minutes);
  };

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    setEditMinutes(String(Math.floor(totalSeconds / 60)));
    setEditError("");
  }, [isEditing, totalSeconds]);

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
        <div className="fixed h-[12rem] w-[12rem] pointer-events-none">
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

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
            <p className="text-[1.8rem] font-light leading-none tracking-[-0.04em] text-[#161c22]">
              {liveTimerDisplay}
            </p>

            {isEditing ? (
              <div className="pointer-events-auto mt-3 flex w-[9rem] flex-col items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={editMinutes}
                  onChange={(event) => {
                    setEditMinutes(event.target.value);
                    if (editError) {
                      setEditError("");
                    }
                  }}
                  className="w-full rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-center text-[0.85rem] text-[#161c22] outline-none transition-all duration-300 focus:border-[#72e1ee]"
                  aria-label="Timer minutes"
                />

                {editError ? (
                  <p className="text-[0.65rem] leading-none text-[#b14b4b]">
                    {editError}
                  </p>
                ) : null}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveEditedTime}
                    aria-label="Save timer"
                    className="cursor-pointer rounded-full bg-white p-[0.5rem] text-[#0a1929] transition-all duration-300 hover:bg-[#f4f5f5]"
                  >
                    <Check className="w-4 h-4" strokeWidth={1.25} />
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleEdit}
                    aria-label="Cancel editing timer"
                    className="cursor-pointer rounded-full bg-white p-[0.5rem] text-[#0a1929] transition-all duration-300 hover:bg-[#f4f5f5]"
                  >
                    <X className="w-4 h-4" strokeWidth={1.25} />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between mt-auto">
        <div className="flex flex-row items-center gap-2">
          <button
            type="button"
            onClick={isTimerActive ? undefined : handleStart}
            aria-label={isTimerActive ? "Timer running" : "Start timer"}
            className="cursor-pointer rounded-full bg-white p-[0.6rem] text-[#0a1929] transition-all duration-300 hover:bg-[#f4f5f5] disabled:opacity-50"
            disabled={isTimerActive}
          >
            <Play className="w-[0.9rem] h-[0.9rem]" strokeWidth={1.25} />
          </button>

          <button
            type="button"
            onClick={handlePause}
            aria-label="Pause timer"
            className="cursor-pointer rounded-full bg-white p-[0.6rem] text-[#0a1929] transition-all duration-300 hover:bg-[#f4f5f5] disabled:opacity-50"
            disabled={!isTimerActive}
          >
            <Pause className="w-[0.9rem] h-[0.9rem]" strokeWidth={1.25} />
          </button>

          <button
            type="button"
            onClick={handleComplete}
            aria-label="Finish timer"
            className="cursor-pointer rounded-full bg-white p-[0.6rem] text-[#0a1929] transition-all 
            duration-300 hover:bg-[#f4f5f5] disabled:opacity-50"
            disabled={totalSeconds <= 0}
          >
            <Square className="w-[0.9rem] h-[0.9rem]" strokeWidth={1.25} />
          </button>
        </div>

        <div className="flex flex-row items-center gap-2">
          <button
            type="button"
            onClick={handleToggleEdit}
            aria-label={isEditing ? "Cancel editing timer" : "Edit timer"}
            className="cursor-pointer rounded-full bg-white p-[0.6rem] text-[#0a1929] transition-all duration-300 hover:bg-[#f4f5f5]"
          >
            <Pencil className="w-[0.9rem] h-[0.9rem]" strokeWidth={1.25} />
          </button>

          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset timer"
            className="cursor-pointer rounded-full bg-white p-[0.6rem] text-[#0a1929] transition-all duration-300 hover:bg-[#f4f5f5]"
          >
            <RotateCw className="w-[0.9rem] h-[0.9rem]" strokeWidth={1.25} />
          </button>
        </div>
      </div>
    </div>
  );
}
