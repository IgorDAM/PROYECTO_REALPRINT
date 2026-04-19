import { useState, useEffect } from 'react';
import { Button, Input, Select, GlassCard } from '../ui';
import { PlacementSelector } from '../Placements/PlacementSelector';
import { PricesSummary } from './PricesSummary';

const CLOTHING_CATEGORIES = {
  Camiseta: 'SUPERIOR',
  Sudadera: 'SUPERIOR',
  Pantalón: 'INFERIOR',
  Polo: 'SUPERIOR',
};

interface Step3bDetailsProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

// Mock de productos de inventario. Cambiar por API real
const MOCK_INVENTORY = [
  {
    id: 'inv-1',
    name: 'Camiseta Blanca',
    clothingType: 'Camiseta',
    price: 5.5,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'inv-2',
    name: 'Camiseta Negra',
    clothingType: 'Camiseta',
    price: 5.5,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'inv-3',
    name: 'Sudadera Gris',
    clothingType: 'Sudadera',
    price: 12.0,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'inv-4',
    name: 'Pantalón Negro',
    clothingType: 'Pantalón',
    price: 15.0,
    sizes: ['S', 'M', 'L', 'XL'],
  },
];

export function Step3bDetails({
  formData,
  onChange,
  onNext,
  onPrev,
}: Step3bDetailsProps) {
  const [errors, setErrors] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (formData.inventoryProductId) {
      const product = MOCK_INVENTORY.find((p) => p.id === formData.inventoryProductId);
      setSelectedProduct(product);
    }
  }, [formData.inventoryProductId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.inventoryProductId) {
      newErrors.inventoryProductId = 'Selecciona una prenda';
    }
    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = 'La cantidad debe ser mayor a 0';
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

  const category = selectedProduct
    ? CLOTHING_CATEGORIES[selectedProduct.clothingType]
    : null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Detalles - Prenda de RealPrint</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Selecciona prenda"
          value={formData.inventoryProductId || ''}
          onChange={(e) => {
            onChange('inventoryProductId', e.target.value);
            onChange('locationPlacementId', ''); // Reset placement when product changes
          }}
          options={[
            { value: '', label: 'Selecciona una prenda...' },
            ...MOCK_INVENTORY.map((product) => ({
              value: product.id,
              label: `${product.name} - €${product.price.toFixed(2)}`,
            })),
          ]}
          error={errors.inventoryProductId}
        />

        {selectedProduct && (
          <Select
            label="Talla"
            value={formData.size || ''}
            onChange={(e) => onChange('size', e.target.value)}
            options={[
              { value: '', label: 'Selecciona talla...' },
              ...selectedProduct.sizes.map((size) => ({ value: size, label: size })),
            ]}
          />
        )}

        {category && (
          <PlacementSelector
            category={category}
            value={formData.locationPlacementId || ''}
            onChange={(id) => onChange('locationPlacementId', id)}
            label="Posición de marcaje"
          />
        )}

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
      </div>

      {selectedProduct && (
        <GlassCard className="bg-blue-50 p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Información de la prenda:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              <strong>Producto:</strong> {selectedProduct.name}
            </li>
            <li>
              <strong>Precio unitario:</strong> €{selectedProduct.price.toFixed(2)}
            </li>
            <li>
              <strong>Talla:</strong> {formData.size || 'No seleccionada'}
            </li>
          </ul>
        </GlassCard>
      )}

      <PricesSummary orderType="SCREENPRINTING_PRESSING" formData={formData} showDetailedBreakdown />

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

