import { Check, X } from "lucide-react";
import { TIMER_CIRCUMFERENCE, TIMER_RADIUS } from "./timerRingConstants";

type TimerRingProps = {
  display: string;
  sessionLabel: string;
  strokeOffset: number;
  isEditing: boolean;
  editMinutes: string;
  editError: string;
  onMinutesChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function TimerRing({
  display,
  sessionLabel,
  strokeOffset,
  isEditing,
  editMinutes,
  editError,
  onMinutesChange,
  onSave,
  onCancel,
}: TimerRingProps) {
  return (
    <div className="relative h-[12rem] w-[12rem] pointer-events-none">
      <svg
        viewBox="0 0 140 140"
        className="absolute inset-0 w-full h-full -rotate-90"
        aria-label={`${sessionLabel} — ${display} remaining`}
      >
        <circle cx="70" cy="70" r={TIMER_RADIUS + 3} fill="none" stroke="#a0a6ab" strokeWidth="0.5" strokeDasharray="4 4" />
        <circle cx="70" cy="70" r={TIMER_RADIUS - 3} fill="none" stroke="#a0a6ab" strokeWidth="0.5" strokeDasharray="4 4" />
        <circle cx="70" cy="70" r={TIMER_RADIUS} fill="none" stroke="#72e1ee" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={TIMER_CIRCUMFERENCE} strokeDashoffset={strokeOffset} />
      </svg>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <p className="text-[1.8rem] font-light leading-none tracking-[-0.04em] text-[#161c22]">
          {display}
        </p>
        {isEditing ? (
          <div className="pointer-events-auto mt-3 flex w-[9rem] flex-col items-center gap-2">
            <input
              type="number" min={1} max={99} value={editMinutes}
              onChange={(e) => onMinutesChange(e.target.value)}
              className="w-full rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-center text-[0.85rem] text-[#161c22] outline-none transition-all duration-300 focus:border-[#72e1ee]"
              aria-label="Timer minutes"
            />
            {editError ? <p className="text-[0.65rem] leading-none text-[#b14b4b]">{editError}</p> : null}
            <div className="flex items-center gap-2">
              <button type="button" onClick={onSave} aria-label="Save timer"
                className="cursor-pointer rounded-full bg-white p-[0.5rem] text-[#0a1929] transition-all duration-300 hover:bg-[#f4f5f5]">
                <Check className="w-4 h-4" strokeWidth={1.25} />
              </button>
              <button type="button" onClick={onCancel} aria-label="Cancel editing timer"
                className="cursor-pointer rounded-full bg-white p-[0.5rem] text-[#0a1929] transition-all duration-300 hover:bg-[#f4f5f5]">
                <X className="w-4 h-4" strokeWidth={1.25} />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
