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

interface PedidoArchivoResponse {
  id: number;
  pedidoId: number;
  nombreArchivo: string;
  urlArchivo: string;
  tipoMime: string;
  tamaño: number;
  createdAt: string;
}

interface CrudService {
  list(): Promise<Pedido[]>;
  listMisPedidos(): Promise<Pedido[]>;
  getById(id: number | string): Promise<Pedido>;
  create(payload: Omit<Pedido, "id" | "clienteId" | "clienteNombre">): Promise<Pedido>;
  update(id: number | string, payload: Partial<Pedido>): Promise<Pedido>;
  remove(id: number | string): Promise<void>;
  uploadFile(file: File): Promise<string>;
  uploadFileToOrder(pedidoId: number | string, file: File): Promise<PedidoArchivoResponse>;
}

export const pedidosService: CrudService = {
  list() {
    return httpClient.get("/pedidos") as Promise<Pedido[]>;
  },

  listMisPedidos() {
    return httpClient.get("/pedidos/mis-pedidos") as Promise<Pedido[]>;
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

  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('realprint_token');

    // Para multipart/form-data, NO usar httpClient que fuerza Content-Type: application/json
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/files`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // NO incluir Content-Type para que fetch lo establezca automáticamente con el boundary
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir archivo');
    }

    const data = await response.json();
    return data.url || data.fileUrl;
  },

  /**
   * Sube un archivo y lo asocia a un pedido específico.
   * Usa el nuevo endpoint POST /pedidos/{pedidoId}/archivos
   * que crea el registro en pedido_archivos.
   *
   * @param pedidoId ID del pedido al que asociar el archivo
   * @param file Archivo a subir
   * @returns Información del archivo guardado
   */
  async uploadFileToOrder(pedidoId: number | string, file: File): Promise<PedidoArchivoResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('realprint_token');

    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/pedidos/${pedidoId}/archivos`,
      {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al subir archivo al pedido: ${errorText}`);
    }

    return await response.json();
  },
};
