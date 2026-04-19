import { useState, useEffect } from 'react';
import { Button, GlassCard, Select } from '../ui';
import { PlacementModal } from './PlacementModal';
import { placementService } from '../../services/placementService';
import { toast } from 'react-toastify';

export function PlacementsAdmin() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState(null);

  useEffect(() => {
    loadPlacements();
  }, [category]);

  const loadPlacements = async () => {
    setLoading(true);
    try {
      const data = category
        ? await placementService.getByCategory(category)
        : await placementService.getAll();
      setPlacements(data || []);
    } catch (error) {
      toast.error('Error al cargar ubicaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta ubicación?')) {
      return;
    }

    try {
      await placementService.delete(id);
      toast.success('Ubicación eliminada');
      loadPlacements();
    } catch (error) {
      toast.error('Error al eliminar ubicación');
    }
  };

  const handleEdit = (placement) => {
    setEditingPlacement(placement);
    setModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingPlacement(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Ubicaciones de Marcaje</h1>
        <Button onClick={handleCreateNew}>+ Crear nueva ubicación</Button>
      </div>

      <GlassCard className="p-6">
        <div className="mb-4">
          <Select
            label="Filtrar por categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: '', label: 'Todas las categorías' },
              { value: 'SUPERIOR', label: 'Superior' },
              { value: 'INFERIOR', label: 'Inferior' },
            ]}
          />
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando...</div>
        ) : placements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay ubicaciones disponibles
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Precio Base
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {placements.map((placement) => (
                  <tr key={placement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm">{placement.name}</td>
                    <td className="px-6 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          placement.category === 'SUPERIOR'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {placement.category}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      €{parseFloat(placement.basePrice).toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          placement.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {placement.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(placement)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(placement.id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      <PlacementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadPlacements}
        initialData={editingPlacement}
      />
    </div>
  );
}

