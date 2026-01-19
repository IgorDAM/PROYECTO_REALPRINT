/**
 * Contexto global de datos de la aplicación.
 * Incluye productos, inventario, usuarios, pedidos, tareas y catálogos.
 *
 * Buenas prácticas:
 * - Usa localStorage para persistencia de datos
 * - Expone un hook useData para consumir el contexto
 * - Modulariza funciones de negocio (CRUD, estadísticas, etc.)
 * - Documenta cada función relevante
 */
// Datos iniciales de productos finales vacíos
const INITIAL_PRODUCTOS_FINALES = [];
// Catálogo de ejemplo: empresaId -> servicio -> array de prendas/objetos
const INITIAL_CATALOGOS_EMPRESA = {
  // empresaId: { servicio: ["Camiseta", "Pantalón", ...] }
  4: {
    dtf: ["Camiseta", "Pantalón", "Chándal", "Anorak"],
    rotulacion: ["Furgoneta", "Balón", "Botella"]
  }
};

// Las funciones setCatalogoEmpresa y getCatalogoEmpresa deben ir dentro de DataProvider
import { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext(null);

// Datos iniciales de pedidos vacíos
const INITIAL_PEDIDOS = [];

const INITIAL_INVENTARIO = [
  { id: 1, nombre: "Camiseta Blanca M", categoria: "Textil", stock: 10, stockMinimo: 2, precio: 5.00, usados: 0, disponibleParaPedidos: true, serviciosDisponibles: ["serigrafia", "planchado"] },
  { id: 2, nombre: "Camiseta Blanca L", categoria: "Textil", stock: 8, stockMinimo: 2, precio: 5.00, usados: 0, disponibleParaPedidos: true, serviciosDisponibles: ["serigrafia", "planchado"] },
  { id: 3, nombre: "Camiseta Negra M", categoria: "Textil", stock: 5, stockMinimo: 1, precio: 5.50, usados: 0, disponibleParaPedidos: true, serviciosDisponibles: ["serigrafia", "planchado"] },
  { id: 4, nombre: "Vinilo Blanco (m²)", categoria: "Vinilo", stock: 20, stockMinimo: 5, precio: 12.00, usados: 0, disponibleParaPedidos: true, serviciosDisponibles: ["vinilo", "rotulacion"] },
  { id: 5, nombre: "Vinilo Negro (m²)", categoria: "Vinilo", stock: 15, stockMinimo: 3, precio: 12.00, usados: 0, disponibleParaPedidos: true, serviciosDisponibles: ["vinilo", "rotulacion"] },
];

// Al crear un producto en inventario, debe tener el campo 'usados' (contador de veces utilizado)

const INITIAL_USUARIOS = [
  { id: 1, username: "admin", password: "admin123", nombre: "Administrador", email: "admin@realprint.com", role: "admin", activo: true },
  { id: 2, username: "cliente", password: "cliente123", nombre: "Cliente Demo", email: "cliente@email.com", role: "cliente", activo: true },
  { id: 3, username: "operario_demo_serigrafia", password: "operario123", nombre: "Operario Demo Serigrafía", email: "operario_demo_serigrafia@email.com", role: "operario", activo: true, especialidad: "serigrafia" },
  { id: 4, username: "operario_demo_rotulacion", password: "operario123", nombre: "Operario Demo Rotulación", email: "operario_demo_rotulacion@email.com", role: "operario", activo: true, especialidad: "rotulacion" },
];

const INITIAL_TAREAS = [
  // ...tareas si las hubiera
];

export const ESTADOS_PEDIDO = {
  pendiente: { label: "Pendiente", color: "bg-yellow-300 text-yellow-800" },
  en_proceso: { label: "En Proceso", color: "bg-blue-300 text-blue-800" },
  completado: { label: "Completado", color: "bg-green-300 text-green-800" },
  enviado: { label: "Enviado", color: "bg-purple-300 text-purple-800" },
  cancelado: { label: "Cancelado", color: "bg-red-300 text-red-800" },
};

export const SERVICIOS = [
  {
    value: "serigrafia",
    label: "Serigrafía",
    subservicios: [],
  },
  {
    value: "rotulacion",
    label: "Rotulación",
    subservicios: [],
  },
];

export function DataProvider({ children }) {
  // Productos finales (prendas/objetos que trae el cliente y se asocian a materiales del inventario)
  const [productosFinales, setProductosFinales] = useState(() => {
    const stored = localStorage.getItem("realprint_productos_finales");
    return stored ? JSON.parse(stored) : INITIAL_PRODUCTOS_FINALES;
  });


  // Catálogo de prendas/objetos por empresa y servicio (con persistencia en localStorage)
  const [catalogosEmpresa, setCatalogosEmpresa] = useState(() => {
    const stored = localStorage.getItem("realprint_catalogos_empresa");
    return stored ? JSON.parse(stored) : INITIAL_CATALOGOS_EMPRESA;
  });

  // Guardar catálogo en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("realprint_catalogos_empresa", JSON.stringify(catalogosEmpresa));
  }, [catalogosEmpresa]);

  // Añadir o actualizar catálogo para una empresa y servicio
  const setCatalogoEmpresa = (empresaId, servicio, prendas) => {
    setCatalogosEmpresa(prev => ({
      ...prev,
      [empresaId]: {
        ...(prev[empresaId] || {}),
        [servicio]: prendas
      }
    }));
  };

  // Obtener catálogo para una empresa y servicio
  const getCatalogoEmpresa = (empresaId, servicio) => {
    return (catalogosEmpresa[empresaId] && catalogosEmpresa[empresaId][servicio]) || [];
  };

  // Guardar productos finales en localStorage cuando cambian
        useEffect(() => {
          localStorage.setItem("realprint_productos_finales", JSON.stringify(productosFinales));
        }, [productosFinales]);
        // Funciones para productos finales
        const addProductoFinal = (producto) => {
          const newProducto = { ...producto, id: Date.now() };
          setProductosFinales([...productosFinales, newProducto]);
          return newProducto;
        };

        const updateProductoFinal = (id, updates) => {
          setProductosFinales(productosFinales.map((p) => (p.id === id ? { ...p, ...updates } : p)));
        };

        const deleteProductoFinal = (id) => {
          setProductosFinales(productosFinales.filter((p) => p.id !== id));
        };
  const [pedidos, setPedidos] = useState(() => {
    const stored = localStorage.getItem("realprint_pedidos");
    return stored ? JSON.parse(stored) : INITIAL_PEDIDOS;
  });
  const [inventario, setInventario] = useState(() => {
    const stored = localStorage.getItem("realprint_inventario");
    const base = stored ? JSON.parse(stored) : INITIAL_INVENTARIO;
    // Asegura que todos los productos tengan el campo 'usados'
    return base.map(item => ({ ...item, usados: typeof item.usados === 'number' ? item.usados : 0 }));
  });
  const [usuarios, setUsuarios] = useState(() => {
    const stored = localStorage.getItem("realprint_usuarios");
    return stored ? JSON.parse(stored) : INITIAL_USUARIOS;
  });

  // Añadir tarea pendiente para el operario adecuado
  const addTareaPorPedido = (pedido) => {
    // Buscar operario con especialidad igual al servicio del pedido (ignorando mayúsculas/minúsculas)
    const servicioKey = (pedido.servicio || "").toLowerCase();
    const operario = usuarios.find(u => u.role === "operario" && (u.especialidad || "").toLowerCase() === servicioKey);
    if (!operario) return;
    const nuevaTarea = {
      id: Date.now(),
      operarioId: operario.id,
      pedidoId: pedido.id,
      tarea: `Atender pedido de ${pedido.servicio}`,
      estado: "pendiente",
      fechaCreacion: new Date().toISOString(),
    };
    setTareas(prev => [nuevaTarea, ...prev]);
  };
  const [tareas, setTareas] = useState(() => {
    const stored = localStorage.getItem("realprint_tareas");
    return stored ? JSON.parse(stored) : INITIAL_TAREAS;
  });


  // Guardar inventario en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("realprint_inventario", JSON.stringify(inventario));
  }, [inventario]);

  // Guardar pedidos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("realprint_pedidos", JSON.stringify(pedidos));
  }, [pedidos]);

  // Guardar usuarios en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("realprint_usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  // Guardar tareas en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("realprint_tareas", JSON.stringify(tareas));
  }, [tareas]);

  // Funciones para pedidos
  const addPedido = (pedido) => {
    const newPedido = {
      ...pedido,
      id: Date.now().toString(),
      fecha: new Date().toISOString().split("T")[0],
      estado: "pendiente",
    };
    // Descontar inventario si el pedido tiene productoFinalId
    if (newPedido.productoFinalId) {
      const productoFinal = productosFinales.find(pf => pf.id == newPedido.productoFinalId);
      if (productoFinal && productoFinal.productosInventario) {
        productoFinal.productosInventario.forEach(id => {
          const prod = inventario.find(i => i.id == id);
          if (prod) {
            updateInventario(id, { stock: Math.max(0, prod.stock - (newPedido.cantidad || 1)) });
          }
        });
      }
    }
    setPedidos([newPedido, ...pedidos]);
    // Crear tarea pendiente para el operario adecuado
    addTareaPorPedido(newPedido);
    return newPedido;
  };

  const updatePedido = (id, updates) => {
    setPedidos(pedidos.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePedido = (id) => {
    setPedidos(pedidos.filter((p) => p.id !== id));
    setTareas(tareas.filter((t) => t.pedidoId !== id));
  };

  // Funciones para inventario
  const updateInventario = (id, updates) => {
    setInventario(inventario.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const addInventario = (item) => {
    const newItem = { ...item, id: Date.now(), usados: 0 };
    setInventario([...inventario, newItem]);
    return newItem;
  };

  const deleteInventario = (id) => {
    setInventario(inventario.filter((i) => i.id !== id));
  };

  // Funciones para usuarios
  const addUsuario = (usuario) => {
    const newUsuario = { ...usuario, id: Date.now(), activo: true };
    setUsuarios([...usuarios, newUsuario]);
    return newUsuario;
  };

  const updateUsuario = (id, updates) => {
    setUsuarios(usuarios.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const deleteUsuario = (id) => {
    setUsuarios(usuarios.filter((u) => u.id !== id));
  };

  // Funciones para tareas
  const updateTarea = (id, updates) => {
    setTareas(tareas.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  // Estadísticas
  const getEstadisticas = () => {
    const pedidosPendientes = pedidos.filter((p) => p.estado === "pendiente").length;
    const pedidosEnProceso = pedidos.filter((p) => p.estado === "en_proceso").length;
    const pedidosCompletados = pedidos.filter((p) => p.estado === "completado" || p.estado === "enviado").length;
    const productosStockBajo = inventario.filter((i) => i.stock <= i.stockMinimo).length;
    const totalVentas = pedidos.reduce((sum, p) => sum + (typeof p.total === "number" ? p.total : 0), 0);
    const usuariosActivos = usuarios.filter((u) => u.activo).length;

    return {
      pedidosPendientes,
      pedidosEnProceso,
      pedidosCompletados,
      productosStockBajo,
      totalVentas,
      usuariosActivos,
      totalPedidos: pedidos.length,
    };
  };

  const value = {
      productosFinales,
      setProductosFinales,
      addProductoFinal,
      updateProductoFinal,
      deleteProductoFinal,
    pedidos,
    inventario,
    usuarios,
    tareas,
    catalogosEmpresa,
    setCatalogoEmpresa,
    getCatalogoEmpresa,
    addPedido,
    updatePedido,
    deletePedido,
    updateInventario,
    addInventario,
    deleteInventario,
    addUsuario,
    updateUsuario,
    deleteUsuario,
    updateTarea,
    getEstadisticas,
    catalogosEmpresa,
    setCatalogoEmpresa,
    getCatalogoEmpresa,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData debe usarse dentro de DataProvider");
  }
  return context;
}
