import { httpClient } from "./httpClient";

/**
 * Servicio de usuarios preparado para backend Spring Boot.
 * Se consume gradualmente mediante wrappers safe en DataContext.
 */
export const usuariosService = {
  list() {
    return httpClient.get("/usuarios");
  },

  getById(id) {
    return httpClient.get(`/usuarios/${id}`);
  },

  create(payload) {
    return httpClient.post("/usuarios", payload);
  },

  update(id, payload) {
    return httpClient.put(`/usuarios/${id}`, payload);
  },

  remove(id) {
    return httpClient.delete(`/usuarios/${id}`);
  },
};

