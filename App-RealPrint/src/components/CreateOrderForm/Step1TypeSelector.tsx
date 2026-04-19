import { GlassCard } from '../ui';

interface Step1TypeSelectorProps {
  value: string;
  onChange: (type: string) => void;
}

export function Step1TypeSelector({ value, onChange }: Step1TypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">¿Qué tipo de pedido deseas?</h2>
        <p className="text-gray-600">Selecciona la opción que mejor se ajuste a tus necesidades</p>
      </div>

      <div className="space-y-3">
        <GlassCard
          className={`p-4 cursor-pointer transition-all ${
            value === 'SCREENPRINTING'
              ? 'ring-2 ring-orange-500 bg-orange-50'
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onChange('SCREENPRINTING')}
        >
          <div className="flex items-start gap-3">
            <input
              type="radio"
              name="orderType"
              value="SCREENPRINTING"
              checked={value === 'SCREENPRINTING'}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1 w-5 h-5 text-orange-500"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Solo Serigrafía</h3>
              <p className="text-sm text-gray-600">
                Tú proporcionas la prenda. Solo necesitas enviar el diseño y nosotros lo serigrafiaremos.
              </p>
              <p className="text-xs text-gray-500 mt-2">Precio desde €X.XX por unidad</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard
          className={`p-4 cursor-pointer transition-all ${
            value === 'SCREENPRINTING_PRESSING'
              ? 'ring-2 ring-orange-500 bg-orange-50'
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onChange('SCREENPRINTING_PRESSING')}
        >
          <div className="flex items-start gap-3">
            <input
              type="radio"
              name="orderType"
              value="SCREENPRINTING_PRESSING"
              checked={value === 'SCREENPRINTING_PRESSING'}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1 w-5 h-5 text-orange-500"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Serigrafía + Planchado</h3>
              <p className="text-sm text-gray-600">
                Incluye serigrafía y planchado para mayor durabilidad. Tú decides si proporcionas la prenda o nosotros te la suministramos.
              </p>
              <p className="text-xs text-gray-500 mt-2">Precio desde €X.XX por unidad</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

