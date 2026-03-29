import { httpClient } from "./httpClient";

/**
 * Servicio de inventario preparado para backend Spring Boot.
 * Se consume de forma incremental mediante wrappers safe en DataContext.
 */

interface CrudService {
  list(): Promise<unknown>;
  getById(id: number | string): Promise<unknown>;
  create(payload: Record<string, any>): Promise<unknown>;
  update(id: number | string, payload: Record<string, any>): Promise<unknown>;
  remove(id: number | string): Promise<unknown>;
}

export const inventarioService: CrudService = {
  list() {
    return httpClient.get("/inventario");
  },

  getById(id) {
    return httpClient.get(`/inventario/${id}`);
  },

  create(payload) {
    return httpClient.post("/inventario", payload);
  },

  update(id, payload) {
    return httpClient.put(`/inventario/${id}`, payload);
  },

  remove(id) {
    return httpClient.delete(`/inventario/${id}`);
  },
};

