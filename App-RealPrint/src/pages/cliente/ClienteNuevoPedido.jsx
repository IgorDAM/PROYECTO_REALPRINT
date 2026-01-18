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
  });
  const [archivo, setArchivo] = useState(null);

  // Maneja cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "servicio") {
      setFormData((prev) => ({ ...prev, producto: "", subservicio: "", opcion: "" }));
    }
    if (name === "subservicio") {
      setFormData((prev) => ({ ...prev, opcion: "" }));
    }
  };

  // Envía el pedido y navega al dashboard
  const handleSubmit = (e) => {
    e.preventDefault();
    // Calcular precio estimado
    let total = 0;
    let precioUnitario = 0;
    let productoFinal = null;
    if (formData.producto) {
      productoFinal = productosFinales.find(pf => String(pf.id) === String(formData.producto));
      if (productoFinal && typeof productoFinal.precio === 'number') {
        precioUnitario = productoFinal.precio;
      }
    }
    if (!precioUnitario) {
      precioUnitario = 0;
    }
    total = precioUnitario * formData.cantidad;
    // Generar nombre automático: cantidad+producto_final+fecha_creación_pedido
    const nombreProducto = productoFinal ? productoFinal.nombre : "Producto";
    const fechaCreacion = new Date().toISOString().split("T")[0];
    const nombrePedido = `${formData.cantidad} ${nombreProducto} ${fechaCreacion}`;
    const nuevoPedido = {
      clienteId: user.id,
      cliente: user.name,
      servicio: formData.servicio,
      subservicio: formData.subservicio,
      opcion: formData.opcion,
      productoFinalId: formData.producto,
      pedido: nombrePedido, // nombre automático
      descripcion: formData.descripcion + (formData.instrucciones ? `\n\nInstrucciones: ${formData.instrucciones}` : ""),
      cantidad: parseInt(formData.cantidad),
      fechaEntrega: formData.fechaEntrega,
      total,
    };
    addPedido(nuevoPedido);
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
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
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
            {/* Vista previa del nombre automático del pedido */}
            {(() => {
              let productoFinal = null;
              if (formData.producto) {
                productoFinal = productosFinales.find(pf => String(pf.id) === String(formData.producto));
              }
              const nombreProducto = productoFinal ? productoFinal.nombre : "Producto";
              const fechaCreacion = new Date().toISOString().split("T")[0];
              const nombrePedido = `${formData.cantidad} ${nombreProducto} ${fechaCreacion}`;
              return (
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Pedido (automático)</label>
                  <div className="px-3 py-2 bg-gray-100 rounded border border-gray-200 text-gray-700">{nombrePedido}</div>
                </div>
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
            <Button type="submit" className="flex-1">
              Enviar Pedido
            </Button>
          </div>
        </form>

        {/* Summary */}
        <div>
          <GlassCard className="p-4 sm:p-6 sticky top-8" hover={false} gold>
            <h3 className="text-base sm:text-lg font-bold text-surface-900 mb-4">Resumen del Pedido</h3>
            
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
                <span className="text-surface-900 font-medium">{formData.cantidad} unidades</span>
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
                        const total = pf.precio * formData.cantidad;
                        return `€${total.toFixed(2)}`;
                      }
                    }
                    if (!formData.servicio) {
                      return '€0.00';
                    }
                    // Si no hay producto final, precio 0
                    return '€0.00';
                  })()
                }
              </span>
            </div>

            <p className="text-xs text-surface-400 mt-4">
              * El precio final puede variar según los detalles del diseño. 
              Te contactaremos para confirmar el presupuesto.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
