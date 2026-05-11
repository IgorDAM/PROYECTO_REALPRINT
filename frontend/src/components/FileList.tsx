/**
 * Componente que renderiza la lista de archivos de un pedido.
 *
 * **Responsabilidades:**
 * - Mostrar lista de archivos con enlaces de descarga
 * - Manejar estado de descarga (botones disabled, indicadores)
 * - Validar URLs seguras antes de mostrar
 * - Mensajes cuando no hay archivos
 *
 * **Props:**
 * - fileUrls: Array de URLs de archivos
 * - onDownload: Callback cuando usuario clickea descargar
 * - downloadingFile: URL actual siendo descargada (estado)
 * - isDownloadableUrl: Función para validar URLs
 * - onError: Callback opcional para errores
 */

import React from 'react';

interface FileListProps {
  fileUrls: string[];
  onDownload: (fileUrl: string, index: number) => Promise<void>;
  downloadingFile: string | null;
  isDownloadableUrl: (url: string) => boolean;
  onError?: (error: string) => void;
}

export function FileList({
  fileUrls,
  onDownload,
  downloadingFile,
  isDownloadableUrl,
  onError,
}: FileListProps) {
  if (fileUrls.length === 0) {
    return (
      <p className="text-sm text-surface-500">
        No hay archivos asociados a este pedido.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {fileUrls.map((fileUrl, index) => (
        <li
          key={`${fileUrl}-${index}`}
          className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm flex items-center justify-between"
        >
          {isDownloadableUrl(fileUrl) ? (
            <button
              type="button"
              disabled={downloadingFile === fileUrl}
              onClick={async () => {
                try {
                  await onDownload(fileUrl, index);
                } catch (err) {
                  const msg = err instanceof Error ? err.message : 'Error desconocido';
                  onError?.(msg);
                }
              }}
              className="text-left text-primary-600 hover:text-primary-700 hover:underline disabled:text-surface-400 disabled:cursor-not-allowed break-all flex-1"
            >
              {downloadingFile === fileUrl ? (
                <>
                  <span className="inline-block animate-spin mr-2">⟳</span>
                  Descargando...
                </>
              ) : (
                `📥 Descargar archivo ${index + 1}`
              )}
            </button>
          ) : (
            <span className="text-surface-700 break-all">{fileUrl}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

