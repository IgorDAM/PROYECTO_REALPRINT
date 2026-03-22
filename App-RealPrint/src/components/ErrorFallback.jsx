import React from 'react';
import { logger } from '../services/logger.js';

/**
 * Componente ErrorFallback - interfaz de error cuando un boundary atrapa excepciones.
 *
 * Props:
 * - error: Error lanzado
 * - resetErrorBoundary: función para resetear boundary
 */
export function ErrorFallback({ error: _error, resetErrorBoundary }) {
  const errorId = Math.random().toString(36).substring(7);

  React.useEffect(() => {
    logger.error('Error Boundary caught exception', {
      errorId,
      message: _error?.message,
      stack: _error?.stack?.substring(0, 200),
    });
  }, [_error, errorId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
        {/* Header */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4v2m0 4v2M9 7a3 3 0 016 0m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Algo salió mal
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Se encontró un error inesperado. Por favor intenta recargar la página o contacta
          con soporte si el problema persiste.
        </p>

        {/* Error Details (en desarrollo) */}
        {import.meta.env.DEV && _error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-xs font-mono text-red-700 mb-2">
              <strong>Error ID:</strong> {errorId}
            </p>
            <p className="text-xs font-mono text-red-700 break-words">
              <strong>Mensaje:</strong> {_error.message}
            </p>
          </div>
        )}

        {/* Acciones */}
        <div className="space-y-3">
          <button
            onClick={resetErrorBoundary}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Intentar de nuevo
          </button>

          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Ir al inicio
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Error ID: <code className="font-mono text-red-600">{errorId}</code>
        </p>
      </div>
    </div>
  );
}

/**
 * Hook para detectar errores y proporcionar info útil.
 */
export function useErrorHandler(errorId) {
  React.useEffect(() => {
    const handleError = (event) => {
      logger.error('Unhandled error', {
        errorId,
        message: event.error?.message,
        filename: event.filename,
        lineno: event.lineno,
      });
    };

    const handleRejection = (event) => {
      logger.error('Unhandled rejection', {
        errorId,
        reason: event.reason,
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [errorId]);
}

