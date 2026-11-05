import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";

type ModalSize = "sm" | "md" | "lg" | "xl";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  size?: ModalSize;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Dialogo modal accesible:
 * - role="dialog" + aria-modal + aria-labelledby (lectores de pantalla),
 * - el foco entra al dialogo al abrir, queda atrapado con Tab/Shift+Tab y
 *   vuelve al elemento que lo abrio al cerrar,
 * - Escape y clic en el fondo lo cierran.
 */
export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  // onClose suele llegar como funcion inline: se guarda en una ref para no
  // reiniciar el efecto (y devolver el foco al dialogo) en cada render.
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.focus();

    const getFocusable = () =>
      Array.from(dialog?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;

      const items = getFocusable();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`bg-white relative w-full ${sizes[size]} rounded-xl sm:rounded-2xl shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto focus:outline-none`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-surface-200 sticky top-0 bg-white z-10">
          <h3 id={titleId} className="text-lg sm:text-xl font-bold text-surface-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-surface-100 hover:bg-surface-200 flex items-center justify-center transition-colors flex-shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600"
          >
            <span className="material-symbols-outlined text-surface-600 text-xl sm:text-2xl" aria-hidden="true">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 text-surface-700">{children}</div>
      </div>
    </div>
  );
}
