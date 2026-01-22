/**
 * Página de reportes y estadísticas para el administrador.
 * Muestra métricas de pedidos, ingresos, clientes y stock por categoría.
 *
 * Buenas prácticas:
 * - Modulariza lógica de cálculo de métricas
 * - Usa componentes UI reutilizables
 * - Documenta cada función relevante
 */
import { useData, ESTADOS_PEDIDO, SERVICIOS } from "../../context/DataContext";
import { StatCard, GlassCard } from "../../components/ui";

export default function AdminReportes() {
  const { pedidos, inventario, usuarios, getEstadisticas, productosFinales } = useData();
  const stats = getEstadisticas();

  // Calcular estadísticas por servicio
  const pedidosPorServicio = SERVICIOS.map((servicio) => ({
    servicio: servicio.label,
    cantidad: pedidos.filter((p) => p.servicio === servicio.label).length,
    total: pedidos
      .filter((p) => p.servicio === servicio.label)
      .reduce((sum, p) => sum + p.total, 0),
  }));

  // Estadísticas de productos finales
  const productosFinalesStats = productosFinales.map((pf) => {
    const pedidosDeEsteProducto = pedidos.filter(p => String(p.productoFinalId) === String(pf.id));
    // Agrupar por talla/modelo y caja
    const porTallaModelo = {};
    pedidosDeEsteProducto.forEach(p => {
      const key = `${pf.nombre} | Caja ${p.boxIndex || 1}`;
      if (!porTallaModelo[key]) porTallaModelo[key] = { pedidos: 0, total: 0 };
      porTallaModelo[key].pedidos += 1;
      porTallaModelo[key].total += (typeof p.total === 'number' ? p.total : 0);
    });
    return {
      nombre: pf.nombre,
      servicio: pf.servicio,
      pedidos: pedidosDeEsteProducto.length,
      total: pedidosDeEsteProducto.reduce((sum, p) => sum + (typeof p.total === 'number' ? p.total : 0), 0),
      detallePorCaja: porTallaModelo
    };
  });

  // Calcular estadísticas por estado
  const pedidosPorEstado = Object.entries(ESTADOS_PEDIDO).map(([key, { label }]) => ({
    estado: label,
    cantidad: pedidos.filter((p) => p.estado === key).length,
  }));

  // Top clientes
  const clientesAgrupados = pedidos.reduce((acc, p) => {
    acc[p.cliente] = acc[p.cliente] || { nombre: p.cliente, pedidos: 0, total: 0 };
    acc[p.cliente].pedidos += 1;
    acc[p.cliente].total += p.total;
    return acc;
  }, {});
  const topClientes = Object.values(clientesAgrupados)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Inventario por categoría
  const inventarioPorCategoria = inventario.reduce((acc, item) => {
    acc[item.categoria] = acc[item.categoria] || { categoria: item.categoria, productos: 0, valorTotal: 0 };
    acc[item.categoria].productos += 1;
    acc[item.categoria].valorTotal += item.stock * item.precio;
    return acc;
  }, {});

  return (
    <div>
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">Reportes y Estadísticas</h1>
        <p className="text-surface-500 mt-1">Resumen general del negocio</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard
          title="Total Pedidos"
          value={stats.totalPedidos}
          icon="receipt_long"
        />
        <StatCard
          title="Ingresos Totales"
          value={`€${stats.totalVentas.toFixed(2)}`}
          icon="euro"
        />
        <StatCard
          title="Usuarios Activos"
          value={stats.usuariosActivos}
          icon="group"
        />
        <StatCard
          title="Productos Inventario"
          value={inventario.length}
          icon="inventory_2"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Productos Finales por Servicio */}
                <GlassCard className="p-6" hover={false}>
                  <h3 className="text-xl font-bold text-surface-900 mb-4">Productos Finales por Servicio</h3>
                  <div className="space-y-8">
                    {["Serigrafía", "Rotulación"].map(servicio => {
                      // Mostrar todos los productos finales, aunque tengan 0 pedidos
                      const productosServicio = productosFinales
                        .filter(pf => (pf.servicio || "").toLowerCase() === servicio.toLowerCase())
                        .map(pf => {
                          // Buscar stats si existen, si no, poner 0
                          const stat = productosFinalesStats.find(s => s.nombre === pf.nombre && (s.servicio || "").toLowerCase() === servicio.toLowerCase());
                          return {
                            nombre: pf.nombre,
                            pedidos: stat ? stat.pedidos : 0,
                            total: stat ? stat.total : 0,
                          };
                        });
                      return (
                        <div key={servicio}>
                          <h4 className="text-lg font-bold text-primary-700 mb-2">{servicio}</h4>
                          {productosServicio.length === 0 && <div className="text-surface-500 mb-4">No hay productos finales de {servicio}</div>}
                          {productosServicio.map((pf) => (
                            <div key={pf.nombre} className="flex flex-col gap-1 p-3 bg-surface-50 rounded-xl border border-surface-200 mb-2">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-surface-900">{pf.nombre}</p>
                                <div className="text-right">
                                  <p className="font-bold text-surface-900">{pf.pedidos} pedidos</p>
                                  <p className="text-sm text-surface-500">€{pf.total.toFixed(2)}</p>
                                </div>
                              </div>
                              {/* Detalle por caja/talla/modelo */}
                              {pf.detallePorCaja && Object.entries(pf.detallePorCaja).map(([key, detalle]) => (
                                <div key={key} className="flex items-center justify-between pl-4">
                                  <span className="text-xs text-surface-500">{key}</span>
                                  <span className="text-xs text-surface-700">{detalle.pedidos} pedidos</span>
                                  <span className="text-xs text-primary-600">€{detalle.total.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
        {/* Pedidos por Servicio */}
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-xl font-bold text-surface-900 mb-4">Pedidos por Servicio</h3>
          <div className="space-y-4">
            {pedidosPorServicio.map((item) => (
              <div key={item.servicio} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                  <span className="text-surface-700">{item.servicio}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-surface-900">{item.cantidad} pedidos</p>
                  <p className="text-sm text-surface-500">€{item.total.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Pedidos por Estado */}
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-xl font-bold text-surface-900 mb-4">Pedidos por Estado</h3>
          <div className="space-y-4">
            {pedidosPorEstado.map((item) => (
              <div key={item.estado} className="flex items-center justify-between">
                <span className="text-surface-700">{item.estado}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-surface-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                      style={{ width: `${(item.cantidad / stats.totalPedidos) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-bold w-8 text-right text-surface-900">{item.cantidad}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Top Clientes */}
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-xl font-bold text-surface-900 mb-4">Top Clientes</h3>
          <div className="space-y-4">
            {topClientes.map((cliente, index) => (
              <div key={cliente.nombre} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl border border-surface-200">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-surface-900">{cliente.nombre}</p>
                    <p className="text-sm text-surface-500">{cliente.pedidos} pedidos</p>
                  </div>
                </div>
                <p className="font-bold text-lg text-primary-600">€{cliente.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Valor Inventario por Categoría */}
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-xl font-bold text-surface-900 mb-4">Inventario por Categoría</h3>
          <div className="space-y-4">
            {Object.values(inventarioPorCategoria).map((cat) => (
              <div key={cat.categoria} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl border border-surface-200">
                <div>
                  <p className="font-semibold text-surface-900">{cat.categoria}</p>
                  <p className="text-sm text-surface-500">{cat.productos} productos</p>
                </div>
                <p className="font-bold text-primary-600">€{cat.valorTotal.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
