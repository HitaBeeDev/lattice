import { useId } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent, ReactNode } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "../../hooks/useFocusTrap";

type ModalProps = {
  children: ReactNode;
  description?: string;
  onClose: () => void;
  open: boolean;
  title: string;
};

// ── Sub-components ──────────────────────────────────────────────────────────

type ModalHeaderProps = {
  title: string;
  titleId: string;
  onClose: () => void;
};

function ModalHeader({ title, titleId, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f5f6]">
      <h2 className="text-[0.9rem] font-[500] text-[#161c22]" id={titleId}>
        {title}
      </h2>
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="text-[#a0a5ab] hover:text-[#161c22] transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function Modal({ children, description, onClose, open, title }: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useFocusTrap(open, onClose);

  const handleBackdropKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <div
      aria-label="Close dialog"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/25 backdrop-blur-sm sm:px-4"
      onClick={onClose}
      onKeyDown={handleBackdropKeyDown}
      role="button"
      tabIndex={0}
    >
      <div
        ref={dialogRef}
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        role="dialog"
        className="w-full max-h-[95dvh] overflow-y-auto sm:max-w-md bg-white rounded-t-[1.5rem] sm:rounded-[1.5rem] shadow-[0_24px_60px_rgba(0,0,0,0.12)] overflow-hidden"
        onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
      >
        <ModalHeader title={title} titleId={titleId} onClose={onClose} />

        {description && (
          <p className="sr-only" id={descriptionId}>
            {description}
          </p>
        )}

        {children}
      </div>
    </div>,
    document.body,
  );
}
