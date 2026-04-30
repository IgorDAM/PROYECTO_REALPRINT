type Entity = Record<string, any>;

interface Estadisticas {
  pedidosPendientes: number;
  pedidosEnProceso: number;
  pedidosCompletados: number;
  productosStockBajo: number;
  totalVentas: number;
  usuariosActivos: number;
  totalPedidos: number;
}

interface EstadisticasDomainConfig {
  pedidos: Entity[];
  inventario: Entity[];
  usuarios: Entity[];
}

interface EstadisticasDomainOps {
  getEstadisticas: () => Estadisticas;
}

/**
 * Construye calculos de estadisticas de negocio.
 * Mantiene la logica derivada fuera del DataContext principal.
 */
export function createEstadisticasDomain({ pedidos, inventario, usuarios }: EstadisticasDomainConfig): EstadisticasDomainOps {
  const getEstadisticas = (): Estadisticas => {
    const pedidosPendientes = pedidos.filter((p) => p.estado === "pendiente").length;
    const pedidosEnProceso = pedidos.filter((p) => p.estado === "en_proceso").length;
    const pedidosCompletados = pedidos.filter(
      (p) => p.estado === "completado" || p.estado === "enviado",
    ).length;
    const productosStockBajo = inventario.filter((i) => i.stock <= i.stockMinimo).length;
    const totalVentas = pedidos.reduce((sum, p) => sum + (typeof p.total === "number" ? p.total : 0), 0);
    const usuariosActivos = usuarios.filter((u) => u.activo).length;

    return {
      pedidosPendientes,
      pedidosEnProceso,
      pedidosCompletados,
      productosStockBajo,
      totalVentas,
      usuariosActivos,
      totalPedidos: pedidos.length,
    };
  };

  return {
    getEstadisticas,
  };
}


