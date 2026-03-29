/**
 * Componente para mostrar un pedido individual del operario.
 * Muestra detalles del pedido, cajas y permite marcar cajas como completadas.
 */

interface PedidoOperarioItem {
  id: string | number;
  cliente: string;
  totalUnidades: number;
  unidadesPorCaja: number;
  cajasTotales: number;
  cajasCompletadas: number;
  estado: string;
  fechaEntrega: string;
  productoNombre: string;
}

interface PedidoOperarioProps {
  pedido: PedidoOperarioItem;
  onActualizarCajas: (pedidoId: string | number, nuevasCajasCompletadas: number) => void;
}

function PedidoOperario({ pedido, onActualizarCajas }: PedidoOperarioProps) {
  const porcentajeCompletado = pedido.cajasTotales > 0 
    ? Math.round((pedido.cajasCompletadas / pedido.cajasTotales) * 100) 
    : 0;

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "completado":
        return "bg-green-100 text-green-700";
      case "en_proceso":
        return "bg-blue-100 text-blue-700";
      case "pendiente":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      completado: "Completado",
      en_proceso: "En Proceso",
      pendiente: "Pendiente",
    };
    return labels[estado] || estado;
  };

  return (
    <div className="bg-white border border-surface-200 rounded-lg p-6 mb-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Encabezado del pedido */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-surface-900">Pedido #{pedido.id}</h3>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${getEstadoBadgeColor(pedido.estado)}`}>
              {getEstadoLabel(pedido.estado)}
            </span>
          </div>
          <p className="text-sm text-surface-600 mb-1">
            <strong>Cliente:</strong> {pedido.cliente}
          </p>
          <p className="text-sm text-surface-600 mb-1">
            <strong>Producto:</strong> {pedido.productoNombre}
          </p>
          <p className="text-sm text-surface-600">
            <strong>Entrega:</strong> {pedido.fechaEntrega}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary-600">{porcentajeCompletado}%</div>
          <p className="text-xs text-surface-500">Progreso</p>
        </div>
      </div>

      {/* Información de cajas */}
      <div className="bg-surface-50 rounded-lg p-4 mb-4">
        <p className="text-sm font-medium text-surface-900 mb-2">
          Total: {pedido.totalUnidades} unidades ({pedido.cajasTotales} cajas de {pedido.unidadesPorCaja})
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-surface-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${porcentajeCompletado}%` }}
            />
          </div>
          <span className="text-sm font-medium text-surface-700 whitespace-nowrap">
            {pedido.cajasCompletadas}/{pedido.cajasTotales}
          </span>
        </div>
      </div>

      {/* Grid de cajas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {Array.from({ length: pedido.cajasTotales }).map((_, idx) => {
          const isCompleted = idx < pedido.cajasCompletadas;
          const isNextBox = idx === pedido.cajasCompletadas;
          const isLastCompleted = idx === pedido.cajasCompletadas - 1;
          const canRollback = isCompleted && isLastCompleted;

          // Reglas:
          // - Se puede marcar solo la siguiente caja
          // - Se puede desmarcar solo la ultima completada
          // - El resto queda bloqueado
          const isDisabled = (!isCompleted && !isNextBox) || (isCompleted && !canRollback);

          const handleToggleCaja = () => {
            const nuevasCajasCompletadas = isCompleted ? idx : idx + 1;
            onActualizarCajas(pedido.id, nuevasCajasCompletadas);
          };

          return (
            <label
              key={idx}
              className={`
                p-3 rounded-lg border-2 text-center cursor-pointer transition-all
                ${isCompleted
                  ? "bg-green-50 border-green-300 text-green-900 font-semibold"
                  : isDisabled
                  ? "bg-surface-100 border-surface-300 text-surface-500 cursor-not-allowed opacity-50"
                  : "bg-white border-surface-300 text-surface-700 hover:border-primary-300 hover:bg-primary-50"
                }
              `}
            >
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={handleToggleCaja}
                disabled={isDisabled}
                className="sr-only"
              />
              <span className="text-sm font-medium">
                Caja {idx + 1}
              </span>
              {isCompleted && (
                <div className="text-lg mt-1">✓</div>
              )}
            </label>
          );
        })}
      </div>

      {/* Mensaje de completado */}
      {pedido.cajasCompletadas === pedido.cajasTotales && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-sm font-medium text-green-700">
            ✓ Pedido completado
          </p>
        </div>
      )}
    </div>
  );
}

export default PedidoOperario;
