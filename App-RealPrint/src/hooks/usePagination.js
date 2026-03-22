import { useState, useMemo } from 'react';

/**
 * Hook personalizado para manejo de paginación.
 *
 * Props:
 * - items: array de items a paginar
 * - itemsPerPage: items por página (default: 25)
 *
 * Returns:
 * - currentPage: página actual (1-indexed)
 * - totalPages: total de páginas
 * - paginatedItems: items de la página actual
 * - goToPage: función para ir a página específica
 * - nextPage: función para ir a siguiente página
 * - prevPage: función para ir a página anterior
 * - pageInfo: objeto con info de paginación
 */
export function usePagination(items = [], itemsPerPage = 25) {
  const [currentPage, setCurrentPage] = useState(1);

  const { totalPages, paginatedItems, startIndex, endIndex } = useMemo(() => {
    const total = Math.ceil(items.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = items.slice(start, end);

    return {
      totalPages: total,
      paginatedItems: paginated,
      startIndex: start,
      endIndex: Math.min(end, items.length),
    };
  }, [items, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    const pageNum = Math.max(1, Math.min(page, totalPages || 1));
    setCurrentPage(pageNum);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  const pageInfo = {
    currentPage,
    totalPages,
    totalItems: items.length,
    itemsPerPage,
    startIndex: startIndex + 1,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    pageInfo,
  };
}

/**
 * Componente PaginationControls - controles de paginación reutilizable.
 *
 * Props:
 * - pageInfo: información de paginación
 * - onPageChange: callback cuando cambia página
 */
export function PaginationControls({ pageInfo, onPageChange }) {
  const pages = [];
  const startPage = Math.max(1, pageInfo.currentPage - 2);
  const endPage = Math.min(pageInfo.totalPages, pageInfo.currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      {/* Info de items mostrados */}
      <div className="text-sm text-gray-700">
        Mostrando <span className="font-medium">{pageInfo.startIndex}</span> a{' '}
        <span className="font-medium">{pageInfo.endIndex}</span> de{' '}
        <span className="font-medium">{pageInfo.totalItems}</span> resultados
      </div>

      {/* Controles de paginación */}
      <div className="flex gap-2">
        {/* Botón anterior */}
        <button
          onClick={() => onPageChange(pageInfo.currentPage - 1)}
          disabled={!pageInfo.hasPrevPage}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Anterior
        </button>

        {/* Números de página */}
        <div className="flex gap-1">
          {startPage > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-2 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2 py-2">...</span>}
            </>
          )}

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                page === pageInfo.currentPage
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          {endPage < pageInfo.totalPages && (
            <>
              {endPage < pageInfo.totalPages - 1 && <span className="px-2 py-2">...</span>}
              <button
                onClick={() => onPageChange(pageInfo.totalPages)}
                className="px-2 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {pageInfo.totalPages}
              </button>
            </>
          )}
        </div>

        {/* Botón siguiente */}
        <button
          onClick={() => onPageChange(pageInfo.currentPage + 1)}
          disabled={!pageInfo.hasNextPage}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

