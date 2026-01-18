/**
 * Historial de pedidos para el administrador.
 * Permite filtrar por estado, fecha y buscar pedidos completados, enviados o cancelados.
 *
 * Buenas prácticas:
 * - Modulariza lógica de filtrado y columnas de tabla
 * - Usa componentes UI reutilizables
 * - Documenta cada función relevante
 */
import { useState } from "react";
import { useData, ESTADOS_PEDIDO } from "../../context/DataContext";
import { Table, Button, Badge, Input, Select } from "../../components/ui";

export default function AdminHistorial() {
  const { pedidos } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterFechaDesde, setFilterFechaDesde] = useState("");
  const [filterFechaHasta, setFilterFechaHasta] = useState("");

  // Filtrar solo pedidos completados, enviados o cancelados
  const historialPedidos = pedidos.filter((p) => 
    ["completado", "enviado", "cancelado"].includes(p.estado)
  );

  const filteredPedidos = historialPedidos.filter((pedido) => {
    const matchesSearch = 
      pedido.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterEstado || pedido.estado === filterEstado;
    const matchesFechaDesde = !filterFechaDesde || pedido.fecha >= filterFechaDesde;
    const matchesFechaHasta = !filterFechaHasta || pedido.fecha <= filterFechaHasta;
    return matchesSearch && matchesFilter && matchesFechaDesde && matchesFechaHasta;
  });

  const columns = [
    { key: "id", label: "ID Pedido", render: (value) => <span className="font-medium">#{value}</span> },
    { key: "cliente", label: "Cliente" },
    { key: "pedido", label: "Pedido" },
    { key: "fecha", label: "Fecha Pedido" },
    { key: "fechaEntrega", label: "Fecha Entrega" },
    { 
      key: "estado", 
      label: "Estado",
      render: (value) => (
        <Badge variant={value}>{ESTADOS_PEDIDO[value]?.label || value}</Badge>
      )
    },
    { 
      key: "total", 
      label: "Total",
      render: (value) => `€${value.toFixed(2)}`
    },
  ];

  const estadoOptions = [
    { value: "completado", label: "Completado" },
    { value: "enviado", label: "Enviado" },
    { value: "cancelado", label: "Cancelado" },
  ];

  const totalVentas = filteredPedidos.reduce((sum, p) => 
    p.estado !== "cancelado" ? sum + p.total : sum, 0
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">Historial de Pedidos</h1>
          <p className="text-surface-500 mt-1">
            {filteredPedidos.length} pedidos finalizados | Total ventas: <span className="text-primary-600 font-semibold">€{totalVentas.toFixed(2)}</span>
          </p>
        </div>
        <Button icon="download" variant="secondary" className="w-full sm:w-auto">
          Exportar
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Input
          placeholder="Buscar por ID o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:col-span-2 lg:col-span-1"
        />
        <Select
          options={estadoOptions}
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          placeholder="Estado"
        />
        <Input
          type="date"
          value={filterFechaDesde}
          onChange={(e) => setFilterFechaDesde(e.target.value)}
        />
        <Input
          type="date"
          value={filterFechaHasta}
          onChange={(e) => setFilterFechaHasta(e.target.value)}
        />
        <Button 
          variant="secondary" 
          onClick={() => { 
            setSearchTerm(""); 
            setFilterEstado(""); 
            setFilterFechaDesde("");
            setFilterFechaHasta("");
          }}
          className="sm:col-span-2 lg:col-span-1"
        >
          Limpiar
        </Button>
      </div>

      {/* Table */}
      <Table 
        columns={columns} 
        data={filteredPedidos}
        emptyMessage="No hay pedidos en el historial"
      />
    </div>
  );
}
