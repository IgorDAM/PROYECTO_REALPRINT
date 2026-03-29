/**
 * Lista de pedidos asignados al operario actual.
 * Filtra pedidos según la especialidad del operario y el estado del pedido.
 * 
 * Cambios realizados:
 * - Conecta con el contexto de datos (usePedidosData, useAuth)
 * - Filtra pedidos por especialidad del operario
 * - Muestra solo pedidos en estado "pendiente" o "en_proceso"
 * - Información real del pedido del cliente
 */
import { useAuth } from "../context/AuthContext";
import { usePedidosData } from "../hooks/usePedidosData";
import { useProductosData } from "../hooks/useProductosData";
import PedidoOperario from "./PedidoOperario";

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

function ListaPedidosOperario() {
  const { user } = useAuth();
  const { pedidos, updatePedido } = usePedidosData();
  const { productosFinales } = useProductosData();

  // DEBUG: Logs para entender qué pasa
  console.log('=== DEBUG ListaPedidosOperario ===');
  console.log('Usuario:', user);
  console.log('Especialidad del usuario:', user?.especialidad);
  console.log('Total de pedidos en contexto:', (pedidos || []).length);
  console.log('Todos los pedidos:', pedidos);
  console.log('Servicios de pedidos:', (pedidos || []).map((p: any) => ({ id: p.id, servicio: p.servicio, cliente: p.cliente })));

  // Filtrar pedidos que correspondan a este operario
  // Según su especialidad (servicio del pedido)
  const pedidosDelOperario = (pedidos || []).filter((p: any) => {
    // Filtrar por especialidad del operario
    const esDelServicio = p.servicio === user?.especialidad;
    // Solo mostrar pedidos activos (no completados, cancelados, etc.)
    const esActivo = p.estado === "pendiente" || p.estado === "en_proceso";
    console.log(`Pedido ${p.id}: servicio=${p.servicio}, especialidad=${user?.especialidad}, match=${esDelServicio}, estado=${p.estado}, activo=${esActivo}`);
    return esDelServicio && esActivo;
  });

  console.log('Pedidos después de filtrar:', pedidosDelOperario.length);
  console.log('=====================================');

  // Mapear pedidos a formato para mostrar
  const pedidosFormateados: PedidoOperarioItem[] = pedidosDelOperario.map((p: any) => {
    const productoFinal = productosFinales.find((pf: any) => pf.id == p.productoFinalId);
    const unidadesPorCaja = p.tamanoCaja || productoFinal?.tamanoCaja || 50;
    const cantidadCajas = p.boxTotal || 1;
    const cajasCompletadas = p.estado === "completado" ? cantidadCajas : 0;

    return {
      id: p.id,
      cliente: p.cliente || "N/A",
      totalUnidades: p.cantidadUnidades || 50,
      unidadesPorCaja,
      cajasTotales: cantidadCajas,
      cajasCompletadas,
      estado: p.estado,
      fechaEntrega: p.fechaEntrega || "N/A",
      productoNombre: productoFinal?.nombre || "Producto desconocido",
    };
  });

  const actualizarCajas = (pedidoId: string | number, nuevasCajasCompletadas: number) => {
    // Actualizar estado del pedido según progreso de cajas
    const pedidoActual = pedidosDelOperario.find((p: any) => p.id === pedidoId);
    if (pedidoActual) {
      const totalCajas = pedidoActual.boxTotal || 1;
      let nuevoEstado = "en_proceso";
      if (nuevasCajasCompletadas >= totalCajas) {
        nuevoEstado = "completado";
      }
      updatePedido(pedidoId, { estado: nuevoEstado });
    }
  };

  if (pedidosFormateados.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-surface-500">No hay pedidos asignados en este momento</p>
      </div>
    );
  }

  return (
    <div>
      {pedidosFormateados.map(pedido => (
        <PedidoOperario
          key={pedido.id}
          pedido={pedido}
          onActualizarCajas={actualizarCajas}
        />
      ))}
    </div>
  );
}

export default ListaPedidosOperario;
