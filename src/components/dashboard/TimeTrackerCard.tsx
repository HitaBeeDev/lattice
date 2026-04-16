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

const BTN =
  "cursor-pointer rounded-full bg-white p-[0.6rem] text-[#0a1929] transition-all duration-300 hover:bg-[#f4f5f5] disabled:opacity-50";

// ── Sub-components ──────────────────────────────────────────────────────────

type TimerEditPanelProps = {
  editMinutes: string;
  editError: string;
  onMinutesChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

function TimerEditPanel({
  editMinutes,
  editError,
  onMinutesChange,
  onSave,
  onCancel,
}: TimerEditPanelProps) {
  return (
    <div className="pointer-events-auto mt-3 flex w-[9rem] flex-col items-center gap-2">
      <input
        type="number"
        min={1}
        max={99}
        value={editMinutes}
        onChange={(event) => onMinutesChange(event.target.value)}
        className="w-full rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-center text-[0.85rem] text-[#161c22] outline-none transition-all duration-300 focus:border-[#72e1ee]"
        aria-label="Timer minutes"
      />
      {editError ? (
        <p className="text-[0.65rem] leading-none text-[#b14b4b]">{editError}</p>
      ) : null}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSave}
          aria-label="Save timer"
          className="cursor-pointer rounded-full bg-white p-[0.5rem] text-[#0a1929] transition-all duration-300 hover:bg-[#f4f5f5]"
        >
          <Check className="w-4 h-4" strokeWidth={1.25} />
        </button>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel editing timer"
          className="cursor-pointer rounded-full bg-white p-[0.5rem] text-[#0a1929] transition-all duration-300 hover:bg-[#f4f5f5]"
        >
          <X className="w-4 h-4" strokeWidth={1.25} />
        </button>
      </div>
    </div>
  );
}

type TimerControlsProps = {
  isTimerActive: boolean;
  totalSeconds: number;
  isEditing: boolean;
  onStart: () => void;
  onPause: () => void;
  onComplete: () => void;
  onToggleEdit: () => void;
  onReset: () => void;
};

function TimerControls({
  isTimerActive,
  totalSeconds,
  isEditing,
  onStart,
  onPause,
  onComplete,
  onToggleEdit,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="flex flex-row items-center justify-between mt-auto">
      <div className="flex flex-row items-center gap-2">
        <button
          type="button"
          onClick={isTimerActive ? undefined : onStart}
          aria-label={isTimerActive ? "Timer running" : "Start timer"}
          className={BTN}
          disabled={isTimerActive}
        >
          <Play className="w-[0.9rem] h-[0.9rem]" strokeWidth={1.25} />
        </button>
        <button
          type="button"
          onClick={onPause}
          aria-label="Pause timer"
          className={BTN}
          disabled={!isTimerActive}
        >
          <Pause className="w-[0.9rem] h-[0.9rem]" strokeWidth={1.25} />
        </button>
        <button
          type="button"
          onClick={onComplete}
          aria-label="Finish timer"
          className={BTN}
          disabled={totalSeconds <= 0}
        >
          <Square className="w-[0.9rem] h-[0.9rem]" strokeWidth={1.25} />
        </button>
      </div>

      <div className="flex flex-row items-center gap-2">
        <button
          type="button"
          onClick={onToggleEdit}
          aria-label={isEditing ? "Cancel editing timer" : "Edit timer"}
          className={BTN}
        >
          <Pencil className="w-[0.9rem] h-[0.9rem]" strokeWidth={1.25} />
        </button>
        <button type="button" onClick={onReset} aria-label="Reset timer" className={BTN}>
          <RotateCw className="w-[0.9rem] h-[0.9rem]" strokeWidth={1.25} />
        </button>
      </div>
    </div>
  );
}

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
    maxSeconds === 0 ? 0 : (1 - totalSeconds / maxSeconds) * liveTimerCircumference;
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
    if (!isEditing) return;
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
        <div className="relative h-[12rem] w-[12rem] pointer-events-none">
          <svg
            viewBox="0 0 140 140"
            className="absolute inset-0 w-full h-full -rotate-90"
            aria-label={`${sessionLabel} — ${liveTimerDisplay} remaining`}
          >
            <circle cx="70" cy="70" r={liveTimerRadius + 3} fill="none" stroke="#a0a6ab" strokeWidth="0.5" strokeDasharray="4 4" />
            <circle cx="70" cy="70" r={liveTimerRadius - 3} fill="none" stroke="#a0a6ab" strokeWidth="0.5" strokeDasharray="4 4" />
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
              <TimerEditPanel
                editMinutes={editMinutes}
                editError={editError}
                onMinutesChange={(value) => {
                  setEditMinutes(value);
                  if (editError) setEditError("");
                }}
                onSave={handleSaveEditedTime}
                onCancel={handleToggleEdit}
              />
            ) : null}
          </div>
        </div>
      </div>

      <TimerControls
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
