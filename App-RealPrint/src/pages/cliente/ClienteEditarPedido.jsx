/**
 * Página de edición de pedido para clientes.
 * Permite modificar un pedido pendiente, con validación de acceso y filtrado de productos.
 *
 * Buenas prácticas:
 * - Modulariza lógica de formulario y filtrado
 * - Usa componentes UI reutilizables
 * - Documenta cada función relevante
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData, SERVICIOS } from "../../context/DataContext";
import { Button, Input, Select, Textarea, GlassCard } from "../../components/ui";

export default function ClienteEditarPedido() {
  const { id } = useParams();
  const { user } = useAuth();
  const { pedidos, updatePedido, productosFinales } = useData();
  const navigate = useNavigate();

  const pedido = pedidos.find((p) => String(p.id) === String(id) && p.clienteId === user?.id);

  // Nuevo: carrito de productos para edición
  const [carrito, setCarrito] = useState(() => pedido && Array.isArray(pedido.carrito)
    ? pedido.carrito
    : pedido
      ? [{
          servicio: pedido.servicio,
          subservicio: pedido.subservicio || "",
          opcion: pedido.opcion || "",
          producto: pedido.productoFinalId || pedido.producto || "",
          prendaCatalogo: pedido.prendaCatalogo || "",
          pedido: pedido.pedido || "",
          descripcion: pedido.descripcion || "",
          cantidad: pedido.cantidad || 1,
          fechaEntrega: pedido.fechaEntrega || "",
          instrucciones: pedido.instrucciones || "",
          tamanoCaja: pedido.tamanoCaja || undefined,
        }]
      : []
  );
  // Estado para el producto en edición/añadido
  const [formData, setFormData] = useState({
    servicio: "",
    subservicio: "",
    opcion: "",
    producto: "",
    prendaCatalogo: "",
    pedido: "",
    descripcion: "",
    cantidad: 1,
    fechaEntrega: "",
    instrucciones: "",
    tamanoCaja: undefined,
  });

  useEffect(() => {
    if (!pedido) navigate("/cliente");
    // Solo permitir editar si está pendiente
    if (pedido && pedido.estado !== "pendiente") navigate("/cliente");
  }, [pedido, navigate]);

  if (!pedido) return null;

  // Filtrado de productos finales igual que en nuevo pedido
  const subservicioSoloSerigrafia = ["solo_serigrafia"];
  const subservicioSerigrafiaPlanchado = ["serigrafia+planchado", "dtf+planchado"];
  const clientePermitido = productosFinales.some(
    (pf) => Array.isArray(pf.clientesPermitidos) && pf.clientesPermitidos.some(cid => String(cid) === String(user.id))
  );
  let productosFinalesFiltrados = [];
  if (clientePermitido) {
    productosFinalesFiltrados = productosFinales.filter((pf) => {
      if (!Array.isArray(pf.clientesPermitidos) || !pf.clientesPermitidos.some(cid => String(cid) === String(user.id))) return false;
      if (pf.servicio !== formData.servicio) return false;
      if (formData.servicio === "serigrafia") {
        if (formData.subservicio === "solo_serigrafia") {
          if (pf.subservicio !== "solo_serigrafia") return false;
          return true;
        } else if (formData.subservicio === "serigrafia+planchado" || formData.subservicio === "dtf+planchado") {
          if (pf.subservicio !== formData.subservicio) return false;
          if (!formData.opcion) return false;
          const quienRopaNorm = (pf.quienRopa || "").toLowerCase().replace(/\s+/g, "");
          if (formData.opcion === "cliente_ropa") {
            if (quienRopaNorm !== "cliente_ropa" && quienRopaNorm !== "ambas") return false;
          } else if (formData.opcion === "realprint_ropa") {
            if (quienRopaNorm !== "realprint_ropa" && quienRopaNorm !== "ambas") return false;
          } else {
            return false;
          }
          return true;
        } else {
          return false;
        }
      }
      return true;
    });
  } else {
    productosFinalesFiltrados = [];
  }

  // Maneja cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    if (name === "servicio") {
      setFormData((prev) => ({ ...prev, producto: "", subservicio: "", opcion: "", tamanoCaja: undefined }));
    }
    if (name === "subservicio") {
      setFormData((prev) => ({ ...prev, opcion: "", tamanoCaja: undefined }));
    }
    if (name === "producto") {
      const pf = productosFinales.find(p => String(p.id) === String(value));
      if (pf && pf.enCaja) {
        setFormData((prev) => ({ ...prev, tamanoCaja: pf.tamanoCaja || 50 }));
      } else {
        setFormData((prev) => ({ ...prev, tamanoCaja: undefined }));
      }
    }
  };

  // Añadir producto al carrito
  const handleAddToCarrito = (e) => {
    e.preventDefault();
    let productoFinal = null;
    if (formData.producto) {
      productoFinal = productosFinales.find(pf => String(pf.id) === String(formData.producto));
    }
    if (!productoFinal) return;
    setCarrito(prev => [...prev, {
      ...formData,
      productoFinal: productoFinal,
      nombre: productoFinal.nombre,
      precio: productoFinal.precio,
      enCaja: productoFinal.enCaja,
      tamanoCaja: formData.tamanoCaja || productoFinal.tamanoCaja || 50,
    }]);
    setFormData({
      servicio: "",
      subservicio: "",
      opcion: "",
      producto: "",
      prendaCatalogo: "",
      pedido: "",
      descripcion: "",
      cantidad: 1,
      fechaEntrega: "",
      instrucciones: "",
      tamanoCaja: undefined,
    });
  };

  // Eliminar producto del carrito
  const handleRemoveFromCarrito = (idx) => {
    setCarrito(carrito.filter((_, i) => i !== idx));
  };

  // Guardar cambios (actualiza el pedido con el nuevo carrito)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Calcular total del pedido sumando los totales de cada producto
    let totalPedido = 0;
    const carritoActualizado = carrito.map(item => {
      let productoFinal = item.productoFinal || productosFinales.find(pf => String(pf.id) === String(item.producto));
      let precioUnitario = productoFinal?.precio || 0;
      let cantidadUnidades = item.cantidad;
      if (productoFinal && productoFinal.enCaja) {
        const unidadesPorCaja = item.tamanoCaja || productoFinal.tamanoCaja || 50;
        cantidadUnidades = item.cantidad * unidadesPorCaja;
        totalPedido += precioUnitario * cantidadUnidades;
      } else {
        totalPedido += precioUnitario * item.cantidad;
      }
      return {
        ...item,
        productoFinalId: productoFinal?.id,
        nombre: productoFinal?.nombre,
        precio: precioUnitario,
        enCaja: productoFinal?.enCaja,
        tamanoCaja: item.tamanoCaja || productoFinal?.tamanoCaja || 50,
        cantidadUnidades,
        total: precioUnitario * cantidadUnidades,
      };
    });
    updatePedido(pedido.id, {
      ...pedido,
      carrito: carritoActualizado,
      total: totalPedido,
      // Para compatibilidad, también dejamos el primer producto como principal
      ...carritoActualizado[0],
    });
    navigate("/cliente");
  };

  // Calcular fecha mínima (3 días desde hoy)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 3);
  const minDateStr = minDate.toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">Editar Pedido</h1>
        <p className="text-surface-500 mt-1">Modifica los productos de tu pedido pendiente</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Formulario para añadir producto al carrito */}
        <form className="lg:col-span-2 space-y-6" onSubmit={handleAddToCarrito}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Select
              label="Tipo de Servicio"
              name="servicio"
              options={[
                { value: "serigrafia", label: "Serigrafía" },
                { value: "rotulacion", label: "Rotulación" }
              ]}
              value={formData.servicio}
              onChange={handleChange}
              required
            />
            {formData.servicio === "serigrafia" && (
              <Select
                label="¿Qué necesitas?"
                name="subservicio"
                options={[
                  { value: "solo_serigrafia", label: "Solo Serigrafía" },
                  { value: "serigrafia+planchado", label: "Serigrafía + Planchado" },
                  { value: "dtf+planchado", label: "DTF + Planchado" }
                ]}
                value={formData.subservicio}
                onChange={handleChange}
                required
              />
            )}
            {formData.servicio === "serigrafia" && (formData.subservicio === "serigrafia+planchado" || formData.subservicio === "dtf+planchado") && (
              <Select
                label="¿Quién proporciona la ropa?"
                name="opcion"
                options={[
                  { value: "cliente_ropa", label: "El cliente entrega la ropa" },
                  { value: "realprint_ropa", label: "RealPrint proporciona la ropa" }
                ]}
                value={formData.opcion}
                onChange={handleChange}
                required
              />
            )}
            {clientePermitido && formData.servicio && productosFinalesFiltrados.length > 0 && (
              <Select
                label="Producto Final"
                name="producto"
                options={productosFinalesFiltrados.map(pf => ({ value: pf.id, label: pf.nombre }))}
                value={formData.producto}
                onChange={handleChange}
                required={!!formData.servicio}
                disabled={productosFinalesFiltrados.length === 0}
                placeholder={productosFinalesFiltrados.length ? "Selecciona un producto final" : "No hay productos finales disponibles"}
              />
            )}
            {/* Nombre del Pedido automático */}
            {(() => {
              let productoFinal = null;
              if (formData.producto) {
                productoFinal = productosFinales.find(pf => String(pf.id) === String(formData.producto));
              }
              const nombreProducto = productoFinal ? productoFinal.nombre : "Producto";
              const fechaCreacion = pedido && pedido.fecha ? pedido.fecha : new Date().toISOString().split("T")[0];
              let nombrePedido = "";
              if (productoFinal && productoFinal.enCaja && formData.opcion !== "realprint_ropa") {
                nombrePedido = `${formData.cantidad} caja ${nombreProducto} ${fechaCreacion}`;
              } else {
                nombrePedido = `${formData.cantidad} ${nombreProducto} ${fechaCreacion}`;
              }
              return (
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto (automático)</label>
                  <div className="px-3 py-2 bg-gray-100 rounded border border-gray-200 text-gray-700">{nombrePedido}</div>
                </div>
              );
            })()}
            {/* Si el producto es de serigrafía y enCaja, permitir modificar el tamaño de la caja */}
            {(() => {
              let productoFinal = null;
              if (formData.producto) {
                productoFinal = productosFinales.find(pf => String(pf.id) === String(formData.producto));
              }
              if (productoFinal && productoFinal.servicio === "serigrafia" && productoFinal.enCaja && formData.opcion !== "realprint_ropa") {
                return (
                  <Input
                    label="Tamaño de la caja"
                    name="tamanoCaja"
                    type="number"
                    min="1"
                    value={formData.tamanoCaja || productoFinal.tamanoCaja || 50}
                    onChange={handleChange}
                    required
                  />
                );
              }
              return null;
            })()}
          </div>
          <Textarea
            label="Descripción del Producto"
            name="descripcion"
            placeholder="Detalles sobre el diseño, materiales, colores, dimensiones, etc."
            value={formData.descripcion}
            onChange={handleChange}
            rows={4}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(() => {
              let productoFinal = null;
              if (formData.producto) {
                productoFinal = productosFinales.find(pf => String(pf.id) === String(formData.producto));
              }
              if (productoFinal && productoFinal.enCaja) {
                const unidadesPorCaja = formData.tamanoCaja || productoFinal.tamanoCaja || 50;
                return (
                  <Input
                    label="Cantidad de cajas"
                    name="cantidad"
                    type="number"
                    min="1"
                    placeholder="Ej. 1"
                    value={formData.cantidad}
                    onChange={handleChange}
                    required
                  />
                );
              }
              return (
                <Input
                  label="Cantidad"
                  name="cantidad"
                  type="number"
                  min="1"
                  placeholder="Ej. 50"
                  value={formData.cantidad}
                  onChange={handleChange}
                  required
                />
              );
            })()}
            <Input
              label="Fecha de Entrega Deseada"
              name="fechaEntrega"
              type="date"
              min={minDateStr}
              value={formData.fechaEntrega}
              onChange={handleChange}
              required
            />
          </div>
          <Textarea
            label="Instrucciones Especiales (Opcional)"
            name="instrucciones"
            placeholder="Cualquier detalle adicional o preferencia específica"
            value={formData.instrucciones}
            onChange={handleChange}
            rows={3}
          />
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={() => navigate("/cliente")}>Cancelar</Button>
            <Button type="submit" className="flex-1">Añadir producto</Button>
          </div>
        </form>
        {/* Carrito y resumen */}
        <div>
          <GlassCard className="p-4 sm:p-6 sticky top-8 mb-6" hover={false} gold>
            <h3 className="text-base sm:text-lg font-bold text-surface-900 mb-4">Productos del Pedido</h3>
            {carrito.length === 0 ? (
              <p className="text-surface-500">No has añadido productos al pedido.</p>
            ) : (
              <ul className="divide-y divide-surface-200 mb-4">
                {carrito.map((item, idx) => (
                  <li key={idx} className="py-2 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-surface-900">{item.nombre}</span>
                      <span className="text-primary-600 font-bold">€{item.precio}</span>
                    </div>
                    <div className="flex gap-4 text-xs text-surface-500">
                      <span>Servicio: {SERVICIOS.find(s => s.value === item.servicio)?.label || item.servicio}</span>
                      <span>Cantidad: {item.cantidad}{item.enCaja ? ` cajas (${item.cantidad * (item.tamanoCaja || 50)} uds)` : " uds"}</span>
                      <span>Entrega: {item.fechaEntrega || "-"}</span>
                    </div>
                    <button type="button" className="text-xs text-red-500 mt-1" onClick={() => handleRemoveFromCarrito(idx)}>Eliminar</button>
                  </li>
                ))}
              </ul>
            )}
            {carrito.length > 0 && (
              <Button type="button" className="w-full" onClick={handleSubmit}>
                Guardar Cambios ({carrito.length} productos)
              </Button>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
