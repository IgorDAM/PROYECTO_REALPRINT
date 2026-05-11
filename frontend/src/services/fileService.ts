/**
 * Servicio para gestión de descargas de archivos.
 *
 * **Responsabilidades:**
 * 1. Validar URLs seguras contra directory traversal
 * 2. Descargar archivos con autenticación JWT
 * 3. Manejo de fallback para URLs externas
 * 4. Extraer nombres de archivo correctamente
 *
 * @see AdminPedidos.tsx para consumidor principal
 */

import { getToken } from './tokenStorage';

/**
 * Valida si una URL es segura para descargar desde nuestro backend.
 * Previene:
 * - URLs de orígenes externos maliciosos
 * - Paths que no sean archivos subidos (/api/files/*)
 */
function isDownloadableUrl(fileUrl: string): boolean {
  try {
    const allowedOrigins = new Set<string>([window.location.origin]);
    const apiBase = import.meta.env.VITE_API_URL;
    if (typeof apiBase === 'string' && apiBase.trim()) {
      const parsed = new URL(apiBase, window.location.origin);
      allowedOrigins.add(parsed.origin);
    }

    const parsed = new URL(fileUrl, window.location.origin);
    return allowedOrigins.has(parsed.origin) && parsed.pathname.startsWith('/api/files/');
  } catch {
    return false;
  }
}

/**
 * Extrae nombre legible del archivo desde la URL.
 * Si falla, devuelve un nombre genérico.
 *
 * @param fileUrl - URL del archivo (ej: /api/files/uuid-nombre.pdf)
 * @param fallbackIndex - Índice para fallback
 * @returns Nombre del archivo para usar en download attribute
 */
function getFileNameFromUrl(fileUrl: string, fallbackIndex: number): string {
  try {
    const parsed = new URL(fileUrl, window.location.origin);
    const lastChunk = parsed.pathname.split('/').filter(Boolean).pop();
    return lastChunk || `archivo-${fallbackIndex + 1}`;
  } catch {
    return `archivo-${fallbackIndex + 1}`;
  }
}

/**
 * Descarga un archivo usando fetch con autenticación JWT.
 * Maneja dos casos:
 * 1. URLs internas (/api/files): Se descargan con token JWT
 * 2. URLs externas (http/https): Se abren en nueva pestaña
 *
 * @param fileUrl - URL del archivo a descargar
 * @param fileIndex - Índice del archivo (para nombre de fallback)
 * @throws Error si la URL no es segura
 *
 * @example
 * await downloadFile('/api/files/uuid-documento.pdf', 0);
 */
export async function downloadFile(fileUrl: string, fileIndex: number = 0): Promise<void> {
  if (!isDownloadableUrl(fileUrl)) {
    throw new Error('URL de archivo no válida');
  }

  const token = getToken();

  // URLs externas: abrir en nueva pestaña
  if ((fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) && !fileUrl.includes('/api/files/')) {
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  // URLs internas: descargar con autenticación JWT
  try {
    const response = await fetch(fileUrl, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      // Fallback: abrir en nueva pestaña si falla
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = getFileNameFromUrl(fileUrl, fileIndex);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  } catch {
    // Fallback: abrir en nueva pestaña si hay error
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * API pública del servicio de descargas.
 */
export const fileService = {
  /**
   * Descarga un archivo del servidor.
   * @param fileUrl URL del archivo
   * @param fileIndex Índice (para nombre de fallback)
   */
  download: downloadFile,

  /**
   * Valida si una URL es segura para descargar.
   * @param fileUrl URL a validar
   */
  isDownloadableUrl,

  /**
   * Extrae un nombre legible del archivo.
   * @param fileUrl URL del archivo
   * @param fallbackIndex Índice de fallback
   */
  getFileNameFromUrl,
};

