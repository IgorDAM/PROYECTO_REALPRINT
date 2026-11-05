/** Indicador de carga accesible para Suspense y pantallas que esperan datos. */
export default function LoadingFallback({ label = "Cargando..." }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-surface-500"
    >
      <span
        className="h-8 w-8 animate-spin rounded-full border-4 border-surface-200 border-t-primary-600"
        aria-hidden="true"
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
