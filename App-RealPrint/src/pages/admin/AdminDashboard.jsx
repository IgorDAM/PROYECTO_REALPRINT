/**
 * Dashboard principal de administración.
 * Muestra estadísticas, accesos rápidos, últimos pedidos y alertas de stock.
 */
import { Link, useOutletContext } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { StatCard, GlassCard, Button, Badge, Table } from "../../components/ui";
import { ESTADOS_PEDIDO } from "../../context/DataContext";

export default function AdminDashboard() {
  // Recibe el estado de la sidebar desde el layout
  const { sidebarOpen } = useOutletContext() || {};
  const { user } = useAuth();
  const { pedidos, inventario, getEstadisticas } = useData();
  const stats = getEstadisticas();

  // Últimos 5 pedidos
  const ultimosPedidos = pedidos.slice(0, 5);

  // Productos con stock bajo
  const stockBajo = inventario.filter((item) => item.stock <= item.stockMinimo);

  const pedidosColumns = [
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
            <Link to="/admin/inventario">
              <GlassCard className="p-4 text-center group">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-lg text-white">inventory_2</span>
                </div>
                <p className="font-semibold text-surface-900 text-xs">Gestionar Inventario</p>
              </GlassCard>
            </Link>
            <Link to="/admin/productos-finales">
              <GlassCard className="p-4 text-center group">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-lg text-white">checkroom</span>
                </div>
                <p className="font-semibold text-surface-900 text-xs">Productos Finales</p>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Últimos pedidos */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg lg:text-xl font-bold text-surface-900">Últimos Pedidos</h2>
            <Link to="/admin/pedidos">
              <Button variant="ghost" size="sm">Ver todos →</Button>
            </Link>
          </div>
          <Table columns={pedidosColumns} data={ultimosPedidos} />
        </div>

        {/* Alertas de stock */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-surface-900">Alertas de Stock</h2>
            <Badge variant={stockBajo.length > 0 ? "warning" : "success"}>
              {stockBajo.length} alertas
            </Badge>
          </div>
          <GlassCard className="p-4" hover={false}>
            {stockBajo.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                </div>
                <p className="text-surface-500">Todo el inventario está en niveles normales</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {stockBajo.map((item) => (
                  <li key={item.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <div>
                      <p className="font-semibold text-surface-900">{item.nombre}</p>
                      <p className="text-sm text-surface-500">{item.categoria}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-600">{item.stock}</p>
                      <p className="text-xs text-surface-500">Mín: {item.stockMinimo}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
