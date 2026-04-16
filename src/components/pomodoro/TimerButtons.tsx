import { Pause, Pencil, Play, RotateCw, Square } from "lucide-react";
import { useTimeTracker } from "../../context/TimeTrackerContext";
function TimerButtons() {
  const {
    handleStart,
    handlePause,
    handleReset,
    handleComplete,
    toggleEdit,
    isTimerActive,
    totalSeconds,
    isEditing,
  } = useTimeTracker();
  return (
    <div className="flex flex-row items-center justify-center gap-4 mt-auto">
      <button
        onClick={handleStart}
        type="button"
        disabled={isTimerActive}
        className="inline-flex items-center gap-2 rounded-full bg-[#161c22] px-3.5 py-1.5 text-[0.7rem] font-[400] text-white transition hover:bg-[#2a3340] disabled:cursor-not-allowed disabled:opacity-55"
      >
        <Play className="w-3 h-3" strokeWidth={1.7} />
        {isTimerActive ? "Running" : "Start"}
      </button>

      <button
        onClick={handlePause}
        type="button"
        disabled={!isTimerActive}
        className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[0.7rem] font-[400] text-[#161c22] transition hover:bg-[#f4f7f7] disabled:cursor-not-allowed disabled:opacity-45"
      >
        <Pause className="w-3 h-3" strokeWidth={1.7} />
        Pause
      </button>

      <button
        onClick={handleComplete}
        type="button"
        disabled={totalSeconds <= 0}
        className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[0.7rem] font-[400] text-[#161c22] transition hover:bg-[#f4f7f7] disabled:cursor-not-allowed disabled:opacity-45"
      >
        <Square className="w-3 h-3" strokeWidth={1.7} />
        Finish
      </button>

      <button
        onClick={toggleEdit}
        type="button"
        className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[0.7rem] font-[400] text-[#161c22] transition hover:bg-[#f4f7f7]"
      >
        <Pencil className="w-3 h-3" strokeWidth={1.7} />
        {isEditing ? "Cancel" : "Edit"}
      </button>

      <button
        onClick={handleReset}
        type="button"
        className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[0.7rem] font-[400] text-[#161c22] transition hover:bg-[#f4f7f7]"
      >
        <RotateCw className="w-3 h-3" strokeWidth={1.7} />
        Reset
      </button>
    </div>
  );
}
export default TimerButtons;
