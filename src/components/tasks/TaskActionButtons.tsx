import { memo } from "react";
import { PencilLine, Trash2 } from "lucide-react";

type TaskActionButtonsProps = {
  taskName: string;
  onEdit: () => void;
  onDelete: () => void;
};

function TaskActionButtons({ taskName, onEdit, onDelete }: TaskActionButtonsProps) {
  return (
    <div className="flex w-12 items-center justify-end gap-3 opacity-0 transition group-hover:opacity-100">
      <button
        type="button"
        aria-label={`Edit ${taskName}`}
        onClick={onEdit}
        className="text-[#a0a5ab] transition hover:text-[#161c22]"
      >
        <PencilLine className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        aria-label={`Delete ${taskName}`}
        onClick={onDelete}
        className="text-[#ef4444] transition"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

const MemoizedTaskActionButtons = memo(TaskActionButtons);

export default MemoizedTaskActionButtons;
