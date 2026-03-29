/**
 * Página de pedidos activos para operario.
 * Muestra pedidos en producción y su estado.
 *
 * Buenas prácticas:
 * - Modulariza lógica de filtrado y columnas de tabla
 * - Usa componentes UI reutilizables
 * - Documenta cada función relevante
 */

import ListaPedidosOperario from "../../components/ListaPedidosOperario";

export default function OperarioPedidos() {
  return (
    <div>
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">Pedidos Activos</h1>
        <p className="text-surface-500 mt-1">Gestión de cajas por pedido</p>
      </div>
      <ListaPedidosOperario />
    </div>
  );
}
