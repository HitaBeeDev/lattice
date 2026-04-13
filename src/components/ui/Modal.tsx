import { useEffect, useId, useRef } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent, ReactNode } from "react";
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
export default function Modal({ children, description, onClose, open, title, }: ModalProps) {
    const titleId = useId();
    const descriptionId = useId();
    const dialogRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);
    const handleBackdropKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }
        event.preventDefault();
        onClose();
    };
    useEffect(() => {
        if (!open) {
            return;
        }
        previousFocusRef.current = document.activeElement as HTMLElement | null;
        const dialog = dialogRef.current;
        const focusableItems = dialog?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        const firstItem = focusableItems?.[0];
        firstItem?.focus();
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
                return;
            }
            if (event.key !== "Tab" || !dialog) {
                return;
            }
            const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
            if (focusable.length === 0) {
                event.preventDefault();
                return;
            }
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
    if (!open) {
        return null;
    }
    return createPortal(<div aria-label="Close dialog" onClick={onClose} onKeyDown={handleBackdropKeyDown} role="button" tabIndex={0}>
      <div ref={dialogRef} aria-describedby={description ? descriptionId : undefined} aria-labelledby={titleId} aria-modal="true" role="dialog" onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}>
        <div>
          <h2 id={titleId}>
            {title}
          </h2>
          {description && (<p id={descriptionId}>
              {description}
            </p>)}
        </div>
        {children}
      </div>
    </div>, document.body);
}
