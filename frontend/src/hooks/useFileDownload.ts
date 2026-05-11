/**
 * Hook personalizado para gestionar descargas de archivos.
 *
 * **Maneja:**
 * - Estado de descarga en curso
 * - Errores capturados
 * - Integración con fileService
 *
 * **Ejemplo de uso:**
 * ```typescript
 * const { downloadFile, downloadingFile, error } = useFileDownload();
 *
 * const handleDownload = async (fileUrl) => {
 *   try {
 *     await downloadFile(fileUrl, 0);
 *   } catch (err) {
 *     console.error('Error:', error);
 *   }
 * };
 * ```
 */

import { useState } from 'react';
import { downloadFile } from '../services/fileService';

interface UseFileDownloadReturn {
  downloadingFile: string | null;
  error: string | null;
  downloadFile: (fileUrl: string, fileIndex?: number) => Promise<void>;
  clearError: () => void;
}

export function useFileDownload(): UseFileDownloadReturn {
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (fileUrl: string, fileIndex: number = 0): Promise<void> => {
    setDownloadingFile(fileUrl);
    setError(null);

    try {
      await downloadFile(fileUrl, fileIndex);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido al descargar archivo';
      setError(errorMsg);
    } finally {
      setDownloadingFile((current) => (current === fileUrl ? null : current));
    }
  };

  return {
    downloadingFile,
    error,
    downloadFile: handleDownload,
    clearError: () => setError(null),
  };
}

