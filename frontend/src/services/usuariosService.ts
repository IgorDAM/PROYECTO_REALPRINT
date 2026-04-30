import { httpClient } from "./httpClient";

/**
 * Servicio CRUD de usuarios.
 *
 * **Responsabilidad:**
 * Encapsular todas las operaciones HTTP sobre el endpoint `/usuarios` del backend.
 *
 * **Estructura backend esperada (Spring Boot):**
 * - Controlador en `com.realprint.realprintbackend.controller.UsuarioController`
 * - Entidad Usuario con campos: id, username, nombre, email, role, activo
 * - Repositorio: `UsuarioRepository extends JpaRepository<Usuario, Long>`
 *
 * **Consumer:**
 * - DataProvider lo usa para poblar/sincronizar la lista de usuarios en admin
 * - AdminUsuarios lo consume para CRUD visual
 *
 * @example
 * // Listar usuarios
 * const usuarios = await usuariosService.list();
 *
 * @example
 * // Crear nuevo usuario
 * const nuevoUs = await usuariosService.create({
 *   username: "cliente1",
 *   nombre: "Juan",
 *   email: "juan@example.com",
 *   role: "cliente",
 *   activo: true
 * });
 */

interface Usuario {
  id?: number | string;
  username: string;
  nombre: string;
  email?: string;
  role: "admin" | "cliente" | string;
  activo?: boolean;
  especialidad?: string;
  [key: string]: any;
}

interface CrudService {
  list(): Promise<Usuario[]>;
  getById(id: number | string): Promise<Usuario>;
  create(payload: Usuario): Promise<Usuario>;
  update(id: number | string, payload: Partial<Usuario>): Promise<Usuario>;
  remove(id: number | string): Promise<void>;
}

/**
 * Implementación del servicio CRUD de usuarios.
 */
export const usuariosService: CrudService = {
  /** Obtiene lista completa de usuarios con paginación (backend) */
  list() {
    return httpClient.get("/usuarios") as Promise<Usuario[]>;
  },

  /** Obtiene un usuario específico por ID */
  getById(id) {
    return httpClient.get(`/usuarios/${id}`) as Promise<Usuario>;
  },

  /** Crea un nuevo usuario (requiere rol admin) */
  create(payload) {
    return httpClient.post("/usuarios", payload) as Promise<Usuario>;
  },

  /** Actualiza datos de un usuario existente */
  update(id, payload) {
    return httpClient.put(`/usuarios/${id}`, payload) as Promise<Usuario>;
  },

  /** Desactiva o elimina un usuario (requiere rol admin) */
  remove(id) {
    return httpClient.delete(`/usuarios/${id}`) as Promise<void>;
  },
};

