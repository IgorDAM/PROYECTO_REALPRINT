/**
 * OrderLayoutPreview.tsx
 * Propósito: Visualización en tiempo real de cómo se distribuyen las unidades en el paño (60×100 cm).
 * 
 * Funcionalidad:
 * - Muestra un paño con las unidades distribuidas usando layout metrics (filas × columnas).
 * - Escala responsive: 100% del ancho, aspect ratio 3:5 (60×100 cm).
 * - Calcula distribución en tiempo real según quantity, spacing y dimensiones.
 * - Muestra información:
 *   • Cálculo de metros lineales (total real + facturable).
 *   • Configuración: cantidad, dimensiones, distribución.
 *   • Unidades ocultas o fuera del área visible si necesario.
 * - Archivos adjuntos con sus dimensiones (cada uno puede tener medidas diferentes).
 * 
 * Referencia: Se alimenta de datos en tiempo real del formulario padre (Step2Details).
 * No modifica datos, solo visualiza. Usa calculateLayoutMetrics de pricing.ts.
 */

import { calculateLayoutMetrics, MATERIAL_WIDTH_CM } from './pricing';

/** Alto material del paño en centímetros (constante de negocio). */
const MATERIAL_HEIGHT_CM = 100;

/** Información de un archivo adjunto al pedido. */
interface FileWithDimensions {
  id: string;
  name: string;
  url?: string;
  widthCm?: number; // Ancho de la unidad en cm
  heightCm?: number; // Alto de la unidad en cm
}

/** Props para OrderLayoutPreview. */
interface OrderLayoutPreviewProps {
  filesWithDimensions?: FileWithDimensions[]; // Archivos + dimensiones por archivo
  quantity?: number; // Cantidad total de unidades
  spacingCm?: number; // Separación entre unidades
  className?: string; // Clases CSS adicionales
}

/** Formatea etiqueta de archivo, truncando si es largo. */
function formatFileLabel(fileUrl: string | undefined, fileName: string, index: number) {
  const name = fileName || fileUrl?.split('/').pop() || `Archivo ${index + 1}`;
  return name.length > 20 ? name.substring(0, 17) + '...' : name;
}

/** Visualiza distribución de unidades en paño 60×100 cm con información de cálculo. */
export function OrderLayoutPreview({
  filesWithDimensions = [],
  quantity = 1,
  spacingCm = 0,
  className = '',
}: OrderLayoutPreviewProps) {
  // Normalizar entradas defensivamente.
  const safeQuantity = Math.max(1, Number(quantity) || 1);
  const safeSpacingCm = Math.max(0, Number(spacingCm) || 0);

  // Validar archivos: solo aquellos con dimensiones positivas.
  const validFiles = filesWithDimensions.filter((file) => Number(file.widthCm) > 0 && Number(file.heightCm) > 0);

  // Usar máxima huella para evitar subestimar con múltiples archivos de tamaños diferentes.
  const unitWidthCm = validFiles.length ? Math.max(...validFiles.map((file) => Number(file.widthCm))) : 0;
  const unitHeightCm = validFiles.length ? Math.max(...validFiles.map((file) => Number(file.heightCm))) : 0;

  // Calcular distribución: cuántas filas/columnas, cuántos metros lineales totales.
  const layout = calculateLayoutMetrics({
    quantity: safeQuantity,
    spacingCm: safeSpacingCm,
    unitWidthCm,
    unitHeightCm,
  });

  // Convertir dimensiones a porcentajes del paño para escala responsive (aspect ratio 3:5).
  const unitWidthPercent = layout.unitWidthCm ? (layout.unitWidthCm / MATERIAL_WIDTH_CM) * 100 : 0;
  const unitHeightPercent = layout.unitHeightCm ? (layout.unitHeightCm / MATERIAL_HEIGHT_CM) * 100 : 0;
  const spacingXPercent = (layout.spacingCm / MATERIAL_WIDTH_CM) * 100;
  const spacingYPercent = (layout.spacingCm / MATERIAL_HEIGHT_CM) * 100;

  const totalHeightPercent = layout.rows * unitHeightPercent + Math.max(0, layout.rows - 1) * spacingYPercent;
  const fitsInCanvas = totalHeightPercent <= 100;

  const visibleRows = unitHeightPercent > 0
    ? Math.max(0, Math.floor((100 + spacingYPercent) / (unitHeightPercent + spacingYPercent)))
    : 0;
  const visibleUnits = Math.min(layout.quantity, layout.unitsPerRow * visibleRows);
  const hiddenUnits = Math.max(0, layout.quantity - visibleUnits);

  return (
    <section className={`rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4 shadow-sm ${className}`.trim()}>
      <div className="mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Vista previa del paño</h3>
          <p className="text-xs text-slate-500">Distribución en panel 60 × 100 cm</p>
        </div>
        <div className="rounded-full bg-white px-2 sm:px-3 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 whitespace-nowrap">
          Total: {layout.billableLinearMeters} m
        </div>
      </div>

      {/* Canvas del paño */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_260px] gap-4">
        <div className="min-w-0">
          <div
            className="relative rounded-lg border-2 border-slate-300 bg-white shadow-inner"
            style={{ aspectRatio: '3 / 5' }}
          >
            {/* Fondo con grid orientativo */}
            <div className="absolute inset-0 opacity-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={`h-${i}`} className="absolute w-full border-b border-slate-300" style={{ top: `${i * 10}%` }} />
              ))}
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`v-${i}`} className="absolute h-full border-r border-slate-300" style={{ left: `${i * 16.67}%` }} />
              ))}
            </div>

            {/* Unidades distribuidas en grid */}
            <div className="absolute inset-0">
              {validFiles.length ? (
                <div className="relative w-full h-full p-1 sm:p-2">
                  {visibleUnits > 0 ? (
                    Array.from({ length: visibleUnits }).map((_, idx) => {
                      const file = validFiles[idx % validFiles.length] || validFiles[0];
                      // Calcular posición en grid (fila y columna)
                      const row = Math.floor(idx / layout.unitsPerRow);
                      const col = idx % layout.unitsPerRow;
                      const topPercent = row * (unitHeightPercent + spacingYPercent);
                      const leftPercent = col * (unitWidthPercent + spacingXPercent);

                      return (
                        <div
                          key={`unit-${idx}`}
                          className="absolute rounded border border-orange-400 bg-gradient-to-b from-orange-100 to-orange-50 flex items-center justify-center text-center p-1 overflow-hidden transition-all hover:shadow-md"
                          style={{
                            top: `${topPercent}%`,
                            left: `${leftPercent}%`,
                            width: `${unitWidthPercent}%`,
                            height: `${unitHeightPercent}%`,
                          }}
                          title={`${file.name} (${file.widthCm}×${file.heightCm}cm)`}
                        >
                          <span className="text-[10px] sm:text-xs font-semibold text-orange-900 truncate">
                            U{idx + 1}
                          </span>
                        </div>
                      );
                    })
                  ) : null}
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-full text-slate-400 text-xs text-center px-2">
                  Sube archivos con dimensiones para ver preview
                </div>
              )}
            </div>

            {/* Etiquetas de dimensiones */}
            <div className="absolute top-1 left-1 right-1 flex justify-between text-[10px] font-semibold text-slate-600 pointer-events-none">
              <span>60 cm</span>
              <span>100 cm</span>
            </div>
          </div>
        </div>

        {/* Información detallada */}
        <div className="flex-1 space-y-2 text-xs">
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-2">
            <p className="font-semibold text-blue-900 mb-1">Cálculo de metros</p>
            <div className="space-y-1 text-blue-800 text-[11px]">
              <p>- Alto por unidad: {layout.unitHeightCm || 0} cm = {layout.linearMetersPerUnit.toFixed(2)} m</p>
              <p>- Distribución: {layout.rows} fila(s) x {(layout.unitHeightCm || 0)} cm</p>
              {safeSpacingCm > 0 && (
                <p>- Separación entre filas: {Math.max(0, layout.rows - 1)} x {safeSpacingCm} cm</p>
              )}
              <p className="font-bold border-t border-blue-200 pt-1 mt-1">
                Total real: {layout.totalLinearMetersRaw.toFixed(2)} m
              </p>
              <p className="font-bold text-blue-900">
                Facturable: {layout.billableLinearMeters} m
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-slate-100 border border-slate-200 p-2">
            <p className="font-semibold text-slate-900 mb-2 text-xs">Configuración</p>
            <dl className="space-y-1 text-slate-700 text-[11px]">
              <div className="flex justify-between">
                <dt>Cantidad:</dt>
                <dd className="font-semibold">{layout.quantity}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Dimensión archivo:</dt>
                <dd className="font-semibold">{layout.unitWidthCm || 0}×{layout.unitHeightCm || 0} cm</dd>
              </div>
              <div className="flex justify-between">
                <dt>Separación:</dt>
                <dd className="font-semibold">{layout.spacingCm} cm</dd>
              </div>
              <div className="flex justify-between">
                <dt>Distribución:</dt>
                <dd className="font-semibold">{layout.unitsPerRow} por fila × {layout.rows} fila(s)</dd>
              </div>
              {!fitsInCanvas && (
                <div className="text-amber-700 mt-2 p-1 bg-amber-50 rounded border border-amber-200 text-[10px]">
                  No cabe todo en el paño. Se muestran {visibleUnits} de {layout.quantity} unidades.
                </div>
              )}
            </dl>
          </div>

          {hiddenUnits > 0 && (
            <div className="rounded-lg bg-orange-50 border border-orange-200 p-2 text-orange-800 text-[11px]">
              <p className="font-semibold">
                +{hiddenUnits} unidad{hiddenUnits > 1 ? 'es' : ''} fuera del área visible (total: {layout.billableLinearMeters} m)
              </p>
            </div>
          )}
        </div>
      </div>

      {filesWithDimensions?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <p className="text-xs font-semibold text-slate-600 mb-2">Archivos configurados:</p>
          <div className="flex flex-wrap gap-1">
            {filesWithDimensions.map((file, idx) => (
              <span key={file.id} className="text-xs bg-white border border-slate-200 rounded px-2 py-1 whitespace-nowrap overflow-hidden text-ellipsis">
                {formatFileLabel(file.url, file.name, idx)}: <strong>{file.widthCm}×{file.heightCm} cm</strong>
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}


