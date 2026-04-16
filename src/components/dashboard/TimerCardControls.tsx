import { Pause, Pencil, Play, RotateCw, Square } from "lucide-react";

const BTN =
  "cursor-pointer rounded-full bg-white p-[0.6rem] text-[#0a1929] transition-all duration-300 hover:bg-[#f4f5f5] disabled:opacity-50";

type TimerCardControlsProps = {
  isTimerActive: boolean;
  totalSeconds: number;
  isEditing: boolean;
  onStart: () => void;
  onPause: () => void;
  onComplete: () => void;
  onToggleEdit: () => void;
  onReset: () => void;
};

export default function TimerCardControls({
  isTimerActive,
  totalSeconds,
  isEditing,
  onStart,
  onPause,
  onComplete,
  onToggleEdit,
  onReset,
}: TimerCardControlsProps) {
  return (
    <div className="flex flex-row items-center justify-between mt-auto">
      <div className="flex flex-row items-center gap-2">
        <button type="button" onClick={isTimerActive ? undefined : onStart}
          aria-label={isTimerActive ? "Timer running" : "Start timer"} className={BTN} disabled={isTimerActive}>
          <Play className="w-[0.9rem] h-[0.9rem]" strokeWidth={1.25} />
        </button>
        <button type="button" onClick={onPause} aria-label="Pause timer" className={BTN} disabled={!isTimerActive}>
          <Pause className="w-[0.9rem] h-[0.9rem]" strokeWidth={1.25} />
        </button>
        <button type="button" onClick={onComplete} aria-label="Finish timer" className={BTN} disabled={totalSeconds <= 0}>
          <Square className="w-[0.9rem] h-[0.9rem]" strokeWidth={1.25} />
        </button>
      </div>
      <div className="flex flex-row items-center gap-2">
        <button type="button" onClick={onToggleEdit}
          aria-label={isEditing ? "Cancel editing timer" : "Edit timer"} className={BTN}>
          <Pencil className="w-[0.9rem] h-[0.9rem]" strokeWidth={1.25} />
        </button>
        <button type="button" onClick={onReset} aria-label="Reset timer" className={BTN}>
          <RotateCw className="w-[0.9rem] h-[0.9rem]" strokeWidth={1.25} />
        </button>
      </div>
    </div>
  );
}
