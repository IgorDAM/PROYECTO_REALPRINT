import { useEffect } from "react";
import Button from "./Button";

export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`bg-white relative w-full ${sizes[size]} rounded-xl sm:rounded-2xl shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-surface-200 sticky top-0 bg-white z-10">
          <h3 className="text-lg sm:text-xl font-bold text-surface-900">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-surface-100 hover:bg-surface-200 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-surface-600 text-xl sm:text-2xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 text-surface-700">{children}</div>
      </div>
    </div>
  );
}
