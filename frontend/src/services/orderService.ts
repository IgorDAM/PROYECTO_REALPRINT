import { getToken } from './tokenStorage';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const orderService = {
  // Crear orden
  createOrder: async (orderData) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error creating order');
      }

      return res.json();
    } catch (error) {
      console.error('Error en orderService.createOrder:', error);
      throw error;
    }
  },

  // Obtener todas las órdenes del cliente
  getOrders: async () => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/orders`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) throw new Error('Error fetching orders');
      return res.json();
    } catch (error) {
      console.error('Error en orderService.getOrders:', error);
      throw error;
    }
  },

  // Obtener orden por ID
  getOrderById: async (id) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/orders/${id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) throw new Error('Error fetching order');
      return res.json();
    } catch (error) {
      console.error('Error en orderService.getOrderById:', error);
      throw error;
    }
  },

  // Subir archivo
  uploadFile: async (file) => {
    try {
      // Comentario didáctico: en multipart no enviamos Content-Type manual,
      // el navegador lo calcula con el boundary correcto.
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

      if (!res.ok) throw new Error('Error uploading file');
      const data = await res.json();
      return data.url || data.fileUrl;
    } catch (error) {
      console.error('Error en orderService.uploadFile:', error);
      throw error;
    }
  },
};

