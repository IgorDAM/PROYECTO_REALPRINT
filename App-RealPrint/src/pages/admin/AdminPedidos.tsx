/**
 * Gestión de pedidos para el administrador.
 * Permite filtrar, buscar, ver detalles, cambiar estado y eliminar pedidos.
 * Aplica lógica de inventario según el estado del pedido.
 *
 * Buenas prácticas:
 * - Modulariza lógica de filtrado y actualización de estado
 * - Usa componentes UI reutilizables
 * - Documenta cada función relevante
 */
import { useState } from "react";
import type { ChangeEvent } from "react";
import { ESTADOS_PEDIDO } from "../../context/data/uiContracts";
import { useApiStatus } from "../../hooks/useApiStatus";
import { useInventarioData } from "../../hooks/useInventarioData";
import { usePedidosData } from "../../hooks/usePedidosData";
import { useProductosData } from "../../hooks/useProductosData";
import { Table, Button, Badge, Modal, Input, Select } from "../../components/ui";

type PedidoItem = Record<string, any>;

interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row?: PedidoItem) => JSX.Element | string;
}

export default function AdminPedidos() {
  const { pedidos, updatePedidoSafe, deletePedidoSafe } = usePedidosData();
  const { inventario } = useInventarioData();
  const { productosFinales } = useProductosData();
  const { loading: isProcessing, error: apiError, runApi } = useApiStatus();
  const [selectedPedido, setSelectedPedido] = useState<PedidoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const filteredPedidos = (pedidos as PedidoItem[])
    .filter(pedido => pedido && typeof pedido === "object" && pedido.id && pedido.cliente)
    .filter((pedido) => {
      const matchesSearch =
        String(pedido.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(pedido.cliente).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pedido.pedido ? String(pedido.pedido).toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
        (pedido.servicio ? String(pedido.servicio).toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
        (pedido.descripcion ? String(pedido.descripcion).toLowerCase().includes(searchTerm.toLowerCase()) : false);
      const matchesFilter = !filterEstado || pedido.estado === filterEstado;
      return matchesSearch && matchesFilter;
    });

  const handleViewDetails = (pedido: PedidoItem) => {
    setSelectedPedido(pedido);
    setIsModalOpen(true);
  };

  const handleUpdateEstado = async (id: string | number, nuevoEstado: string) => {
    await runApi(async () => {
      await updatePedidoSafe(id, { estado: nuevoEstado });
      if (selectedPedido?.id === id) {
        setSelectedPedido({ ...selectedPedido, estado: nuevoEstado });
      }
    }, "No se ha podido actualizar el estado del pedido");
  };

  const handleDeletePedido = async (id: string | number) => {
    const result = await runApi(
      () => deletePedidoSafe(id),
      "No se ha podido eliminar el pedido",
    );
    if (result !== null) setIsModalOpen(false);
  };

  const columns: TableColumn[] = [
    { key: "id", label: "ID", render: (value) => <span className="font-medium">#{value}</span> },
    { key: "cliente", label: "Cliente" },
    { key: "pedido", label: "Pedido" },
    { key: "productoFinalId", label: "Producto Final", render: (id) => {
      const pf = productosFinales.find((p: PedidoItem) => p.id == id);
      return pf ? pf.nombre : "-";
    } },
    { key: "fechaEntrega", label: "Entrega" },
    { key: "estado", label: "Estado", render: (value) => (
      <Badge variant={value}>{ESTADOS_PEDIDO[value]?.label || value}</Badge>
    ) },
    { key: "total", label: "Total", render: (value) => `€${typeof value === "number" ? value.toFixed(2) : "0.00"}` },
    {
      key: "acciones",
      label: "",
      render: (_, row) => (
        <Button size="sm" variant="ghost" onClick={() => handleViewDetails(row)}>
          Ver
        </Button>
      ),
    },
  ];

  const estadoOptions = Object.entries(ESTADOS_PEDIDO).map(([value, { label }]) => ({
    value,
    label,
  }));

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">Gestión de Pedidos</h1>
          <p className="text-surface-500 mt-1">{pedidos.length} pedidos en total</p>
        </div>
      </div>

      {apiError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          placeholder="Buscar por ID, cliente o pedido..."
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
        <Select
          options={estadoOptions}
          value={filterEstado}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterEstado(e.target.value)}
          placeholder="Filtrar por estado"
        />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => { setSearchTerm(""); setFilterEstado(""); }}
            className="flex-1"
          >
            Limpiar filtros
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto md:overflow-x-visible">
        <Table
          columns={columns}
          data={filteredPedidos}
          emptyMessage="No se encontraron pedidos"
        />
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Pedido #${selectedPedido?.id}`}
        size="lg"
      >
        {selectedPedido && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-surface-500 text-sm">Producto Final</p>
                              <p className="font-medium">
                                {(() => {
                                  const pf = productosFinales.find((p: PedidoItem) => p.id == selectedPedido.productoFinalId);
                                  return pf ? pf.nombre : "-";
                                })()}
                              </p>
                            </div>
                            <div>
                              <p className="text-surface-500 text-sm">Materiales Usados</p>
                              <p className="font-medium">
                                {(() => {
                                  const pf = productosFinales.find((p: PedidoItem) => p.id == selectedPedido.productoFinalId);
                                  if (!pf || !pf.productosInventario) return "-";
                                  return pf.productosInventario.map((id: string | number) => {
                                    const prod = inventario.find((i: PedidoItem) => i.id == id);
                                    return prod ? prod.nombre : id;
                                  }).join(", ");
                                })()}
                              </p>
                            </div>
              <div>
                <p className="text-surface-500 text-sm">Cliente</p>
                <p className="font-medium">{selectedPedido.cliente}</p>
              </div>
              <div>
                <p className="text-surface-500 text-sm">Pedido</p>
                <p className="font-medium">{selectedPedido.pedido}</p>
              </div>
              <div>
                <p className="text-surface-500 text-sm">Servicio</p>
                <p className="font-medium">{selectedPedido.servicio}</p>
              </div>
              <div>
                <p className="text-surface-500 text-sm">Cantidad</p>
                <p className="font-medium">{selectedPedido.cantidad}</p>
              </div>
              <div>
                <p className="text-surface-500 text-sm">Fecha de Pedido</p>
                <p className="font-medium">{selectedPedido.fecha}</p>
              </div>
              <div>
                <p className="text-surface-500 text-sm">Fecha de Entrega</p>
                <p className="font-medium">{selectedPedido.fechaEntrega}</p>
              </div>
              <div>
                <p className="text-surface-500 text-sm">Total</p>
                <p className="font-medium text-lg sm:text-xl">€{typeof selectedPedido.total === "number" ? selectedPedido.total.toFixed(2) : "0.00"}</p>
              </div>
              <div>
                <p className="text-surface-500 text-sm">Estado Actual</p>
                <Badge variant={selectedPedido.estado}>
                  {ESTADOS_PEDIDO[selectedPedido.estado]?.label}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-surface-500 text-sm mb-2">Descripción</p>
              <p className="bg-surface-100 p-3 rounded-lg text-sm sm:text-base">{selectedPedido.descripcion}</p>
            </div>

            <div>
              <p className="text-surface-500 text-sm mb-2">Cambiar Estado</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ESTADOS_PEDIDO).map(([key, { label }]) => (
                  <Button
                    key={key}
                    variant={selectedPedido.estado === key ? "primary" : "secondary"}
                    size="sm"
                    disabled={isProcessing}
                    onClick={() => handleUpdateEstado(selectedPedido.id, key)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-surface-200">
              <Button variant="danger" disabled={isProcessing} onClick={() => {
                handleDeletePedido(selectedPedido.id);
              }}>
                Eliminar Pedido
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

