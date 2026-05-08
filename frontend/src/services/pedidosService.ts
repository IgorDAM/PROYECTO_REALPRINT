import { httpClient } from "./httpClient";

/**
 * Servicio CRUD de pedidos.
 *
 * Interfaz sincronizada con PedidoDTO.java del backend:
 * - id, clienteId, clienteNombre, servicio, descripcion, cantidad
 * - fecha, fechaEntrega, measurementWidthCm, measurementHeightCm
 * - estado, total
 */

export interface Pedido {
  id?: number | string;
  clienteId?: number;
  clienteNombre?: string;
  servicio: string;
  descripcion?: string;
  cantidad?: number;
  estado?: string;
  total?: number;
  fecha?: string;
  fechaEntrega?: string;
  measurementWidthCm?: number;
  measurementHeightCm?: number;
  [key: string]: any;
}

interface CrudService {
  list(): Promise<Pedido[]>;
  getById(id: number | string): Promise<Pedido>;
  create(payload: Omit<Pedido, "id" | "clienteId" | "clienteNombre">): Promise<Pedido>;
  update(id: number | string, payload: Partial<Pedido>): Promise<Pedido>;
  remove(id: number | string): Promise<void>;
}

export const pedidosService: CrudService = {
  list() {
    return httpClient.get("/pedidos") as Promise<Pedido[]>;
  },

  getById(id) {
    return httpClient.get(`/pedidos/${id}`) as Promise<Pedido>;
  },

  create(payload) {
    return httpClient.post("/pedidos", payload) as Promise<Pedido>;
  },

  update(id, payload) {
    return httpClient.put(`/pedidos/${id}`, payload) as Promise<Pedido>;
  },

  remove(id) {
    return httpClient.delete(`/pedidos/${id}`) as Promise<void>;
  },
};
