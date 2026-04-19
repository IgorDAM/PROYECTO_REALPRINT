import { useState } from 'react';
import { Button, Input, Select, GlassCard } from '../ui';
import { placementService } from '../../services/placementService';
import { toast } from 'react-toastify';
import { z } from 'zod';

const CreatePlacementSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres').max(50, 'Máximo 50 caracteres'),
  category: z.enum(['SUPERIOR', 'INFERIOR']),
  basePrice: z.coerce.number().positive('El precio debe ser mayor a 0'),
});

interface PlacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export function PlacementModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: PlacementModalProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    basePrice: initialData?.basePrice || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const validated = CreatePlacementSchema.parse({
        ...formData,
        basePrice: parseFloat(formData.basePrice),
      });

      if (initialData?.id) {
        await placementService.update(initialData.id, validated);
        toast.success('Ubicación actualizada correctamente');
      } else {
        await placementService.create(validated);
        toast.success('Ubicación creada correctamente');
      }

      setFormData({ name: '', category: '', basePrice: '' });
      onSuccess();
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        toast.error(error instanceof Error ? error.message : 'Error al guardar');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <GlassCard className="w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">
          {initialData?.id ? 'Editar ubicación' : 'Nueva ubicación'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Pecho"
            error={errors.name}
            disabled={loading}
          />

          <Select
            label="Categoría"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={[
              { value: '', label: 'Selecciona una categoría...' },
              { value: 'SUPERIOR', label: 'Superior (Camiseta, Sudadera)' },
              { value: 'INFERIOR', label: 'Inferior (Pantalón)' },
            ]}
            error={errors.category}
            disabled={loading}
          />

          <Input
            label="Precio base (€)"
            name="basePrice"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.basePrice}
            onChange={handleChange}
            placeholder="5.00"
            error={errors.basePrice}
            disabled={loading}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              disabled={loading}
              variant="secondary"
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

