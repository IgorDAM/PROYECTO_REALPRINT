import PropTypes from "prop-types";

export default function Table({ columns, data, onRowClick, emptyMessage = "No hay datos disponibles" }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl border border-surface-200 shadow-soft p-6 sm:p-12 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-surface-100 flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl sm:text-3xl text-surface-400">inbox</span>
        </div>
        <p className="text-surface-500 font-medium text-sm sm:text-base">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-surface-200 shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left min-w-[600px]">
          <thead className="bg-gradient-to-r from-surface-50 to-surface-100 border-b border-surface-200">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-surface-600 uppercase text-xs tracking-wider whitespace-nowrap">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {data.map((row, index) => (
              <tr
                key={row.id || index}
                className={`hover:bg-primary-50/50 transition-colors ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-3 sm:px-6 py-3 sm:py-4 text-surface-700">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    render: PropTypes.func,
  })).isRequired,
  data: PropTypes.array.isRequired,
  onRowClick: PropTypes.func,
  emptyMessage: PropTypes.string,
};

/**
 * Ejemplo de uso:
 * <Table columns={[{key:'id',label:'ID'}]} data={dataArray} />
 */
