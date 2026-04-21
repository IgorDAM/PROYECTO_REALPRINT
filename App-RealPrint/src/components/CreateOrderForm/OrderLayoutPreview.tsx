interface OrderLayoutPreviewProps {
  fileUrls?: string[];
  quantity?: number;
  linearMeters?: number;
  spacingCm?: number;
  materialWidthCm?: number;
  className?: string;
}

function formatFileLabel(fileUrl: string, index: number) {
  const cleanName = fileUrl.split('/').pop() || fileUrl;
  return cleanName || `Archivo ${index + 1}`;
}

export function OrderLayoutPreview({
  fileUrls = [],
  quantity = 1,
  linearMeters = 1,
  spacingCm = 0,
  materialWidthCm = 60,
  className = '',
}: OrderLayoutPreviewProps) {
  const safeQuantity = Math.max(1, Number(quantity) || 1);
  const safeLinearMeters = Math.max(0, Number(linearMeters) || 0);
  const safeSpacingCm = Math.max(0, Number(spacingCm) || 0);
  const totalLinearMetersRaw =
    safeLinearMeters * safeQuantity +
    (safeQuantity > 1 ? ((safeQuantity - 1) * safeSpacingCm) / 100 : 0);
  const visibleUnits = Math.min(safeQuantity, 6);
  const visibleFiles = fileUrls.slice(0, visibleUnits);
  const hiddenUnits = safeQuantity - visibleUnits;
  const unitShare = totalLinearMetersRaw > 0 ? (safeLinearMeters / totalLinearMetersRaw) * 100 : 100;
  const gapShare = totalLinearMetersRaw > 0 ? ((safeSpacingCm / 100) / totalLinearMetersRaw) * 100 : 0;

  return (
    <section className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm ${className}`.trim()}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Vista previa del paño</h3>
          <p className="text-xs text-slate-500">Disposición estimada en un panel de 60 × 100 cm.</p>
        </div>
        <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
          Ancho fijo: {materialWidthCm} cm
        </div>
      </div>

      <div
        className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-inner"
        style={{ aspectRatio: '60 / 100' }}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-3 py-2 text-[11px] font-medium text-slate-600">
          <span>60 cm</span>
          <span>100 cm</span>
        </div>

        <div className="flex h-[calc(100%-2rem)] flex-col gap-2 p-3">
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
            Cada bloque representa una unidad del pedido. La separación se muestra entre bloques.
          </div>

          <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
            <div className="flex h-full flex-col gap-2 overflow-hidden">
              {visibleFiles.map((fileUrl, index) => (
                <div
                  key={`${fileUrl}-${index}`}
                  className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-900 shadow-sm"
                  style={{ flex: `${Math.max(unitShare, 6)} 1 0` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold leading-tight">Unidad {index + 1}</p>
                      <p className="truncate text-[11px] text-orange-800">{formatFileLabel(fileUrl, index)}</p>
                    </div>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-orange-700 ring-1 ring-orange-200">
                      {safeLinearMeters.toFixed(2)} m
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-orange-200">
                    <div
                      className="h-full rounded-full bg-orange-500"
                      style={{ width: `${Math.max(20, Math.min(100, unitShare))}%` }}
                    />
                  </div>
                </div>
              ))}

              {safeSpacingCm > 0 && visibleFiles.length > 1 ? (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-1 text-center text-[11px] text-slate-500">
                  Separación estimada: {safeSpacingCm} cm entre unidades
                </div>
              ) : null}

              {hiddenUnits > 0 ? (
                <div className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-center text-[11px] text-slate-600">
                  +{hiddenUnits} unidad{hiddenUnits > 1 ? 'es' : ''} adicional{hiddenUnits > 1 ? 'es' : ''}
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl bg-slate-900 px-3 py-2 text-[11px] text-white">
            <div className="flex items-center justify-between gap-2">
              <span>Metros lineales totales</span>
              <strong>{totalLinearMetersRaw.toFixed(2)} m</strong>
            </div>
            <div className="mt-1 flex items-center justify-between gap-2 text-white/80">
              <span>{safeQuantity} unidad{safeQuantity > 1 ? 'es' : ''}</span>
              <span>{safeSpacingCm > 0 ? `${safeSpacingCm} cm de separación` : 'Sin separación'}</span>
            </div>
            {visibleFiles.length ? (
              <p className="mt-1 truncate text-white/70">
                Archivos: {visibleFiles.map((fileUrl) => formatFileLabel(fileUrl, 0)).join(' • ')}
              </p>
            ) : null}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-lg border border-slate-200/70 bg-white/80 px-3 py-1 text-[10px] text-slate-500 backdrop-blur">
          Visual orientativa para validar cantidad, orden de archivos y separación.
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-3">
        <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200">
          <span className="block text-[10px] uppercase tracking-wide text-slate-400">Cantidad</span>
          <strong className="text-slate-900">{safeQuantity}</strong>
        </div>
        <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200">
          <span className="block text-[10px] uppercase tracking-wide text-slate-400">Metros por unidad</span>
          <strong className="text-slate-900">{safeLinearMeters.toFixed(2)} m</strong>
        </div>
        <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200">
          <span className="block text-[10px] uppercase tracking-wide text-slate-400">Separación</span>
          <strong className="text-slate-900">{safeSpacingCm.toFixed(1)} cm</strong>
        </div>
      </div>
    </section>
  );
}

