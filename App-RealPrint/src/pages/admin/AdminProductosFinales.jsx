/**
 * Gestión de productos finales para el administrador.
 * Permite añadir, editar y eliminar productos finales y asociar materiales.
 * Calcula el precio automáticamente según materiales seleccionados.
 *
 * Buenas prácticas:
 * - Modulariza lógica de edición y filtrado
 * - Usa componentes UI reutilizables
 * - Documenta cada función relevante
 */
import { useState } from "react";
import { useData } from "../../context/DataContext";
import { Table, Button, Modal, Input, Select } from "../../components/ui";

export default function AdminProductosFinales() {
  const { productosFinales, addProductoFinal, updateProductoFinal, deleteProductoFinal, inventario, usuarios } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  // Solo un servicio y materiales asociados
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    servicio: "", // "serigrafia" o "rotulacion"
    subservicio: "", // "solo_serigrafia" o "serigrafia+planchado"
    quienRopa: "", // "cliente_ropa" o "realprint_ropa"
    materiales: [], // [{id, cantidad}]
    clientesPermitidos: [], // array de ids de clientes
    precio: 0,
    enCaja: false, // solo para serigrafía
    tamanoCaja: 50 // solo si enCaja
  });
  // ...existing code...
    // Columnas para la tabla de productos finales
    const columns = [
      { key: "nombre", label: "Nombre" },
      { key: "servicio", label: "Servicio" },
      { key: "subservicio", label: "Subservicio" },
      { key: "quienRopa", label: "Quién Ropa" },
      { key: "prenda", label: "Prenda", render: (value, row) => row.prenda || "-" },
      { key: "modelo", label: "Modelo", render: (value, row) => row.modelo || "-" },
      { key: "talla", label: "Talla", render: (value, row) => row.talla || "-" },
      { key: "tamanoCaja", label: "Tamaño Caja", render: (value, row) => row.enCaja ? row.tamanoCaja : "-" },
      { key: "precio", label: "Precio (€)" },
      { key: "acciones", label: "Acciones", render: (_, row) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleEdit(row)}>Editar</Button>
          <Button size="sm" variant="danger" onClick={() => deleteProductoFinal(row.id)}>Eliminar</Button>
        </div>
      ) }
    ];

    // Lógica para abrir modal de edición
    const handleEdit = (producto) => {
      setIsEdit(true);
      setEditId(producto.id);
      setNuevoProducto({ ...producto });
      setIsModalOpen(true);
    };

    // Lógica para abrir modal de nuevo producto
    const handleNuevo = () => {
      setIsEdit(false);
      setEditId(null);
      setNuevoProducto({
        nombre: "",
        servicio: "",
        subservicio: "",
        quienRopa: "",
        prenda: "",
        modelo: "",
        talla: "",
        materiales: [],
        clientesPermitidos: [],
        precio: 0,
        enCaja: false,
        tamanoCaja: 50
      });
      setIsModalOpen(true);
    };

    // Lógica para guardar producto
    const handleAdd = () => {
      if (isEdit) {
        updateProductoFinal(editId, nuevoProducto);
      } else {
        addProductoFinal(nuevoProducto);
      }
      setIsModalOpen(false);
    };

    // Render principal
    // Agrupar productos por prenda y modelo
    const agrupados = {};
    productosFinales.forEach(pf => {
      const key = `${pf.prenda || ""} - ${pf.modelo || ""}`;
      if (!agrupados[key]) agrupados[key] = [];
      agrupados[key].push(pf);
    });

    return (
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Productos Finales</h1>
          <Button onClick={handleNuevo}>Nuevo Producto Final</Button>
        </div>
        {/* Visualización agrupada */}
        {Object.entries(agrupados).map(([grupo, productos]) => (
          <div key={grupo} className="mb-8">
            <h2 className="text-lg font-bold text-primary-700 mb-2">{grupo}</h2>
            <div className="overflow-x-auto md:overflow-x-visible">
              <Table columns={columns} data={productos} emptyMessage="No hay productos finales en este grupo" />
            </div>
          </div>
        ))}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEdit ? "Editar Producto Final" : "Nuevo Producto Final"}>
          <div className="space-y-4">
            {/* ...existing code... */}
            <Input label="Nombre" value={nuevoProducto.nombre} onChange={e => setNuevoProducto(prev => ({ ...prev, nombre: e.target.value }))} required />
            <Select label="Servicio" value={nuevoProducto.servicio} onChange={e => setNuevoProducto(prev => ({ ...prev, servicio: e.target.value }))} options={[{ value: "serigrafia", label: "Serigrafía" }, { value: "rotulacion", label: "Rotulación" }]} required />
            {nuevoProducto.servicio === "serigrafia" && (
              <>
                <Select label="Subservicio" value={nuevoProducto.subservicio} onChange={e => setNuevoProducto(prev => ({ ...prev, subservicio: e.target.value }))} options={[{ value: "solo_serigrafia", label: "Solo Serigrafía" }, { value: "serigrafia+planchado", label: "Serigrafía + Planchado" }]} required />
                {nuevoProducto.subservicio === "serigrafia+planchado" && (
                  <Select label="¿Quién proporciona la ropa?" value={nuevoProducto.quienRopa} onChange={e => setNuevoProducto(prev => ({ ...prev, quienRopa: e.target.value }))} options={[{ value: "cliente_ropa", label: "El cliente entrega la ropa" }, { value: "realprint_ropa", label: "RealPrint proporciona la ropa" }, { value: "ambas", label: "Ambas" }]} required />
                )}
                {/* Campos extra para serigrafía */}
                <Select
                  label="Prenda"
                  value={nuevoProducto.prenda || ""}
                  onChange={e => setNuevoProducto(prev => ({ ...prev, prenda: e.target.value }))}
                  options={[{ value: "Camiseta", label: "Camiseta" }, { value: "Pantalón", label: "Pantalón" }, { value: "Chándal", label: "Chándal" }, { value: "Anorak", label: "Anorak" }]}
                  required
                />
                <Select
                  label="Modelo"
                  value={nuevoProducto.modelo || ""}
                  onChange={e => setNuevoProducto(prev => ({ ...prev, modelo: e.target.value }))}
                  options={[{ value: "1ª equipación", label: "1ª equipación" }, { value: "2ª equipación", label: "2ª equipación" }, { value: "3ª equipación", label: "3ª equipación" }]}
                  required
                />
                <Select
                  label="Talla"
                  value={nuevoProducto.talla || ""}
                  onChange={e => setNuevoProducto(prev => ({ ...prev, talla: e.target.value }))}
                  options={[
                    { value: "128", label: "128 (niño)" },
                    { value: "140", label: "140 (niño)" },
                    { value: "152", label: "152 (niño)" },
                    { value: "164", label: "164 (niño)" },
                    { value: "S_hombre", label: "S (hombre)" },
                    { value: "M_hombre", label: "M (hombre)" },
                    { value: "L_hombre", label: "L (hombre)" },
                    { value: "XL_hombre", label: "XL (hombre)" },
                    { value: "XXL_hombre", label: "XXL (hombre)" },
                    { value: "S_mujer", label: "S (mujer)" },
                    { value: "M_mujer", label: "M (mujer)" },
                    { value: "L_mujer", label: "L (mujer)" },
                    { value: "XL_mujer", label: "XL (mujer)" }
                  ]}
                  required
                />
                <Input label="Tamaño Caja" type="number" min={1} value={nuevoProducto.tamanoCaja} onChange={e => setNuevoProducto(prev => ({ ...prev, tamanoCaja: Number(e.target.value) }))} />
                <div className="text-xs text-gray-500">El nombre se puede autogenerar con prenda, modelo y talla</div>
              </>
            )}
            {/* Selección de materiales */}
            <div>
              <div className="font-semibold mb-1">Materiales asociados</div>
              <div className="flex flex-col gap-2">
                {inventario.filter(prod => prod.serviciosDisponibles && prod.serviciosDisponibles.includes(nuevoProducto.servicio)).map(prod => {
                  const material = nuevoProducto.materiales.find(m => m.id === prod.id);
                  return (
                    <div key={prod.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={!!material} onChange={e => {
                        const checked = e.target.checked;
                        setNuevoProducto(prev => {
                          let nuevos = prev.materiales ? [...prev.materiales] : [];
                          if (checked) {
                            if (!nuevos.find(m => m.id === prod.id)) nuevos.push({ id: prod.id, cantidad: 1 });
                          } else {
                            nuevos = nuevos.filter(m => m.id !== prod.id);
                          }
                          return { ...prev, materiales: nuevos };
                        });
                      }} />
                      <span>{prod.nombre}</span>
                      {material && (
                        <input type="number" min={1} value={material.cantidad} onChange={e => {
                          const cantidad = Math.max(1, Number(e.target.value));
                          setNuevoProducto(prev => ({
                            ...prev,
                            materiales: prev.materiales.map(m => m.id === prod.id ? { ...m, cantidad } : m)
                          }));
                        }} className="w-16 border rounded px-2 py-1 ml-2" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Selección de clientes permitidos */}
            <div>
              <div className="font-semibold mb-1">Clientes con acceso a este producto</div>
              <div className="flex flex-wrap gap-2">
                {usuarios?.filter(u => u.role === "cliente").map(cliente => (
                  <label key={cliente.id} className="flex items-center gap-1 border rounded px-2 py-1 cursor-pointer">
                    <input type="checkbox" checked={nuevoProducto.clientesPermitidos.includes(cliente.id) || nuevoProducto.clientesPermitidos.includes(String(cliente.id))} onChange={e => {
                      const checked = e.target.checked;
                      setNuevoProducto(prev => {
                        let actual = prev.clientesPermitidos.map(String);
                        if (checked) {
                          if (!actual.includes(String(cliente.id))) actual = [...actual, String(cliente.id)];
                        } else {
                          actual = actual.filter(cid => cid !== String(cliente.id));
                        }
                        return { ...prev, clientesPermitidos: actual };
                      });
                    }} />
                    {cliente.nombre}
                  </label>
                ))}
              </div>
            </div>
            <Input label="Precio (€)" type="number" min={0} value={nuevoProducto.precio} onChange={e => setNuevoProducto(prev => ({ ...prev, precio: Number(e.target.value) }))} required />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleAdd}>Guardar</Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  // Falta el resto del componente, aquí deberías añadir el JSX y la lógica del renderizado
}
