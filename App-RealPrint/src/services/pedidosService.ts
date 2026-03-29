import { httpClient } from "./httpClient";

/**
 * Servicio de pedidos (primera version).
 *
 * Nota:
 * - cuando VITE_USE_LOCAL_AUTH=true no se usa aun en UI,
 * - se deja listo para conectar paginas de pedidos de forma incremental.
 */

interface CrudService {
  list(): Promise<unknown>;
  getById(id: number | string): Promise<unknown>;
  create(payload: Record<string, any>): Promise<unknown>;
  update(id: number | string, payload: Record<string, any>): Promise<unknown>;
  remove(id: number | string): Promise<unknown>;
}

export const pedidosService: CrudService = {
  list() {
    return httpClient.get("/pedidos");
  },

  getById(id) {
    return httpClient.get(`/pedidos/${id}`);
  },

  create(payload) {
    return httpClient.post("/pedidos", payload);
  },

  update(id, payload) {
    return httpClient.put(`/pedidos/${id}`, payload);
  },

  remove(id) {
    return httpClient.delete(`/pedidos/${id}`);
  },
};

