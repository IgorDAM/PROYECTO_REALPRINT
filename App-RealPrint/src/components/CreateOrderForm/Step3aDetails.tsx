import { useState } from 'react';
import { Button, Input, Select, GlassCard } from '../ui';
import { PlacementSelector } from '../Placements/PlacementSelector';
import { PricesSummary } from './PricesSummary';

const CLOTHING_TYPES = ['Camiseta', 'Sudadera', 'Pantalón', 'Polo'];

const CLOTHING_CATEGORIES = {
  Camiseta: 'SUPERIOR',
  Sudadera: 'SUPERIOR',
  Pantalón: 'INFERIOR',
  Polo: 'SUPERIOR',
};

interface Step3aDetailsProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step3aDetails({
  formData,
  onChange,
  onNext,
  onPrev,
}: Step3aDetailsProps) {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fileUrl?.trim()) {
      newErrors.fileUrl = 'Por favor sube un archivo';
    }
    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = 'La cantidad debe ser mayor a 0';
    }
    if (!formData.measurementCm || formData.measurementCm < 1) {
      newErrors.measurementCm = 'La medida debe ser mayor a 0';
    }
    if (!formData.clothingType) {
      newErrors.clothingType = 'Selecciona un tipo de prenda';
    }
    if (!formData.locationPlacementId) {
      newErrors.locationPlacementId = 'Selecciona una posición de marcaje';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const category = formData.clothingType ? CLOTHING_CATEGORIES[formData.clothingType] : null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Detalles - Prenda Propia</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Archivo de Diseño
          </label>
          <input
            type="file"
            accept=".ai,.pdf,.png,.jpg,.jpeg"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                onChange('fileUrl', e.target.files[0].name);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
          {errors.fileUrl && <p className="text-red-500 text-sm mt-1">{errors.fileUrl}</p>}
        </div>

        <Input
          label="Cantidad de unidades"
          type="number"
          min="1"
          max="1000"
          value={formData.quantity || ''}
          onChange={(e) => onChange('quantity', parseInt(e.target.value) || 0)}
          placeholder="10"
          error={errors.quantity}
        />

        <Input
          label="Medida de impresión (cm)"
          type="number"
          min="1"
          max="50"
          value={formData.measurementCm || ''}
          onChange={(e) => onChange('measurementCm', parseInt(e.target.value) || 0)}
          placeholder="15"
          error={errors.measurementCm}
        />

        <Select
          label="Tipo de prenda"
          value={formData.clothingType || ''}
          onChange={(e) => {
            onChange('clothingType', e.target.value);
            // Reset locationPlacementId when clothing type changes
            onChange('locationPlacementId', '');
          }}
          options={[
            { value: '', label: 'Selecciona una prenda...' },
            ...CLOTHING_TYPES.map((type) => ({ value: type, label: type })),
          ]}
          error={errors.clothingType}
        />

        {category && (
          <PlacementSelector
            category={category}
            value={formData.locationPlacementId || ''}
            onChange={(id) => onChange('locationPlacementId', id)}
            label="Posición de marcaje"
          />
        )}
      </div>

      <PricesSummary orderType="SCREENPRINTING_PRESSING" formData={formData} />

      <div className="flex gap-3 pt-4">
        <Button onClick={onPrev} variant="secondary" className="flex-1">
          Atrás
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Siguiente
        </Button>
      </div>
    </div>
  );
}

