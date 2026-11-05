import { useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";
import Modal from "../components/ui/Modal";

interface ConfirmOptions {
  title?: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
}

/**
 * Sustituto accesible de window.confirm.
 *
 * Uso:
 *   const { confirm, confirmDialog } = useConfirm();
 *   if (!(await confirm({ message: "..." }))) return;
 *   ...
 *   return (<div>... {confirmDialog}</div>);
 */
export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const settle = useCallback((value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    setOptions(null);
  }, []);

  const confirm = useCallback(
    (opts: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setOptions(opts);
      }),
    [],
  );

  const confirmDialog = (
    <Modal
      isOpen={options !== null}
      onClose={() => settle(false)}
      title={options?.title ?? "Confirmar acción"}
      size="sm"
    >
      <p className="text-surface-700">{options?.message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => settle(false)}
          className="px-4 py-2 rounded-lg bg-surface-100 text-surface-700 font-medium hover:bg-surface-200 transition-colors"
        >
          {options?.cancelLabel ?? "Cancelar"}
        </button>
        <button
          type="button"
          onClick={() => settle(true)}
          className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
        >
          {options?.confirmLabel ?? "Eliminar"}
        </button>
      </div>
    </Modal>
  );

  return { confirm, confirmDialog };
}
