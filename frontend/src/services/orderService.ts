import { getToken } from './tokenStorage';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const orderService = {
  // Crear pedido
  createOrder: async (orderData) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al crear pedido');
      }

      return res.json();
    } catch (error) {
      console.error('Error en orderService.createOrder:', error);
      throw error;
    }
  },

  // Obtener todos los pedidos
  getOrders: async () => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/pedidos`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) throw new Error('Error al obtener pedidos');
      return res.json();
    } catch (error) {
      console.error('Error en orderService.getOrders:', error);
      throw error;
    }
  },

  // Obtener pedido por ID
  getOrderById: async (id) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/pedidos/${id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) throw new Error('Error al obtener pedido');
      return res.json();
    } catch (error) {
      console.error('Error en orderService.getOrderById:', error);
      throw error;
    }
  },

  // Subir archivo (POST /upload)
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = getToken();
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Error al subir archivo');
      const data = await res.json();
      return data.url || data.fileUrl;
    } catch (error) {
      console.error('Error en orderService.uploadFile:', error);
      throw error;
    }
  },
};
