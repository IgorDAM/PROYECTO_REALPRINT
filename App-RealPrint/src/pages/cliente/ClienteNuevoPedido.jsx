/**
 * Página de creación de nuevo pedido para clientes.
 * Permite seleccionar servicio, producto final y subir archivos.
 *
 * - Modulariza lógica de formulario y envío
 * - Usa componentes UI reutilizables
 * - Documenta cada función relevante
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData, SERVICIOS } from "../../context/DataContext";
import { Button, Input, Select, Textarea, GlassCard } from "../../components/ui";

export default function ClienteNuevoPedido() {
  const { user } = useAuth();
  const { addPedido, inventario, productosFinales } = useData();
  const navigate = useNavigate();

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
  // Carrito de productos
  const [carrito, setCarrito] = useState([]);
  const [archivo, setArchivo] = useState(null);

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
      // Si el producto seleccionado es de serigrafía y enCaja, poner el valor por defecto
      const pf = productosFinales.find(p => String(p.id) === String(value));
      if (pf && pf.enCaja) {
        // Si el producto tiene tamanoCaja definido y es válido, úsalo, si no, pon 50
        const tamanoCajaDefault = (typeof pf.tamanoCaja === 'number' && pf.tamanoCaja > 0) ? pf.tamanoCaja : 50;
        setFormData((prev) => ({ ...prev, tamanoCaja: tamanoCajaDefault }));
      } else {
        setFormData((prev) => ({ ...prev, tamanoCaja: 50 }));
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
    // Guardar en el carrito todos los datos relevantes
    setCarrito(prev => [...prev, {
      ...formData,
      productoFinal: productoFinal,
      nombre: productoFinal.nombre,
      precio: productoFinal.precio,
      enCaja: productoFinal.enCaja,
      tamanoCaja: formData.tamanoCaja || productoFinal.tamanoCaja || 50,
    }]);
    // Limpiar el formulario para añadir otro producto
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
    setArchivo(null);
  };

  // Enviar todos los productos del carrito como pedidos
  const handleEnviarCarrito = () => {
    carrito.forEach(item => {
      let productoFinal = item.productoFinal;
      let precioUnitario = productoFinal.precio;
      let cantidadUnidades = item.cantidad;
      const unidadesPorCaja = productoFinal.enCaja ? (item.tamanoCaja || productoFinal.tamanoCaja || 50) : 1;
      if (productoFinal.enCaja) {
        cantidadUnidades = item.cantidad * unidadesPorCaja;
        for (let i = 0; i < item.cantidad; i++) {
          const nombrePedido = `Caja ${i + 1} de ${item.cantidad} - ${productoFinal.nombre} ${new Date().toISOString().split("T")[0]}`;
          const pedidoCaja = {
            clienteId: user.id,
            cliente: user.name,
            servicio: item.servicio,
            subservicio: item.subservicio,
            opcion: item.opcion,
            productoFinalId: productoFinal.id,
            pedido: nombrePedido,
            descripcion: item.descripcion + (item.instrucciones ? `\n\nInstrucciones: ${item.instrucciones}` : ""),
            cantidad: 1,
            cantidadUnidades: unidadesPorCaja,
            fechaEntrega: item.fechaEntrega,
            total: precioUnitario * unidadesPorCaja,
            tamanoCaja: item.tamanoCaja,
            boxIndex: i + 1,
            boxTotal: item.cantidad,
          };
          addPedido(pedidoCaja);
        }
      } else {
        const nombreProducto = productoFinal.nombre;
        const fechaCreacion = new Date().toISOString().split("T")[0];
        const nombrePedido = `${item.cantidad} ${nombreProducto} ${fechaCreacion}`;
        const nuevoPedido = {
          clienteId: user.id,
          cliente: user.name,
          servicio: item.servicio,
          subservicio: item.subservicio,
          opcion: item.opcion,
          productoFinalId: productoFinal.id,
          pedido: nombrePedido,
          descripcion: item.descripcion + (item.instrucciones ? `\n\nInstrucciones: ${item.instrucciones}` : ""),
          cantidad: parseInt(item.cantidad),
          cantidadUnidades: item.cantidad,
          fechaEntrega: item.fechaEntrega,
          total: precioUnitario * item.cantidad,
          tamanoCaja: item.tamanoCaja,
        };
        addPedido(nuevoPedido);
      }
    });
    setCarrito([]);
    navigate("/cliente");
  };

  // Productos finales filtrados por servicio y permisos (más flexible)
  let productosFinalesFiltrados = [];
  const clientePermitido = productosFinales.some(
    (pf) => Array.isArray(pf.clientesPermitidos) && pf.clientesPermitidos.some(cid => String(cid) === String(user.id))
  );
  // Permitir valores antiguos y nuevos para subservicio
  const subservicioSoloSerigrafia = ["solo_serigrafia"];
  const subservicioSerigrafiaPlanchado = ["serigrafia+planchado"];

  if (clientePermitido) {
    productosFinalesFiltrados = productosFinales.filter((pf) => {
      if (!Array.isArray(pf.clientesPermitidos) || !pf.clientesPermitidos.some(cid => String(cid) === String(user.id))) return false;
      if (pf.servicio !== formData.servicio) return false;
      // Filtrado especial para serigrafía
      if (formData.servicio === "serigrafia") {
        if (formData.subservicio === "solo_serigrafia") {
          // Solo coinciden los de subservicio solo_serigrafia
          if (pf.subservicio !== "solo_serigrafia") return false;
          return true;
        } else if (formData.subservicio === "serigrafia+planchado") {
          // Coinciden subservicio y quienRopa (o ambas)
          if (pf.subservicio !== "serigrafia+planchado") return false;
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
          // Si no hay subservicio, no mostrar nada
          return false;
        }
      }
      // Para rotulación, ya está filtrado por servicio
      return true;
    });
  } else {
    productosFinalesFiltrados = [];
  }

  // Calcular fecha mínima (3 días desde hoy)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 3);
  const minDateStr = minDate.toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">Nuevo Pedido</h1>
        <p className="text-surface-500 mt-1">Completa el formulario para crear tu pedido</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Form */}
        <form className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* El campo nombre del pedido se elimina, ahora es automático */}
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
            {/* Subservicio para Serigrafía (antes DTF) */}
            {formData.servicio === "serigrafia" && (
              <Select
                label="¿Qué necesitas?"
                name="subservicio"
                options={[
                  { value: "solo_serigrafia", label: "Solo Serigrafía" },
                  { value: "serigrafia+planchado", label: "Serigrafía + Planchado" }
                ]}
                value={formData.subservicio}
                onChange={handleChange}
                required
              />
            )}
            {/* Opción para Serigrafía + Planchado */}
            {formData.servicio === "serigrafia" && formData.subservicio === "serigrafia+planchado" && (
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
            {/* Mostrar producto final si el cliente está permitido y hay productos finales del servicio seleccionado */}
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
            {/* Si el producto es de serigrafía y enCaja, permitir modificar el tamaño de la caja */}
            {(() => {
              let productoFinal = null;
              if (formData.producto) {
                productoFinal = productosFinales.find(pf => String(pf.id) === String(formData.producto));
              }
              const nombreProducto = productoFinal ? productoFinal.nombre : "Producto";
              const fechaCreacion = new Date().toISOString().split("T")[0];
              let nombrePedido = "";
              if (productoFinal && productoFinal.enCaja && formData.opcion !== "realprint_ropa") {
                nombrePedido = `${formData.cantidad} caja ${nombreProducto} ${fechaCreacion}`;
              } else {
                nombrePedido = `${formData.cantidad} ${nombreProducto} ${fechaCreacion}`;
              }
              return (
                <>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Pedido (automático)</label>
                    <div className="px-3 py-2 bg-gray-100 rounded border border-gray-200 text-gray-700">{nombrePedido}</div>
                  </div>
                  {/* Solo si aplica: producto de serigrafía y enCaja y el cliente proporciona la ropa */}
                  {productoFinal && productoFinal.servicio === "serigrafia" && productoFinal.enCaja && formData.opcion !== "realprint_ropa" && (
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño de la caja</label>
                      <input
                        type="number"
                        name="tamanoCaja"
                        min="1"
                        value={
                          formData.tamanoCaja && formData.tamanoCaja > 0
                            ? formData.tamanoCaja
                            : (productoFinal && productoFinal.tamanoCaja && productoFinal.tamanoCaja > 0
                                ? productoFinal.tamanoCaja
                                : 50)
                        }
                        onChange={e => {
                          let val = Number(e.target.value);
                          if (!val || val < 1) val = 50;
                          setFormData(prev => ({ ...prev, tamanoCaja: val }));
                        }}
                        className="w-24 border rounded px-2 py-1"
                        min={1}
                        required
                      />
                      <span className="ml-2 text-xs text-gray-500">Puedes modificar el tamaño si lo necesitas</span>
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          <Textarea
            label="Descripción del Pedido (opcional)"
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

          {/* File Upload */}
          <div>
            <label className="text-sm font-semibold text-surface-700 mb-2 block">
              Archivos de Diseño
            </label>
            <div className="bg-white rounded-xl p-6 text-center border-2 border-dashed border-surface-300 hover:border-primary-400 transition-colors cursor-pointer">
              <input
                type="file"
                id="archivo"
                className="hidden"
                accept=".png,.jpg,.jpeg,.pdf,.ai,.psd"
                onChange={(e) => setArchivo(e.target.files[0])}
              />
              <label htmlFor="archivo" className="cursor-pointer">
                <span className="material-symbols-outlined text-3xl sm:text-4xl text-surface-400 mb-2">cloud_upload</span>
                <p className="text-surface-700 text-sm sm:text-base">
                  {archivo ? archivo.name : "Haz clic para subir o arrastra tu archivo"}
                </p>
                <p className="text-xs text-surface-500 mt-1">PNG, JPG, PDF, AI, PSD hasta 10MB</p>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={() => navigate("/cliente")} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="button" className="flex-1" onClick={handleAddToCarrito}>
              Añadir al carrito
            </Button>
          </div>
        </form>

        {/* Carrito y resumen */}
        <div>
          <GlassCard className="p-4 sm:p-6 sticky top-8 mb-6" hover={false} gold>
            <h3 className="text-base sm:text-lg font-bold text-surface-900 mb-4">Carrito de Pedido</h3>
            {carrito.length === 0 ? (
              <p className="text-surface-500">No has añadido productos al carrito.</p>
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
                    <button type="button" className="text-xs text-red-500 mt-1" onClick={() => setCarrito(carrito.filter((_, i) => i !== idx))}>Eliminar</button>
                  </li>
                ))}
              </ul>
            )}
            {carrito.length > 0 && (
              <Button type="button" className="w-full" onClick={handleEnviarCarrito}>
                Enviar pedido ({carrito.length} productos)
              </Button>
            )}
          </GlassCard>
          {/* Resumen del producto actual */}
          <GlassCard className="p-4 sm:p-6 sticky top-8" hover={false}>
            <h3 className="text-base sm:text-lg font-bold text-surface-900 mb-4">Resumen del Producto</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-surface-500">Servicio</span>
                <span className="text-surface-900 font-medium">{SERVICIOS.find((s) => s.value === formData.servicio)?.label || "-"}</span>
              </div>
              {formData.prendaCatalogo && (
                <div className="flex justify-between">
                  <span className="text-surface-500">Prenda/Objeto</span>
                  <span className="text-surface-900 font-medium">{formData.prendaCatalogo}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-surface-500">Cantidad</span>
                {(() => {
                  let productoFinal = null;
                  if (formData.producto) {
                    productoFinal = productosFinales.find(pf => String(pf.id) === String(formData.producto));
                  }
                  if (productoFinal && productoFinal.enCaja) {
                    const unidadesPorCaja = formData.tamanoCaja || productoFinal.tamanoCaja || 50;
                    return <span className="text-surface-900 font-medium">{formData.cantidad} cajas ({formData.cantidad * unidadesPorCaja} unidades)</span>;
                  }
                  return <span className="text-surface-900 font-medium">{formData.cantidad} unidades</span>;
                })()}
              </div>
              <div className="flex justify-between">
                <span className="text-surface-500">Entrega</span>
                <span className="text-surface-900 font-medium">{formData.fechaEntrega || "-"}</span>
              </div>
            </div>
            <hr className="border-surface-200 my-4" />
            <div className="flex justify-between items-center">
              <span className="text-surface-500">Precio Estimado</span>
              <span className="text-xl sm:text-2xl font-bold text-primary-600">
                {
                  (() => {
                    if (formData.producto) {
                      const pf = productosFinales.find(p => String(p.id) === String(formData.producto));
                      if (pf && typeof pf.precio === 'number') {
                        if (pf.enCaja) {
                          const unidadesPorCaja = formData.tamanoCaja || pf.tamanoCaja || 50;
                          const total = pf.precio * formData.cantidad * unidadesPorCaja;
                          return `€${total.toFixed(2)}`;
                        } else {
                          const total = pf.precio * formData.cantidad;
                          return `€${total.toFixed(2)}`;
                        }
                      }
                    }
                    if (!formData.servicio) {
                      return '€0.00';
                    }
                    return '€0.00';
                  })()
                }
              </span>
            </div>
            <p className="text-xs text-surface-400 mt-4">
              * El precio final puede variar según los detalles del diseño. Te contactaremos para confirmar el presupuesto.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
