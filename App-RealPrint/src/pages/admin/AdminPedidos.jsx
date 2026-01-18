import { useState } from "react";
import { useData, ESTADOS_PEDIDO } from "../../context/DataContext";
import { Table, Button, Badge, Modal, Input, Select } from "../../components/ui";

export default function AdminPedidos() {
  const { pedidos, updatePedido, deletePedido, productosFinales, inventario } = useData();
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const filteredPedidos = pedidos
    .filter(pedido => pedido && typeof pedido === "object" && pedido.id && pedido.cliente && pedido.proyecto)
    .filter((pedido) => {
      const matchesSearch = 
        pedido.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.proyecto.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = !filterEstado || pedido.estado === filterEstado;
      return matchesSearch && matchesFilter;
    });

  const handleViewDetails = (pedido) => {
    setSelectedPedido(pedido);
    setIsModalOpen(true);
  };

  const handleUpdateEstado = (id, nuevoEstado) => {
    updatePedido(id, { estado: nuevoEstado });
    if (selectedPedido?.id === id) {
      setSelectedPedido({ ...selectedPedido, estado: nuevoEstado });
    }
  };

  const columns = [
    { key: "id", label: "ID Pedido", render: (value) => <span className="font-medium">#{value}</span> },
    { key: "cliente", label: "Cliente" },
    { key: "proyecto", label: "Proyecto" },
    { key: "servicio", label: "Servicio" },
    { key: "productoFinalId", label: "Producto Final", render: (id) => {
      const pf = productosFinales.find(p => p.id == id);
      return pf ? pf.nombre : "-";
    } },
    { key: "fechaEntrega", label: "Entrega" },
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
    {
      key: "materialesUsados",
      label: "Materiales Usados",
      render: (_, row) => {
        const pf = productosFinales.find(p => p.id == row.productoFinalId);
        if (!pf || !pf.productosInventario) return "-";
        return pf.productosInventario.map(id => {
          const prod = inventario.find(i => i.id == id);
          return prod ? prod.nombre : id;
        }).join(", ");
      }
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (_, row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => handleViewDetails(row)}>
            Ver
          </Button>
        </div>
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

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          placeholder="Buscar por ID, cliente o proyecto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          options={estadoOptions}
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
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
      <Table 
        columns={columns} 
        data={filteredPedidos}
        emptyMessage="No se encontraron pedidos"
      />

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
                                  const pf = productosFinales.find(p => p.id == selectedPedido.productoFinalId);
                                  return pf ? pf.nombre : "-";
                                })()}
                              </p>
                            </div>
                            <div>
                              <p className="text-surface-500 text-sm">Materiales Usados</p>
                              <p className="font-medium">
                                {(() => {
                                  const pf = productosFinales.find(p => p.id == selectedPedido.productoFinalId);
                                  if (!pf || !pf.productosInventario) return "-";
                                  return pf.productosInventario.map(id => {
                                    const prod = inventario.find(i => i.id == id);
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
                <p className="text-surface-500 text-sm">Proyecto</p>
                <p className="font-medium">{selectedPedido.proyecto}</p>
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
                <p className="font-medium text-lg sm:text-xl">€{selectedPedido.total.toFixed(2)}</p>
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
                    onClick={() => handleUpdateEstado(selectedPedido.id, key)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-surface-200">
              <Button variant="danger" onClick={() => {
                deletePedido(selectedPedido.id);
                setIsModalOpen(false);
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
