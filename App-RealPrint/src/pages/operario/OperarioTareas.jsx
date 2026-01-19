/**
 * Página de tareas del operario.
 * Muestra tareas asignadas, permite cambiar su estado y ver detalles del pedido asociado.
 *
 * Buenas prácticas:
 * - Modulariza lógica de filtrado y acciones
 * - Usa componentes UI reutilizables
 * - Documenta cada función relevante
 */
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Table, Badge, Button } from "../../components/ui";

export default function OperarioTareas() {
  const { user } = useAuth();
  const { tareas, pedidos, updateTarea, updatePedido, inventario, updateInventario, productosFinales } = useData();

  const misTareas = tareas.filter((t) => t.operarioId === user?.id);

  const handleCambiarEstado = (tareaId, nuevoEstado) => {
    updateTarea(tareaId, { estado: nuevoEstado });
    // Buscar la tarea y actualizar el estado del pedido asociado
    const tarea = tareas.find((t) => t.id === tareaId);
    if (tarea && tarea.pedidoId) {
      updatePedido(tarea.pedidoId, { estado: nuevoEstado });
      // Si se completa, actualizar inventario y usados
      if (nuevoEstado === "completado") {
        const pedido = pedidos.find((p) => p.id === tarea.pedidoId);
        if (pedido && pedido.productoFinalId) {
          // Buscar el producto final y descontar del inventario
          const productoFinal = productosFinales.find(pf => pf.id === pedido.productoFinalId);
          // Si el producto final tiene productos de inventario asociados
          if (productoFinal && productoFinal.productosInventario) {
            productoFinal.productosInventario.forEach(id => {
              const prod = inventario.find(i => i.id === id);
              if (prod) {
                // Descontar la cantidad producida (por defecto, cantidad o unidadesPorCaja)
                const cantidad = pedido.cantidad || pedido.unidadesPorCaja || 1;
                updateInventario(id, {
                  stock: Math.max(0, prod.stock - cantidad),
                  usados: (prod.usados || 0) + cantidad
                });
              }
            });
          }
        }
      }
    }
  };

  const getEstadoBadge = (estado) => {
    const variantes = {
      pendiente: "warning",
      en_proceso: "info",
      completado: "success",
    };
    const labels = {
      pendiente: "Pendiente",
      en_proceso: "En Proceso",
      completado: "Completado",
    };
    return <Badge variant={variantes[estado]}>{labels[estado]}</Badge>;
  };

  const tareasConPedido = misTareas.map((tarea) => {
    const pedido = pedidos.find((p) => p.id === tarea.pedidoId);
    return {
      ...tarea,
      cliente: pedido?.cliente || "N/A",
      pedido: pedido?.pedido || "N/A",
      fechaEntrega: pedido?.fechaEntrega || "N/A",
    };
  });

  const columns = [
    { key: "tarea", label: "Tarea", render: (value) => <span className="font-medium">{value}</span> },
    { key: "pedidoId", label: "Pedido", render: (value) => `#${value}` },
    { key: "pedido", label: "Pedido" },
    { key: "cliente", label: "Cliente" },
    { key: "fechaEntrega", label: "Entrega" },
    { 
      key: "estado", 
      label: "Estado",
      render: (value) => getEstadoBadge(value)
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (_, row) => (
        <div className="flex gap-2">
          {row.estado === "pendiente" && (
            <Button size="sm" variant="secondary" onClick={() => handleCambiarEstado(row.id, "en_proceso")}>
              Iniciar
            </Button>
          )}
          {row.estado === "en_proceso" && (
            <Button size="sm" variant="success" onClick={() => handleCambiarEstado(row.id, "completado")}>
              Completar
            </Button>
          )}
          {row.estado === "completado" && (
            <span className="text-emerald-600 text-sm font-medium flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Completado</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">Mis Tareas</h1>
        <p className="text-surface-500 mt-1">{misTareas.length} tareas asignadas</p>
      </div>

      <Table 
        columns={columns} 
        data={tareasConPedido}
        emptyMessage="No tienes tareas asignadas"
      />
    </div>
  );
}
