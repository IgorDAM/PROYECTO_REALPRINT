/**
 * Dashboard principal de administración.
 * Muestra estadísticas, accesos rápidos, últimos pedidos y alertas de stock.
 *
 * Estructura:
 * - Cabecera con saludo y fecha
 * - Tarjetas de estadísticas
 * - Últimos pedidos recientes
 * - Alerta de productos con stock bajo
 *
 * Buenas prácticas:
 * - Usa hooks de contexto para datos y usuario
 * - Modulariza columnas de tabla y lógica de filtrado
 * - Usa componentes UI reutilizables
 */
import { Link, useOutletContext } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ESTADOS_PEDIDO } from "../../context/data/uiContracts";
import { useApiStatus } from "../../hooks/useApiStatus";
import { usePedidosData } from "../../hooks/usePedidosData";
import { StatCard, GlassCard, Button, Badge, Table } from "../../components/ui";

interface DashboardOutletContext {
  sidebarOpen?: boolean;
}

interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row?: any) => JSX.Element | string;
}

export default function AdminDashboard() {
  // Recibe el estado de la sidebar desde el layout
  const { sidebarOpen } = (useOutletContext() as DashboardOutletContext) || {};
  const { user } = useAuth();
  const { pedidos, getEstadisticas } = usePedidosData();
  const { updatePedidoSafe } = usePedidosData();
  const { loading: isProcessing, error: apiError, runApi } = useApiStatus();
  const stats = getEstadisticas();

  // Últimos 5 pedidos
  const ultimosPedidos = pedidos.slice(0, 5);

  const pedidosActivos = pedidos.filter((p: any) => p.estado === "pendiente" || p.estado === "en_proceso");

  const getTotalCajas = (pedido: any) => {
    if (typeof pedido?.boxTotal === "number" && pedido.boxTotal > 0) return pedido.boxTotal;
    const qty = Number(pedido?.cantidad) || Number(pedido?.cantidadUnidades) || 1;
    return Math.max(1, qty);
  };

  const getCajasCompletadas = (pedido: any) => {
    const total = getTotalCajas(pedido);
    const current = Number(pedido?.cajasCompletadas) || 0;
    return Math.min(Math.max(current, 0), total);
  };

  const getEstadoByCajas = (cajasCompletadas: number, totalCajas: number) => {
    if (cajasCompletadas <= 0) return "pendiente";
    if (cajasCompletadas >= totalCajas) return "completado";
    return "en_proceso";
  };

  const handleCambiarEstado = async (pedidoId: string | number, nuevoEstado: string) => {
    await runApi(
      async () => {
        await updatePedidoSafe(pedidoId, { estado: nuevoEstado });
      },
      "No se ha podido actualizar el estado del pedido"
    );
  };

  const handleActualizarCajas = async (pedido: any, nextCajas: number) => {
    const totalCajas = getTotalCajas(pedido);
    const cajasCompletadas = Math.min(Math.max(nextCajas, 0), totalCajas);
    const nuevoEstado = getEstadoByCajas(cajasCompletadas, totalCajas);

    await runApi(
      async () => {
        await updatePedidoSafe(pedido.id, {
          cajasCompletadas,
          boxTotal: totalCajas,
          estado: nuevoEstado,
        });
      },
      "No se ha podido actualizar el progreso del pedido"
    );
  };

  const pedidosColumns: TableColumn[] = [
    { key: "id", label: "ID", render: (value) => <span className="font-mono text-primary-600">#{value}</span> },
    { key: "cliente", label: "Cliente" },
    { key: "servicio", label: "Servicio" },
    {
      key: "estado",
      label: "Estado",
      render: (value) => <Badge variant={value}>{ESTADOS_PEDIDO[value]?.label || value}</Badge>,
    },
    {
      key: "total",
      label: "Total",
      render: (value) => <span className="font-semibold text-surface-900">€{typeof value === "number" ? value.toFixed(2) : "0.00"}</span>,
    },
  ];

  const pedidosOperativosColumns: TableColumn[] = [
    { key: "id", label: "ID", render: (value) => <span className="font-medium">#{value}</span> },
    { key: "cliente", label: "Cliente" },
    { key: "pedido", label: "Pedido", render: (value) => value || "-" },
    {
      key: "estado",
      label: "Estado",
      render: (value) => <Badge variant={value}>{ESTADOS_PEDIDO[value]?.label || value}</Badge>,
    },
    {
      key: "cajasCompletadas",
      label: "Cajas",
      render: (_, row) => {
        const total = getTotalCajas(row);
        const current = getCajasCompletadas(row);

        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-7 h-7 rounded border border-surface-300 text-surface-700 disabled:opacity-50"
              disabled={isProcessing || current <= 0}
              onClick={() => void handleActualizarCajas(row, current - 1)}
            >
              -
            </button>
            <span className="text-sm font-medium min-w-[56px] text-center">{current}/{total}</span>
            <button
              type="button"
              className="w-7 h-7 rounded border border-surface-300 text-surface-700 disabled:opacity-50"
              disabled={isProcessing || current >= total}
              onClick={() => void handleActualizarCajas(row, current + 1)}
            >
              +
            </button>
          </div>
        );
      },
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (_, row) => (
        <div className="flex gap-2">
          {row.estado !== "pendiente" ? (
            <Button size="sm" variant="secondary" disabled={isProcessing} onClick={() => void handleCambiarEstado(row.id, "pendiente")}>
              Pendiente
            </Button>
          ) : null}
          {row.estado !== "en_proceso" ? (
            <Button size="sm" variant="secondary" disabled={isProcessing} onClick={() => void handleCambiarEstado(row.id, "en_proceso")}>
              En proceso
            </Button>
          ) : null}
          {row.estado !== "completado" ? (
            <Button size="sm" variant="success" disabled={isProcessing} onClick={() => void handleCambiarEstado(row.id, "completado")}>
              Completar
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">Panel de Administración</h1>
          <p className="text-surface-500 mt-1">Bienvenido, <span className="text-primary-600 font-semibold">{user?.name}</span></p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span className="text-surface-500 text-sm bg-white px-4 py-2 rounded-xl border border-surface-200">{new Date().toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard title="Pedidos Pendientes" value={stats.pedidosPendientes} icon="pending_actions" variant="gold" />
        <StatCard title="En Proceso" value={stats.pedidosEnProceso} icon="autorenew" variant="blue" />
        <StatCard title="Completados" value={stats.pedidosCompletados} icon="check_circle" variant="green" />
        <StatCard title="Ventas Totales" value={`€${typeof stats.totalVentas === "number" ? stats.totalVentas.toFixed(2) : "0.00"}`} icon="payments" variant="purple" />
      </div>

      {/* Accesos rápidos: solo visibles en móvil/tablet cuando la sidebar está oculta */}
      {!sidebarOpen && (
        <>
          <h2 className="block lg:hidden text-lg font-bold text-surface-900 mb-4">Accesos Rápidos</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 lg:mb-8 lg:hidden">
            <Link to="/admin/pedidos">
              <GlassCard className="p-4 text-center group">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-lg text-white">package_2</span>
                </div>
                <p className="font-semibold text-surface-900 text-xs">Gestionar Pedidos</p>
              </GlassCard>
            </Link>
            <Link to="/admin/usuarios">
              <GlassCard className="p-4 text-center group">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-lg text-white">group</span>
                </div>
                <p className="font-semibold text-surface-900 text-xs">Gestionar Usuarios</p>
              </GlassCard>
            </Link>
          </div>
        </>
      )}

      {/* Contenido principal */}
      <div className="grid grid-cols-1 gap-4 lg:gap-6">
        {/* Últimos pedidos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg lg:text-xl font-bold text-surface-900">Últimos Pedidos</h2>
            <Link to="/admin/pedidos">
              <Button variant="ghost" size="sm">Ver todos →</Button>
            </Link>
          </div>
          <Table columns={pedidosColumns} data={ultimosPedidos} />
        </div>
      </div>

      {/* Operativa de Producción */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg lg:text-xl font-bold text-surface-900">Operativa de Producción</h2>
          <Badge variant="info">{pedidosActivos.length} activos</Badge>
        </div>

        {apiError ? (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {apiError}
          </div>
        ) : null}

        <Table
          columns={pedidosOperativosColumns}
          data={pedidosActivos}
          emptyMessage="No hay pedidos activos"
        />
      </div>
    </div>
  );
}

