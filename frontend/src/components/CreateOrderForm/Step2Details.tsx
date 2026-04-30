import { useEffect, useState, type ChangeEvent } from 'react';
import { Button, Input } from '../ui';
import { PricesSummary } from './PricesSummary';
import { OrderLayoutPreview } from './OrderLayoutPreview';
import type { PricingConfig } from '../../utils/pricingConfig';

interface FormDataStep2 {
  fileUrls?: string[];
  filesWithDimensions?: FileWithDimensions[];
  quantity?: number;
  linearMeters?: number;
  spacingCm?: number;
  unitWidthCm?: number;
  unitHeightCm?: number;
}

interface FileWithDimensions {
  id: string;
  name: string;
  url?: string;
  widthCm?: number;
  heightCm?: number;
}

interface Step2DetailsProps {
  formData: FormDataStep2;
  onChange: (field: string, value: any) => void;
  onUploadFiles?: (files: File[]) => Promise<string[]>;
  onNext: () => void;
  pricingConfig: PricingConfig;
}

export function Step2Details({
  formData,
  onChange,
  onUploadFiles,
  onNext,
  pricingConfig,
}: Step2DetailsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [filesWithDimensions, setFilesWithDimensions] = useState<FileWithDimensions[]>(
    formData.filesWithDimensions || []
  );

  useEffect(() => {
    setFilesWithDimensions(formData.filesWithDimensions || []);
  }, [formData.filesWithDimensions]);

  const syncFormWithFiles = (files: FileWithDimensions[]) => {
    const validFiles = files.filter((file) => Number(file.widthCm) > 0 && Number(file.heightCm) > 0);
    const refWidth = validFiles.length ? Math.max(...validFiles.map((file) => Number(file.widthCm))) : 0;
    const refHeight = validFiles.length ? Math.max(...validFiles.map((file) => Number(file.heightCm))) : 0;

    onChange('filesWithDimensions', files);
    onChange('fileUrls', files.map((file) => file.url || file.name));
    onChange('unitWidthCm', refWidth || undefined);
    onChange('unitHeightCm', refHeight || undefined);
    onChange('linearMeters', refHeight > 0 ? refHeight / 100 : 0);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!Array.isArray(formData.fileUrls) || formData.fileUrls.length === 0) {
      newErrors.fileUrls = 'Por favor sube al menos un archivo';
    }
    if (filesWithDimensions.some((file) => !file.widthCm || !file.heightCm)) {
      newErrors.fileUrls = 'Todos los archivos deben tener ancho y alto definidos';
    }
    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = 'La cantidad debe ser mayor a 0';
    }
    // Calculamos metros lineales a partir de dimensiones
    const hasValidHeights = filesWithDimensions.every((file) => file.heightCm && file.heightCm > 0);
    if (!hasValidHeights) {
      newErrors.fileUrls = 'Todos los archivos deben tener alto definido';
    }
    if (formData.spacingCm !== undefined && formData.spacingCm < 0) {
      newErrors.spacingCm = 'La distancia no puede ser negativa';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (isUploading) return;

    if (validateForm()) {
      onNext();
    }
  };

  const handleAddFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setErrors((prev) => {
      const next = { ...prev };
      delete next.fileUrls;
      return next;
    });

    if (!onUploadFiles) {
      const newFiles = files.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        url: file.name,
        widthCm: undefined,
        heightCm: undefined,
      }));
      const merged = [...filesWithDimensions, ...newFiles];
      setFilesWithDimensions(merged);
      syncFormWithFiles(merged);
      event.target.value = '';
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrls = await onUploadFiles(files);
      const newFiles = uploadedUrls.map((url, index) => ({
        id: `${Date.now()}-${index}`,
        name: files[index].name,
        url,
        widthCm: undefined,
        heightCm: undefined,
      }));
      const merged = [...filesWithDimensions, ...newFiles];
      setFilesWithDimensions(merged);
      syncFormWithFiles(merged);
    } catch {
      setErrors((prev) => ({
        ...prev,
        fileUrls: 'No se pudieron subir los archivos. Intenta de nuevo.',
      }));
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const updateFileDimension = (
    fileId: string,
    dimension: 'widthCm' | 'heightCm',
    value: number | undefined
  ) => {
    const updated = filesWithDimensions.map((file) =>
      file.id === fileId ? { ...file, [dimension]: value } : file
    );
    setFilesWithDimensions(updated);
    syncFormWithFiles(updated);
  };

  const removeFile = (fileId: string) => {
    const filtered = filesWithDimensions.filter((file) => file.id !== fileId);
    setFilesWithDimensions(filtered);
    syncFormWithFiles(filtered);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Detalles del Pedido</h2>
        <p className="text-gray-600">Sube tus archivos, define ancho y alto por unidad y ajusta la separacion entre unidades</p>
      </div>

      <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
        <strong>Ancho fijo del material:</strong> 60 cm. El cálculo de precio se hace por metros lineales.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Archivos de Diseno
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.png"
            multiple
            onChange={handleAddFiles}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
          {isUploading ? (
            <p className="text-xs text-orange-600 mt-1">Subiendo archivos al servidor...</p>
          ) : null}
          {filesWithDimensions.length > 0 ? (
            <div className="mt-4 space-y-3">
              <p className="text-xs font-semibold text-gray-600">Dimensiones de archivos:</p>
              {filesWithDimensions.map(file => (
                <div key={file.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Ancho (cm)"
                      type="number"
                      min="1"
                      step="0.1"
                      value={file.widthCm || ''}
                      onChange={(e) => updateFileDimension(file.id, 'widthCm', parseFloat(e.target.value) || undefined)}
                      placeholder="10"
                    />
                    <Input
                      label="Alto (cm)"
                      type="number"
                      min="1"
                      step="0.1"
                      value={file.heightCm || ''}
                      onChange={(e) => updateFileDimension(file.id, 'heightCm', parseFloat(e.target.value) || undefined)}
                      placeholder="20"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          {errors.fileUrls && <p className="text-red-500 text-sm mt-1">{errors.fileUrls}</p>}
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
          label="Distancia entre unidades (cm)"
          type="number"
          min="0"
          step="0.1"
          value={formData.spacingCm ?? 0}
          onChange={(e) => onChange('spacingCm', Math.max(0, parseFloat(e.target.value) || 0))}
          placeholder="0"
          error={errors.spacingCm}
        />
      </div>

      {filesWithDimensions.length > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          <strong>Calculo automatico:</strong> Se usa el mayor ancho/alto configurado para distribuir unidades en el pano y calcular metros lineales totales por cantidad.
        </div>
      )}

      <OrderLayoutPreview
        filesWithDimensions={filesWithDimensions}
        quantity={formData.quantity}
        spacingCm={formData.spacingCm}
      />

      <PricesSummary orderType="SCREENPRINTING" formData={formData} pricingConfig={pricingConfig} />

      <div className="flex gap-3 pt-4 border-t">
        <Button onClick={handleNext} className="flex-1" disabled={isUploading}>
          {isUploading ? 'Subiendo archivos...' : 'Siguiente'}
        </Button>
      </div>
    </div>
  );
}

