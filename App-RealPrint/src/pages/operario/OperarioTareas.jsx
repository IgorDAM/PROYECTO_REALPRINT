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
import { useApiStatus } from "../../hooks/useApiStatus";
import { usePedidosData } from "../../hooks/usePedidosData";
import { useTareasData } from "../../hooks/useTareasData";
import { Table, Badge, Button } from "../../components/ui";

export default function OperarioTareas() {
  const { user } = useAuth();
  const { tareas, updateTarea } = useTareasData();
  const { pedidos, updatePedidoSafe } = usePedidosData();
  const { loading: isProcessing, error: apiError, runApi } = useApiStatus();

  const misTareas = tareas.filter((t) => t.operarioId === user?.id);

  const handleCambiarEstado = async (tareaId, nuevoEstado) => {
    updateTarea(tareaId, { estado: nuevoEstado });
    await runApi(async () => {
      // Buscar la tarea y actualizar el estado del pedido asociado
      const tarea = tareas.find((t) => t.id === tareaId);
      if (tarea && tarea.pedidoId) {
        await updatePedidoSafe(tarea.pedidoId, { estado: nuevoEstado });
      }
    }, "No se ha podido actualizar la tarea");
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
            <Button size="sm" variant="secondary" disabled={isProcessing} onClick={() => handleCambiarEstado(row.id, "en_proceso")}>
              Iniciar
            </Button>
          )}
          {row.estado === "en_proceso" && (
            <Button size="sm" variant="success" disabled={isProcessing} onClick={() => handleCambiarEstado(row.id, "completado")}>
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

      {apiError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      <Table 
        columns={columns} 
        data={tareasConPedido}
        emptyMessage="No tienes tareas asignadas"
      />
    </div>
  );
}
