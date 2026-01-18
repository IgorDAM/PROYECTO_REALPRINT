/**
 * Dashboard principal del cliente.
 * Muestra resumen de pedidos, estadísticas y acceso rápido a nuevo pedido.
 *
 * Estructura:
 * - Cabecera con saludo
 * - Tarjetas de estadísticas
 * - Tabla de pedidos activos y recientes
 *
 * Buenas prácticas:
 * - Filtra pedidos por cliente
 * - Modulariza columnas de tabla y lógica de acciones
 * - Usa componentes UI reutilizables
 */
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData, ESTADOS_PEDIDO } from "../../context/DataContext";
import { StatCard, Button, Badge, Table } from "../../components/ui";

export default function ClienteDashboard() {
  const { user } = useAuth();
  const { pedidos, deletePedido } = useData();

  // Filtra los pedidos del cliente actual
  const misPedidos = pedidos.filter((p) => p.clienteId === user?.id);
  const pedidosActivos = misPedidos.filter((p) => ["pendiente", "en_proceso"].includes(p.estado));

  const handleEliminarPedido = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este pedido?")) {
      deletePedido(id);
    }
  };

  const columns = [
    { key: "id", label: "ID Pedido", render: (value) => <span className="font-medium">#{value}</span> },
    { key: "pedido", label: "Pedido" },
    { key: "servicio", label: "Servicio" },
    { key: "fechaEntrega", label: "Entrega" },
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
    {
      key: "acciones",
      label: "Acciones",
      render: (_, row) =>
        row.estado === "pendiente" ? (
          <div className="flex gap-2">
            <Link to={`/cliente/editar-pedido/${row.id}`}>
              <Button size="sm" variant="secondary">Editar</Button>
            </Link>
            <Button size="sm" variant="danger" onClick={() => handleEliminarPedido(row.id)}>Eliminar</Button>
          </div>
        ) : null,
    },
  ];

  const totalGastado = misPedidos.reduce((sum, p) => sum + p.total, 0);

  return (
    <div>
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">Bienvenido, <span className="text-primary-600">{user?.name}</span></h1>
          <p className="text-surface-500 mt-1">Panel de Cliente</p>
        </div>
        <Link to="/cliente/nuevo-pedido">
          <Button icon="add" className="w-full sm:w-auto">Nuevo Pedido</Button>
        </Link>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard title="Total Pedidos" value={misPedidos.length} icon="receipt_long" />
        <StatCard title="Pedidos Activos" value={pedidosActivos.length} icon="pending_actions" />
        <StatCard title="Total Gastado" value={`€${totalGastado.toFixed(2)}`} icon="payments" />
      </div>

      {/* Pedidos activos */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg lg:text-xl font-bold text-surface-900">Mis Pedidos Activos</h2>
        <Link to="/cliente/historial">
          <Button variant="ghost" size="sm">Ver historial →</Button>
        </Link>
      </div>

      <Table
        columns={columns}
        data={pedidosActivos}
        emptyMessage="No tienes pedidos activos"
      />
    </div>
  );
}
