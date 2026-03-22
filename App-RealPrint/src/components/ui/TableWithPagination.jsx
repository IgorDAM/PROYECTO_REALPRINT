import React, { useMemo } from 'react';
import { usePagination, PaginationControls } from '../../hooks/usePagination.jsx';

/**
 * Componente Table memoizado para performance con paginación.
 *
 * Props:
 * - columns: array de { key, header, render?: (value, row) => JSX }
 * - data: array de datos
 * - keyExtractor: función para extraer key de cada row (default: id)
 * - itemsPerPage: items por página (default: 25)
 * - onRowClick: callback cuando se clickea una fila
 * - loading: muestra skeleton si es true
 * - empty: mensaje cuando no hay datos
 */
const Table = React.memo(function TableComponent({
  columns = [],
  data = [],
  keyExtractor = (row) => row.id,
  itemsPerPage = 25,
  onRowClick = null,
  loading = false,
  empty = 'No hay datos',
}) {
  const { paginatedItems, pageInfo, goToPage } = usePagination(data, itemsPerPage);

  const rows = useMemo(() => {
    return paginatedItems.map((row) => ({
      key: keyExtractor(row),
      data: row,
    }));
  }, [paginatedItems, keyExtractor]);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">{empty}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left font-semibold text-gray-700"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map(({ key, data: row }) => (
              <tr
                key={key}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
              >
                {columns.map((col) => (
                  <td key={`${key}-${col.key}`} className="px-6 py-4 text-gray-900">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pageInfo.totalPages > 1 && (
        <PaginationControls pageInfo={pageInfo} onPageChange={goToPage} />
      )}
    </div>
  );
});

export default Table;
