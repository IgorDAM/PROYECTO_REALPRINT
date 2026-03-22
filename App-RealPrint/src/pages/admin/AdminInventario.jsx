/**
 * Gestión de inventario para el administrador.
 * Permite filtrar, buscar, editar, añadir y eliminar productos del inventario.
 * Separa inventario por servicios (serigrafía, rotulación).
 *
 * Buenas prácticas:
 * - Modulariza lógica de filtrado y edición
 * - Usa componentes UI reutilizables
 * - Documenta cada función relevante
 */
import { useState } from "react";
import { useApiStatus } from "../../hooks/useApiStatus";
import { useInventarioData } from "../../hooks/useInventarioData";
import { Table, Button, Badge, Modal, Input, Select } from "../../components/ui";

const CATEGORIAS = [
  { value: "Textil", label: "Textil" },
  { value: "Vinilo", label: "Vinilo" },
  { value: "Tintas", label: "Tintas" },
  { value: "Transfer", label: "Transfer" },
  { value: "Otros", label: "Otros" },
];

export default function AdminInventario() {
  const { inventario, updateInventarioSafe, addInventarioSafe, deleteInventarioSafe } = useInventarioData();
  const { loading: isProcessing, error: apiError, runApi } = useApiStatus();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [newItem, setNewItem] = useState({
    nombre: "",
    categoria: "",
    stock: 0,
    stockMinimo: 0,
    precio: 0,
    disponibleParaPedidos: false,
    serviciosDisponibles: [],
  });

  const filteredInventario = inventario.filter((item) => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterCategoria || item.categoria === filterCategoria;
    return matchesSearch && matchesFilter;
  });

  // Separar por servicio
  const inventarioSerigrafia = filteredInventario.filter(item => item.serviciosDisponibles && item.serviciosDisponibles.includes("serigrafia"));
  const inventarioRotulacion = filteredInventario.filter(item => item.serviciosDisponibles && item.serviciosDisponibles.includes("rotulacion"));

  const handleEdit = (item) => {
    setSelectedItem({
      ...item,
      serviciosDisponibles: item.serviciosDisponibles || [],
      disponibleParaPedidos: item.disponibleParaPedidos || false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const result = await runApi(
      () => updateInventarioSafe(selectedItem.id, selectedItem),
      "No se ha podido guardar el producto",
    );
    if (result !== null) setIsModalOpen(false);
  };

  const handleAdd = async () => {
    if (newItem.nombre && newItem.categoria) {
      const result = await runApi(
        () => addInventarioSafe(newItem),
        "No se ha podido anadir el producto",
      );
      if (result !== null) {
        setNewItem({ nombre: "", categoria: "", stock: 0, stockMinimo: 0, precio: 0, disponibleParaPedidos: false, serviciosDisponibles: [] });
        setIsAddModalOpen(false);
      }
    }
  };

  const handleDelete = async (id) => {
    await runApi(
      () => deleteInventarioSafe(id),
      "No se ha podido eliminar el producto",
    );
  };

  const columns = [
    { key: "nombre", label: "Producto", render: (value) => <span className="font-medium">{value}</span> },
    { key: "categoria", label: "Categoría" },
    { 
      key: "stock", 
      label: "Stock",
      render: (value, row) => (
        <span className={value <= row.stockMinimo ? "text-amber-600 font-bold" : "text-surface-700"}>
          {value}
        </span>
      )
    },
    { key: "stockMinimo", label: "Stock Mínimo" },
    { key: "usados", label: "Usados", render: (value) => <span className="text-surface-700 font-semibold">{value ?? 0}</span> },
    {
      key: "precio", 
      label: "Precio",
      render: (value) => `€${value.toFixed(2)}`
    },
    {
      key: "estado",
      label: "Estado",
      render: (_, row) => (
        <Badge variant={row.stock <= row.stockMinimo ? "warning" : "success"}>
          {row.stock <= row.stockMinimo ? "Stock Bajo" : "Normal"}
        </Badge>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (_, row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => handleEdit(row)}>
            Editar
          </Button>
          <Button size="sm" variant="danger" disabled={isProcessing} onClick={() => handleDelete(row.id)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  const stockBajo = inventario.filter((i) => i.stock <= i.stockMinimo).length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">Inventario</h1>
          <p className="text-surface-500 mt-1">
            {inventario.length} productos | <span className="text-amber-600 font-semibold">{stockBajo} con stock bajo</span>
          </p>
        </div>
        <Button
          icon="add"
          data-testid="inventario-add-button"
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto"
        >
          Añadir Producto
        </Button>
      </div>

      {apiError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          id="inventario-search"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          id="inventario-filter-categoria"
          options={CATEGORIAS}
          value={filterCategoria}
          onChange={(e) => setFilterCategoria(e.target.value)}
          placeholder="Filtrar por categoría"
        />
        <Button 
          variant="secondary" 
          onClick={() => { setSearchTerm(""); setFilterCategoria(""); }}
        >
          Limpiar filtros
        </Button>
      </div>

      {/* Tabla Serigrafía */}
      <h2 className="text-lg font-bold mt-8 mb-2 text-surface-900">Inventario Serigrafía</h2>
      <Table
        columns={columns} 
        data={inventarioSerigrafia}
        emptyMessage="No se encontraron productos de serigrafía"
      />
      {/* Tabla Rotulación */}
      <h2 className="text-lg font-bold mt-8 mb-2 text-surface-900">Inventario Rotulación</h2>
      <Table
        columns={columns} 
        data={inventarioRotulacion}
        emptyMessage="No se encontraron productos de rotulación"
      />

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Editar Producto"
      >
        {selectedItem && (
          <div className="space-y-4">
            <Input
              id="edit-nombre"
              label="Nombre"
              value={selectedItem.nombre}
              onChange={(e) => setSelectedItem({ ...selectedItem, nombre: e.target.value })}
            />
            <Select
              id="edit-categoria"
              label="Categoría"
              options={CATEGORIAS}
              value={selectedItem.categoria}
              onChange={(e) => setSelectedItem({ ...selectedItem, categoria: e.target.value })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                id="edit-stock"
                label="Stock"
                type="number"
                value={selectedItem.stock}
                onChange={(e) => setSelectedItem({ ...selectedItem, stock: parseInt(e.target.value) || 0 })}
              />
              <Input
                id="edit-stock-minimo"
                label="Stock Mínimo"
                type="number"
                value={selectedItem.stockMinimo}
                onChange={(e) => setSelectedItem({ ...selectedItem, stockMinimo: parseInt(e.target.value) || 0 })}
              />
              <Input
                id="edit-precio"
                label="Precio (€)"
                type="number"
                step="0.01"
                value={selectedItem.precio}
                onChange={(e) => setSelectedItem({ ...selectedItem, precio: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={selectedItem.disponibleParaPedidos || false}
                onChange={e => setSelectedItem({ ...selectedItem, disponibleParaPedidos: e.target.checked })}
              />
              <span>Disponible para pedidos</span>
            </label>
            <div className="block mb-1 mt-2">
              <span className="font-medium">Servicio disponible para este producto:</span>
              <div className="flex flex-wrap gap-3 mt-2">
                {[{ value: "serigrafia", label: "Serigrafía" }, { value: "rotulacion", label: "Rotulación" }].map(servicio => (
                  <label key={servicio.value} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="servicio-editar"
                      checked={selectedItem.serviciosDisponibles?.[0] === servicio.value}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedItem(prev => ({ ...prev, serviciosDisponibles: [servicio.value] }));
                        }
                      }}
                      required
                    />
                    {servicio.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isProcessing}>
                {isProcessing ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Añadir Producto"
      >
        <div className="space-y-4">
          <Input
            id="add-nombre"
            label="Nombre"
            value={newItem.nombre}
            onChange={(e) => setNewItem({ ...newItem, nombre: e.target.value })}
          />
          <Select
            id="add-categoria"
            label="Categoría"
            options={CATEGORIAS}
            value={newItem.categoria}
            onChange={(e) => setNewItem({ ...newItem, categoria: e.target.value })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              id="add-stock"
              label="Stock"
              type="number"
              value={newItem.stock}
              onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
            />
            <Input
              id="add-stock-minimo"
              label="Stock Mínimo"
              type="number"
              value={newItem.stockMinimo}
              onChange={(e) => setNewItem({ ...newItem, stockMinimo: parseInt(e.target.value) || 0 })}
            />
            <Input
              id="add-precio"
              label="Precio (€)"
              type="number"
              step="0.01"
              value={newItem.precio}
              onChange={(e) => setNewItem({ ...newItem, precio: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={newItem.disponibleParaPedidos || false}
              onChange={e => setNewItem({ ...newItem, disponibleParaPedidos: e.target.checked })}
            />
            <span>Disponible para pedidos</span>
          </label>
          <div className="block mb-1 mt-2">
            <span className="font-medium">Servicio disponible para este producto:</span>
            <div className="flex flex-wrap gap-3 mt-2">
              {[{ value: "serigrafia", label: "Serigrafía" }, { value: "rotulacion", label: "Rotulación" }].map(servicio => (
                <label key={servicio.value} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="servicio-nuevo"
                    checked={newItem.serviciosDisponibles?.[0] === servicio.value}
                    onChange={e => {
                      if (e.target.checked) {
                        setNewItem(prev => ({ ...prev, serviciosDisponibles: [servicio.value] }));
                      }
                    }}
                    required
                  />
                  {servicio.label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={isProcessing}>
              {isProcessing ? "Anadiendo..." : "Anadir Producto"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
