/**
 * Historial de pedidos del cliente.
 * Muestra pedidos finalizados, enviados o cancelados y el total gastado.
 *
 * Buenas prácticas:
 * - Modulariza lógica de filtrado y columnas de tabla
 * - Usa componentes UI reutilizables
 * - Documenta cada función relevante
 */
import { useAuth } from "../../context/AuthContext";
import { useData, ESTADOS_PEDIDO } from "../../context/DataContext";
import { Table, Badge } from "../../components/ui";

export default function ClienteHistorial() {
  const { user } = useAuth();
  const { pedidos } = useData();

  // Filtra pedidos finalizados, enviados o cancelados
  const historial = pedidos.filter(
    (p) => p.clienteId === user?.id && ["completado", "enviado", "cancelado"].includes(p.estado)
  );

  const columns = [
    { key: "id", label: "ID Pedido", render: (value) => <span className="font-medium">#{value}</span> },
    { key: "pedido", label: "Pedido" },
    { key: "servicio", label: "Servicio" },
    { key: "fecha", label: "Fecha Pedido" },
    { key: "fechaEntrega", label: "Fecha Entrega" },
    {
      key: "estado",
      label: "Estado",
      render: (value) => <Badge variant={value}>{ESTADOS_PEDIDO[value]?.label || value}</Badge>,
    },
    {
      key: "total",
      label: "Total",
      render: (value) => `€${value.toFixed(2)}`,
    },
  ];

  const totalHistorico = historial
    .filter((p) => p.estado !== "cancelado")
    .reduce((sum, p) => sum + p.total, 0);

  return (
    <div>
      {/* Cabecera */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">Historial de Pedidos</h1>
        <p className="text-surface-500 mt-1">
          {historial.length} pedidos finalizados | Total: <span className="text-primary-600 font-semibold">€{totalHistorico.toFixed(2)}</span>
        </p>
      </div>

      <Table
        columns={columns}
        data={historial}
        emptyMessage="Aún no tienes pedidos completados"
      />
    </div>
  );
}
