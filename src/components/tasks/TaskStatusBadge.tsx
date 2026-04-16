import { Check } from "lucide-react";
import { cn } from "../ui/cn";

type TaskStatusBadgeProps = {
  isCompleted: boolean;
  isInProgress: boolean;
  inputId: string;
  taskName: string;
  onMarkInProgress: () => void;
};

export default function TaskStatusBadge({
  isCompleted,
  isInProgress,
  inputId,
  taskName,
  onMarkInProgress,
}: TaskStatusBadgeProps) {
  return (
    <label
      htmlFor={inputId}
      className={cn(
        "flex items-center gap-2 rounded-full border px-2.5 py-1 text-[0.65rem] transition",
        isCompleted
          ? "cursor-not-allowed border-[#eef2f4] bg-[#f8fafb] text-[#c0c7cc]"
          : isInProgress
            ? "border-[#161c22] bg-[#161c22] text-white"
            : "cursor-pointer border-[#dde4e8] bg-white text-[#7b858c] hover:border-[#b0bec5]",
      )}
    >
      <input
        id={inputId}
        type="checkbox"
        checked={isInProgress}
        onChange={onMarkInProgress}
        disabled={isCompleted}
        className="sr-only"
        aria-label={`Mark ${taskName} as in progress`}
      />
      <span
        className={cn(
          "flex h-3.5 w-3.5 items-center justify-center rounded-full border transition",
          isCompleted
            ? "border-[#d9e0e4]"
            : isInProgress
              ? "border-white/30 bg-white/10"
              : "border-[#cfd8dd] bg-transparent",
        )}
        aria-hidden="true"
      >
        {isInProgress ? <Check className="h-2.5 w-2.5" /> : null}
      </span>
      <span>{isCompleted ? "Done" : "In progress"}</span>
    </label>
  );
}
