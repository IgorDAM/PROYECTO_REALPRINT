import { httpClient } from "./httpClient";

/**
 * Servicio CRUD de pedidos (versión mejorada).
 *
 * CAMBIOS con nuevo diseño:
 * - Interfaz Pedido ahora incluye creadoPorId y creadoPorNombre
 * - Backend asigna automáticamente cliente y creadoPor desde contexto de seguridad
 * - Frontend puede ahora saber quién creó cada pedido
 *
 * **Responsabilidad:**
 * Encapsular todas las operaciones HTTP sobre el endpoint `/pedidos` del backend.
 *
 * **Uso actual:**
 * - Se integra en DataProvider cuando se activa backend real (VITE_USE_LOCAL_AUTH=false)
 * - Páginas de pedidos (admin, cliente) lo consumen vía DataContext
 * - Soporta operaciones CRUD completas
 *
 * **Evolución futura:**
 * - En fase de refactorización de DataContext, este será accedido directamente desde componentes
 * - Permitirá retirar el contexto simulado y usar servicios reales con Suspense/streaming
 *
 * @example
 * // Listar todos los pedidos del usuario actual
 * const pedidos = await pedidosService.list();
 *
 * @example
 * // Crear un nuevo pedido (cliente y creadoPor asignados automáticamente por Backend)
 * const nuevoP = await pedidosService.create({ servicio: "serigrafia", estado: "pendiente" });
 */

interface Pedido {
  id?: number | string;
  clienteId: number;
  clienteNombre?: string;
  // NUEVO: Quién creó el pedido
  creadoPorId?: number;
  creadoPorNombre?: string;
  servicio: string;
  subservicio?: string;
  descripcion?: string;
  cantidad?: number;
  estado?: string;
  total?: number;
  fecha?: string;
  fechaEntrega?: string;
  fileUrlsJson?: string;
  [key: string]: any;
}

interface CrudService {
  list(): Promise<Pedido[]>;
  getById(id: number | string): Promise<Pedido>;
  create(payload: Pedido): Promise<Pedido>;
  update(id: number | string, payload: Partial<Pedido>): Promise<Pedido>;
  remove(id: number | string): Promise<void>;
}

/**
 * Implementación del servicio CRUD de pedidos.
 * Centraliza URLs, métodos HTTP y manejo de errores.
 */
export const pedidosService: CrudService = {
  /** Obtiene lista de todos los pedidos (paginada en backend) */
  list() {
    return httpClient.get("/pedidos") as Promise<Pedido[]>;
  },

  /** Obtiene un pedido específico por ID */
  getById(id) {
    return httpClient.get(`/pedidos/${id}`) as Promise<Pedido>;
  },

  /** Crea un nuevo pedido */
  create(payload) {
    return httpClient.post("/pedidos", payload) as Promise<Pedido>;
  },

  /** Actualiza un pedido existente */
  update(id, payload) {
    return httpClient.put(`/pedidos/${id}`, payload) as Promise<Pedido>;
  },

  /** Elimina un pedido por ID */
  remove(id) {
    return httpClient.delete(`/pedidos/${id}`) as Promise<void>;
  },
};
