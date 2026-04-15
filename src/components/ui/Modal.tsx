import { useEffect, useId, useRef } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent, ReactNode } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

type ModalProps = {
  children: ReactNode;
  description?: string;
  onClose: () => void;
  open: boolean;
  title: string;
};

export default function Modal({ children, description, onClose, open, title }: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleBackdropKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onClose();
  };

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const focusableItems = dialog?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    focusableItems?.[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) { event.preventDefault(); return; }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("overflow-hidden");

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("overflow-hidden");
      previousFocusRef.current?.focus();
    };
  }, [onClose, open]);

  if (!open) return null;

  return createPortal(
    <div
      aria-label="Close dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm px-4"
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
        className="w-full max-w-md bg-white rounded-[1.5rem] shadow-[0_24px_60px_rgba(0,0,0,0.12)] overflow-hidden"
        onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
      >
        {/* Header */}
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
