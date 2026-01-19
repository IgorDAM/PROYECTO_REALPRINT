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

  const [formData, setFormData] = useState(() => pedido ? {
    servicio: pedido.servicio,
    subservicio: pedido.subservicio || "",
    opcion: pedido.opcion || "",
    producto: pedido.productoFinalId || pedido.producto || "",
    prendaCatalogo: pedido.prendaCatalogo || "",
    pedido: pedido.pedido || "",
    descripcion: pedido.descripcion || "",
    cantidad: pedido.cantidad || 1,
    fechaEntrega: pedido.fechaEntrega || "",
    instrucciones: "",
    tamanoCaja: pedido.tamanoCaja || undefined,
  } : {});

  useEffect(() => {
    if (!pedido) navigate("/cliente");
    // Solo permitir editar si está pendiente
    if (pedido && pedido.estado !== "pendiente") navigate("/cliente");
  }, [pedido, navigate]);

  if (!pedido) return null;

  // Filtrado de productos finales igual que en nuevo pedido
  const subservicioSoloSerigrafia = ["solo_serigrafia"];
  const subservicioSerigrafiaPlanchado = ["dtf+planchado", "serigrafia+planchado"];
  const clientePermitido = productosFinales.some(
    (pf) => Array.isArray(pf.clientesPermitidos) && pf.clientesPermitidos.some(cid => String(cid) === String(user.id))
  );
  let productosFinalesFiltrados = [];
  if (
    formData.servicio === "serigrafia" &&
    subservicioSerigrafiaPlanchado.includes(formData.subservicio) &&
    formData.opcion &&
    clientePermitido
  ) {
    productosFinalesFiltrados = productosFinales.filter(
      (pf) =>
        pf.servicio === "serigrafia" &&
        subservicioSerigrafiaPlanchado.includes(pf.subservicio) &&
        (
          pf.quienRopa === formData.opcion ||
          pf.quienRopa === "ambas"
        ) &&
        Array.isArray(pf.clientesPermitidos) &&
        pf.clientesPermitidos.some(cid => String(cid) === String(user.id))
    );
  } else if (
    formData.servicio === "serigrafia" &&
    subservicioSoloSerigrafia.includes(formData.subservicio) &&
    clientePermitido
  ) {
    productosFinalesFiltrados = productosFinales.filter(
      (pf) =>
        pf.servicio === "serigrafia" &&
        subservicioSoloSerigrafia.includes(pf.subservicio) &&
        Array.isArray(pf.clientesPermitidos) &&
        pf.clientesPermitidos.some(cid => String(cid) === String(user.id))
    );
  } else if (
    formData.servicio === "rotulacion" &&
    clientePermitido
  ) {
    productosFinalesFiltrados = productosFinales.filter(
      (pf) =>
        pf.servicio === "rotulacion" &&
        Array.isArray(pf.clientesPermitidos) &&
        pf.clientesPermitidos.some(cid => String(cid) === String(user.id))
    );
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
      // Si el producto seleccionado es de serigrafía y enCaja, poner el valor por defecto
      const pf = productosFinales.find(p => String(p.id) === String(value));
      if (pf && pf.enCaja) {
        setFormData((prev) => ({ ...prev, tamanoCaja: pf.tamanoCaja || 50 }));
      } else {
        setFormData((prev) => ({ ...prev, tamanoCaja: undefined }));
      }
    }
  };

  // Guardar cambios
  const handleSubmit = (e) => {
    e.preventDefault();
    let precioUnitario = 0;
    let productoFinal = null;
    let total = 0;
    let cantidadUnidades = formData.cantidad;
    if (formData.producto) {
      productoFinal = productosFinales.find(pf => String(pf.id) === String(formData.producto));
      if (productoFinal && typeof productoFinal.precio === 'number') {
        precioUnitario = productoFinal.precio;
      }
    }
    if (!precioUnitario) {
      if (formData.servicio) {
        const precioBase = {
          rotulacion: 50,
          serigrafia: 5,
          planchado: 3,
          vinilo: 15,
          impresion: 25,
        };
        precioUnitario = precioBase[formData.servicio] || 10;
      } else {
        precioUnitario = 0;
      }
    }
    // Si es en caja, la cantidad es de cajas, y el precio es cajas * unidades por caja * precio unitario
    if (productoFinal && productoFinal.enCaja) {
      const unidadesPorCaja = formData.tamanoCaja || productoFinal.tamanoCaja || 50;
      cantidadUnidades = formData.cantidad * unidadesPorCaja;
      total = precioUnitario * cantidadUnidades;
    } else {
      total = precioUnitario * formData.cantidad;
    }
    updatePedido(pedido.id, {
      ...pedido,
      ...formData,
      servicio: formData.servicio,
      subservicio: formData.subservicio,
      opcion: formData.opcion,
      total,
      tamanoCaja: formData.tamanoCaja,
      cantidadUnidades: cantidadUnidades,
    });
    // Redirigir siempre al dashboard de cliente tras editar pedido
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
        <p className="text-surface-500 mt-1">Modifica los datos de tu pedido pendiente</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
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
                { value: "dtf+planchado", label: "Serigrafía + Planchado" }
              ]}
              value={formData.subservicio}
              onChange={handleChange}
              required
            />
          )}
          {formData.servicio === "serigrafia" && (formData.subservicio === "dtf+planchado" || formData.subservicio === "serigrafia+planchado") && (
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
          {clientePermitido && productosFinalesFiltrados.length > 0 && (
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Pedido (automático)</label>
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
          label="Descripción del Pedido"
          name="descripcion"
          placeholder="Detalles sobre el diseño, materiales, colores, dimensiones, etc."
          value={formData.descripcion}
          onChange={handleChange}
          rows={4}
          required
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
                <div>
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
                  <div className="text-xs text-gray-500 mt-1">Total: {formData.cantidad * unidadesPorCaja} unidades</div>
                </div>
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
          <Button type="submit" className="flex-1">Guardar Cambios</Button>
        </div>
      </form>
    </div>
  );
}
