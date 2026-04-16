import { memo } from "react";
import { Check } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "../ui/cn";
import type { Task } from "../../types/task";

type TaskItemInfoProps = {
  checkboxId: string;
  isChecked: boolean;
  onToggle: () => void;
  task: Task;
};

function TaskItemInfo({ checkboxId, isChecked, onToggle, task }: TaskItemInfoProps) {
  const shouldReduce = useReducedMotion();

  return (
    <div className="flex min-w-0 flex-1 items-center gap-4">
      <button
        type="button"
        aria-label={`Mark ${task.name} as ${isChecked ? "incomplete" : "complete"}`}
        aria-pressed={isChecked}
        onClick={onToggle}
        className={cn(
          "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition",
          isChecked
            ? "border-[#06090f] bg-[#06090f]"
            : "border-[#dde4e8] hover:border-[#b0bec5]",
        )}
      >
        {isChecked && <Check className="h-3 w-3 text-white" />}
      </button>

      <label htmlFor={checkboxId} className="min-w-0 flex-1 cursor-pointer">
        <input
          id={checkboxId}
          type="checkbox"
          checked={isChecked}
          onChange={onToggle}
          className="sr-only"
        />
        <div className="relative min-w-0">
          <p
            className={cn(
              "truncate text-[0.85rem] font-[500] leading-none transition-colors duration-200",
              isChecked ? "text-[#a0a5ab]" : "text-[#161c22]",
            )}
          >
            {task.name}
          </p>
          <AnimatePresence initial={false}>
            {isChecked && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 my-auto h-px bg-[#a0a5ab]"
                initial={{ scaleX: shouldReduce ? 1 : 0, width: "100%" }}
                animate={{ scaleX: 1, width: "100%" }}
                exit={{ scaleX: shouldReduce ? 1 : 0 }}
                style={{ originX: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>
        </div>
        {task.description ? (
          <p className="mt-1 truncate text-[0.7rem] font-[300] text-[#a0a5ab]">
            {task.description}
          </p>
        ) : null}
      </label>
    </div>
  );
}

const MemoizedTaskItemInfo = memo(TaskItemInfo);

export default MemoizedTaskItemInfo;
