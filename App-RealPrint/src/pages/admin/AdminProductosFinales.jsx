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
    subservicio: "", // "solo_dtf" o "dtf_planchado"
    quienRopa: "", // "cliente_ropa" o "realprint_ropa"
    materiales: [], // [{id, cantidad}]
    clientesPermitidos: [], // array de ids de clientes
    precio: 0,
  });

  const handleAdd = () => {
    if (!nuevoProducto.nombre || !nuevoProducto.servicio) return;
    // Calcular el precio sumando los precios de los materiales seleccionados
    const precio = (nuevoProducto.materiales || []).reduce((sum, mat) => {
      const inv = inventario.find(i => i.id === mat.id);
      return sum + ((inv?.precio || 0) * (mat.cantidad || 1));
    }, 0);
    const productoFinalConPrecio = { ...nuevoProducto, precio };
    if (isEdit && editId !== null) {
      updateProductoFinal(editId, { ...productoFinalConPrecio, id: editId });
    } else {
      addProductoFinal(productoFinalConPrecio);
    }
    setNuevoProducto({ nombre: "", servicio: "", subservicio: "", quienRopa: "", materiales: [], clientesPermitidos: [], precio: 0 });
    setIsModalOpen(false);
    setIsEdit(false);
    setEditId(null);
  };

  const handleEdit = (producto) => {
    setNuevoProducto({
      nombre: producto.nombre,
      servicio: producto.servicio,
      subservicio: producto.subservicio || "",
      quienRopa: producto.quienRopa === undefined ? "" : producto.quienRopa,
      materiales: producto.materiales || [],
      clientesPermitidos: producto.clientesPermitidos || [],
      precio: producto.precio || 0,
    });
    setIsEdit(true);
    setEditId(producto.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    setEditId(null);
    setNuevoProducto({ nombre: "", servicio: "", subservicio: "", quienRopa: "", materiales: [], clientesPermitidos: [] });
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Productos Finales</h1>
          <Button onClick={() => {
            console.log("CLICK NUEVO PRODUCTO FINAL");
            setNuevoProducto({ nombre: "", servicio: "", materiales: [], clientesPermitidos: [] });
            setIsEdit(false);
            setEditId(null);
            setIsModalOpen(true);
          }}>Añadir Producto Final</Button>
        </div>
        <Table
          columns={[
            { key: "nombre", label: "Nombre" },
            { key: "servicio", label: "Servicio", render: v =>
              v === "serigrafia" ? "Serigrafía"
              : v === "rotulacion" ? "Rotulación"
              : "-"
            },
            // Subservicio solo para serigrafía
            { key: "subservicio", label: "Tipo serigrafía", render: (v, row) =>
              row.servicio === "serigrafia"
                ? v === "solo_dtf" ? "Solo Serigrafía"
                  : v === "dtf_planchado" ? "Serigrafía + Planchado"
                  : "-"
                : "-"
            },
            // Quién proporciona la ropa solo si es serigrafía + planchado
            { key: "quienRopa", label: "Ropa", render: (v, row) =>
              row.servicio === "serigrafia" && row.subservicio === "dtf_planchado"
                ? v === "cliente_ropa" ? "Cliente trae la ropa"
                  : v === "realprint_ropa" ? "RealPrint pone la ropa"
                  : v === "ambas" ? "Ambos"
                  : "-"
                : "-"
            },
            { key: "materiales", label: "Materiales", render: v => {
              if (!v || v.length === 0) return "-";
              if (v.length === 1) {
                const m = v[0];
                const prod = inventario.find(p => p.id === m.id);
                return prod ? `${prod.nombre} (${m.cantidad})` : m.id;
              }
              // Si hay más de un material, mostrar un desplegable
              return (
                <details>
                  <summary>{v.length + " materiales"}</summary>
                  <ul className="list-disc ml-4">
                    {v.map(m => {
                      const prod = inventario.find(p => p.id === m.id);
                      return <li key={m.id}>{prod ? `${prod.nombre} (${m.cantidad})` : m.id}</li>;
                    })}
                  </ul>
                </details>
              );
            } },
            { key: "precio", label: "Precio (€)", render: v => v != null ? v.toFixed(2) : "-" },
            { key: "clientesPermitidos", label: "Clientes permitidos", render: v => v && v.length > 0 ? v.map(cid => {
              const cliente = usuarios?.find(u => String(u.id) === String(cid));
              return cliente ? cliente.nombre : cid;
            }).join(", ") : "-" },
            { key: "acciones", label: "Acciones", render: (_, row) => (
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => { console.log("CLICK EDITAR", row); handleEdit(row); }}>Editar</Button>
                <Button size="sm" variant="danger" onClick={() => deleteProductoFinal(row.id)}>Eliminar</Button>
              </div>
            ) },
          ]}
          data={productosFinales}
          emptyMessage="No hay productos finales registrados"
        />
        <div className="mb-2 text-xs text-gray-500">Modal abierto: {String(isModalOpen)} | Editando: {String(isEdit)} | editId: {String(editId)}</div>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="p-4 min-w-[350px]">
            <div className="font-bold text-lg mb-2">{isEdit ? "Editar" : "Nuevo"} Producto Final</div>
            <Input
              label="Nombre"
              value={nuevoProducto.nombre}
              onChange={e => setNuevoProducto(prev => ({ ...prev, nombre: e.target.value }))}
              className="mb-2"
              required
            />
            <div className="mb-2">
              <div className="font-semibold mb-1">Servicio</div>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name="servicio"
                    value="serigrafia"
                    checked={nuevoProducto.servicio === "serigrafia"}
                    onChange={() => setNuevoProducto(prev => ({ ...prev, servicio: "serigrafia", subservicio: "", quienRopa: "" }))}
                    required
                  />
                  Serigrafía
                </label>
                <label>
                  <input
                    type="radio"
                    name="servicio"
                    value="rotulacion"
                    checked={nuevoProducto.servicio === "rotulacion"}
                    onChange={() => setNuevoProducto(prev => ({ ...prev, servicio: "rotulacion", subservicio: "", quienRopa: "" }))}
                    required
                  />
                  Rotulación
                </label>
              </div>
            {/* Subservicio solo si es Serigrafía */}
            {nuevoProducto.servicio === "serigrafia" && (
              <div className="mb-2">
                <div className="font-semibold mb-1">¿Qué necesitas?</div>
                <select
                  className="border rounded px-2 py-1"
                  value={nuevoProducto.subservicio}
                  onChange={e => setNuevoProducto(prev => ({ ...prev, subservicio: e.target.value, quienRopa: "" }))}
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="solo_serigrafia">Solo Serigrafía</option>
                  <option value="serigrafia+planchado">Serigrafía + Planchado</option>
                </select>
              </div>
            )}
            {/* Quién proporciona la ropa solo si es Serigrafía + Planchado */}
            {nuevoProducto.servicio === "serigrafia" && nuevoProducto.subservicio === "serigrafia+planchado" && (
              <div className="mb-2">
                <div className="font-semibold mb-1">¿Quién proporciona la ropa?</div>
                <select
                  className="border rounded px-2 py-1"
                  value={nuevoProducto.quienRopa}
                  onChange={e => setNuevoProducto(prev => ({ ...prev, quienRopa: e.target.value }))}
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="cliente_ropa">El cliente entrega la ropa</option>
                  <option value="realprint_ropa">RealPrint proporciona la ropa</option>
                  <option value="ambas">Ambas</option>
                </select>
              </div>
            )}
            </div>
            {/* Subservicio solo si es Serigrafía */}
            {nuevoProducto.servicio === "dtf" && (
              <div className="mb-2">
                <div className="font-semibold mb-1">¿Qué necesitas?</div>
                <select
                  className="border rounded px-2 py-1"
                  value={nuevoProducto.subservicio}
                  onChange={e => setNuevoProducto(prev => ({ ...prev, subservicio: e.target.value, quienRopa: "" }))}
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="solo_dtf">Solo DTF</option>
                  <option value="dtf_planchado">Serigrafía + Planchado</option>
                </select>
              </div>
            )}
            {/* Quién proporciona la ropa solo si es Serigrafía + Planchado */}
            {nuevoProducto.servicio === "dtf" && nuevoProducto.subservicio === "dtf_planchado" && (
              <div className="mb-2">
                <div className="font-semibold mb-1">¿Quién proporciona la ropa?</div>
                <select
                  className="border rounded px-2 py-1"
                  value={nuevoProducto.quienRopa}
                  onChange={e => setNuevoProducto(prev => ({ ...prev, quienRopa: e.target.value }))}
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="cliente_ropa">El cliente entrega la ropa</option>
                  <option value="realprint_ropa">RealPrint proporciona la ropa</option>
                  <option value="ambas">Ambas</option>
                </select>
              </div>
            )}
            {/* Selección de materiales del inventario */}
            {nuevoProducto.servicio && (
              <div className="mb-2">
                <div className="font-semibold mb-1">Materiales asociados</div>
                <div className="flex flex-col gap-2">
                  {inventario
                    .filter(prod =>
                      prod.serviciosDisponibles && prod.serviciosDisponibles.includes(nuevoProducto.servicio)
                    )
                    .map(prod => {
                      const material = nuevoProducto.materiales.find(m => m.id === prod.id);
                      return (
                        <div key={prod.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!material}
                            onChange={e => {
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
                            }}
                          />
                          <span>{prod.nombre}</span>
                          {material && (
                            <input
                              type="number"
                              min={1}
                              value={material.cantidad}
                              onChange={e => {
                                const cantidad = Math.max(1, Number(e.target.value));
                                setNuevoProducto(prev => ({
                                  ...prev,
                                  materiales: prev.materiales.map(m => m.id === prod.id ? { ...m, cantidad } : m)
                                }));
                              }}
                              className="w-16 border rounded px-2 py-1 ml-2"
                            />
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
            {/* Selección de clientes permitidos */}
            <div>
              <div className="font-semibold mb-1">Clientes con acceso a este producto</div>
              <div className="flex flex-wrap gap-2">
                {usuarios?.filter(u => u.role === "cliente").map(cliente => (
                  <label key={cliente.id} className="flex items-center gap-1 border rounded px-2 py-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nuevoProducto.clientesPermitidos.includes(cliente.id) || nuevoProducto.clientesPermitidos.includes(String(cliente.id))}
                      onChange={e => {
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
                      }}
                    />
                    {cliente.nombre}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
              <Button onClick={() => { console.log("CLICK GUARDAR", nuevoProducto, isEdit, editId); handleAdd(); }}>Guardar</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
