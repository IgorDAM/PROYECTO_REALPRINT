import { usePlacements } from '../hooks/usePlacements';
import { Select } from './ui';

interface PlacementSelectorProps {
  category: string | null;
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  label?: string;
}

export function PlacementSelector({
  category,
  value,
  onChange,
  disabled = false,
  label = 'Posición de marcaje',
}: PlacementSelectorProps) {
  const { placements, loading, error } = usePlacements(category);

  if (error) {
    return <div className="text-red-500 text-sm">Error al cargar ubicaciones</div>;
  }

  const options = placements.map((p) => ({
    value: p.id,
    label: `${p.name} (+€${parseFloat(p.basePrice).toFixed(2)})`,
  }));

  return (
    <div>
      <Select
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        options={[
          { value: '', label: 'Selecciona una opción...' },
          ...options,
        ]}
      />
      {loading && <p className="text-sm text-gray-500 mt-1">Cargando...</p>}
    </div>
  );
}

