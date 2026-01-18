import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { StatCard, GlassCard, Badge, Table } from "../../components/ui";

export default function OperarioDashboard() {
  const { user } = useAuth();
  const { tareas, pedidos, updateTarea } = useData();

  // Filtrar tareas del operario actual
  const misTareas = tareas.filter((t) => t.operarioId === user?.id);
  const tareasPendientes = misTareas.filter((t) => t.estado === "pendiente");
  const tareasEnProceso = misTareas.filter((t) => t.estado === "en_proceso");

  const handleCambiarEstado = (tareaId, nuevoEstado) => {
    updateTarea(tareaId, { estado: nuevoEstado });
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

  // Obtener info del pedido para cada tarea
  const tareasConPedido = misTareas.map((tarea) => {
    const pedido = pedidos.find((p) => p.id === tarea.pedidoId);
    return {
      ...tarea,
      cliente: pedido?.cliente || "N/A",
      fechaEntrega: pedido?.fechaEntrega || "N/A",
    };
  });

  const columns = [
    { key: "tarea", label: "Tarea", render: (value) => <span className="font-medium">{value}</span> },
    { key: "pedidoId", label: "Pedido", render: (value) => `#${value}` },
    { key: "cliente", label: "Cliente" },
    { key: "fechaEntrega", label: "Fecha Entrega" },
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
            <button
              onClick={() => handleCambiarEstado(row.id, "en_proceso")}
              className="text-xs px-3 py-1.5 rounded-lg bg-primary-100 text-primary-700 font-medium hover:bg-primary-200 transition-colors"
            >
              Iniciar
            </button>
          )}
          {row.estado === "en_proceso" && (
            <button
              onClick={() => handleCambiarEstado(row.id, "completado")}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 font-medium hover:bg-emerald-200 transition-colors"
            >
              Completar
            </button>
          )}
          {row.estado === "completado" && (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Hecho</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">Panel de Operaciones</h1>
        <p className="text-surface-500 mt-1">Bienvenido, <span className="text-primary-600 font-semibold">{user?.name}</span></p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard
          title="Tareas Pendientes"
          value={tareasPendientes.length}
          icon="pending_actions"
        />
        <StatCard
          title="En Proceso"
          value={tareasEnProceso.length}
          icon="autorenew"
        />
        <StatCard
          title="Total Asignadas"
          value={misTareas.length}
          icon="task"
        />
      </div>

      {/* Quick Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <GlassCard className="p-6 lg:col-span-2" hover={false}>
          <h3 className="text-lg font-bold text-surface-900 mb-4">Tareas Urgentes</h3>
          {tareasPendientes.length === 0 ? (
            <p className="text-surface-500">No hay tareas pendientes urgentes</p>
          ) : (
            <div className="space-y-3">
              {tareasPendientes.slice(0, 3).map((tarea) => {
                const pedido = pedidos.find((p) => p.id === tarea.pedidoId);
                return (
                  <div key={tarea.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div>
                      <p className="font-semibold text-surface-900">{tarea.tarea}</p>
                      <p className="text-sm text-surface-500">
                        Pedido #{tarea.pedidoId} - {pedido?.cliente}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCambiarEstado(tarea.id, "en_proceso")}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium hover:from-primary-700 hover:to-primary-800 transition-all shadow-blue"
                    >
                      Iniciar
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6" hover={false}>
          <h3 className="text-lg font-bold text-surface-900 mb-4">En Progreso</h3>
          {tareasEnProceso.length === 0 ? (
            <p className="text-surface-500">No hay tareas en progreso</p>
          ) : (
            <div className="space-y-3">
              {tareasEnProceso.map((tarea) => (
                <div key={tarea.id} className="p-3 bg-primary-50 rounded-xl border border-primary-200">
                  <p className="font-semibold text-sm text-surface-900">{tarea.tarea}</p>
                  <p className="text-xs text-surface-500 mt-1">Pedido #{tarea.pedidoId}</p>
                  <button
                    onClick={() => handleCambiarEstado(tarea.id, "completado")}
                    className="mt-2 w-full text-xs px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors"
                  >
                    Marcar Completado
                  </button>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* All Tasks Table */}
      <h3 className="text-xl font-bold text-surface-900 mb-4">Todas mis Tareas</h3>
      <Table 
        columns={columns} 
        data={tareasConPedido}
        emptyMessage="No tienes tareas asignadas"
      />
    </div>
  );
}
