const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const placementService = {
  // Listar todas las ubicaciones (activas)
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE}/placements`);
      if (!res.ok) throw new Error('Error fetching placements');
      return res.json();
    } catch (error) {
      console.error('Error en placementService.getAll:', error);
      throw error;
    }
  },

  // Listar por categoría (SUPERIOR o INFERIOR)
  getByCategory: async (category) => {
    try {
      const res = await fetch(`${API_BASE}/placements/by-category/${category}`);
      if (!res.ok) throw new Error(`Error fetching ${category} placements`);
      return res.json();
    } catch (error) {
      console.error(`Error en placementService.getByCategory(${category}):`, error);
      throw error;
    }
  },

  // Obtener por ID
  getById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/placements/${id}`);
      if (!res.ok) throw new Error('Error fetching placement');
      return res.json();
    } catch (error) {
      console.error('Error en placementService.getById:', error);
      throw error;
    }
  },

  // Crear ubicación (solo ADMIN)
  create: async (data) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/placements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error creating placement');
      }
      return res.json();
    } catch (error) {
      console.error('Error en placementService.create:', error);
      throw error;
    }
  },

  // Actualizar ubicación (solo ADMIN)
  update: async (id, data) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/placements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error updating placement');
      return res.json();
    } catch (error) {
      console.error('Error en placementService.update:', error);
      throw error;
    }
  },

  // Eliminar ubicación (soft delete, solo ADMIN)
  delete: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/placements/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) throw new Error('Error deleting placement');
    } catch (error) {
      console.error('Error en placementService.delete:', error);
      throw error;
    }
  },
};

