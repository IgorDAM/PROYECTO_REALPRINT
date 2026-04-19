import { useState } from 'react';
import { Button, Input, GlassCard } from '../ui';
import { PricesSummary } from './PricesSummary';

interface Step2DetailsProps {
  orderType: string;
  formData: any;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step2Details({
  orderType,
  formData,
  onChange,
  onNext,
  onPrev,
}: Step2DetailsProps) {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  if (orderType === 'SCREENPRINTING_PRESSING') {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Opción de Suministro</h2>

        <div className="space-y-3">
          <GlassCard
            className={`p-4 cursor-pointer transition-all ${
              formData.clientProvidedClothing === true
                ? 'ring-2 ring-orange-500 bg-orange-50'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onChange('clientProvidedClothing', true)}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="clothingSource"
                checked={formData.clientProvidedClothing === true}
                onChange={() => onChange('clientProvidedClothing', true)}
                className="mt-1"
              />
              <div>
                <h3 className="font-semibold">Yo proporciono la prenda</h3>
                <p className="text-sm text-gray-600">
                  Envías la prenda. Nosotros serigrafiaremos y planchamos.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            className={`p-4 cursor-pointer transition-all ${
              formData.clientProvidedClothing === false
                ? 'ring-2 ring-orange-500 bg-orange-50'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onChange('clientProvidedClothing', false)}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="clothingSource"
                checked={formData.clientProvidedClothing === false}
                onChange={() => onChange('clientProvidedClothing', false)}
                className="mt-1"
              />
              <div>
                <h3 className="font-semibold">RealPrint proporciona la prenda</h3>
                <p className="text-sm text-gray-600">
                  Selecciona de nuestro catálogo. Precio todo incluido.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={onPrev} variant="secondary" className="flex-1">
            Atrás
          </Button>
          <Button
            onClick={handleNext}
            disabled={formData.clientProvidedClothing === null || formData.clientProvidedClothing === undefined}
            className="flex-1"
          >
            Siguiente
          </Button>
        </div>
      </div>
    );
  }

  // Para SCREENPRINTING simple
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Detalles del Pedido</h2>

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
                // Aquí iría lógica para subir el archivo
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
      </div>

      <PricesSummary orderType={orderType} formData={formData} />

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

