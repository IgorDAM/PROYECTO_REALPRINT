/**
 * Página de pedidos activos para operario.
 * Muestra pedidos en producción y su estado.
 *
 * Buenas prácticas:
 * - Modulariza lógica de filtrado y columnas de tabla
 * - Usa componentes UI reutilizables
 * - Documenta cada función relevante
 */
import { useData, ESTADOS_PEDIDO } from "../../context/DataContext";
import { Table, Badge } from "../../components/ui";

export default function OperarioPedidos() {
  const { pedidos } = useData();

  // Mostrar solo pedidos activos
  const pedidosActivos = pedidos.filter((p) => 
    ["pendiente", "en_proceso"].includes(p.estado)
  );

  const columns = [
    { key: "id", label: "ID", render: (value) => <span className="font-medium">#{value}</span> },
    { key: "cliente", label: "Cliente" },
    { key: "pedido", label: "Pedido" },
    { key: "servicio", label: "Servicio" },
    { key: "cantidad", label: "Cantidad" },
    { key: "fechaEntrega", label: "Entrega" },
    { 
      key: "estado", 
      label: "Estado",
      render: (value) => (
        <Badge variant={value}>{ESTADOS_PEDIDO[value]?.label || value}</Badge>
      )
    },
  ];

  return (
    <div>
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">Pedidos Activos</h1>
        <p className="text-surface-500 mt-1">{pedidosActivos.length} pedidos en producción</p>
      </div>

      <Table 
        columns={columns} 
        data={pedidosActivos}
        emptyMessage="No hay pedidos activos"
      />
    </div>
  );
}
