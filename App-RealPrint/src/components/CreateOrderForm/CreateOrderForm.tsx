import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Step1TypeSelector } from './Step1TypeSelector';
import { Step2Details } from './Step2Details';
import { Step3aDetails } from './Step3aDetails';
import { Step3bDetails } from './Step3bDetails';
import { Step4Review } from './Step4Review';
import { GlassCard } from '../ui';
import { orderService } from '../../services/orderService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export function CreateOrderForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const [formData, setFormData] = useState({
    // Step 1
    orderType: '',
    // Step 2
    clientProvidedClothing: null,
    // Común
    fileUrl: '',
    quantity: '',
    measurementCm: '',
    // Step 3a (prenda propia)
    clothingType: '',
    locationPlacementId: '',
    // Step 3b (prenda RealPrint)
    inventoryProductId: '',
    size: '',
    // Step 4
    dataCorrect: false,
    termsAccepted: false,
  });

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddItem = () => {
    const item = {
      type: formData.orderType,
      clientProvidedClothing: formData.clientProvidedClothing,
      fileUrl: formData.fileUrl,
      quantity: formData.quantity,
      measurementCm: formData.measurementCm,
      clothingType: formData.clothingType,
      locationPlacementId: formData.locationPlacementId,
      inventoryProductId: formData.inventoryProductId,
      size: formData.size,
      // Mock price - en producción viene del backend
      price: 25.0,
    };

    setItems([...items, item]);
    resetForm();
    setCurrentStep(1);
    toast.success('Item agregado al carrito');
  };

  const resetForm = () => {
    setFormData({
      orderType: '',
      clientProvidedClothing: null,
      fileUrl: '',
      quantity: '',
      measurementCm: '',
      clothingType: '',
      locationPlacementId: '',
      inventoryProductId: '',
      size: '',
      dataCorrect: false,
      termsAccepted: false,
    });
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('Debes estar autenticado');
      return;
    }

    setLoading(true);
    try {
      // Preparar datos para el backend
      const orderData = {
        customerId: user.id,
        items: items.map((item) => ({
          type: item.type,
          clientProvidedClothing: item.clientProvidedClothing,
          fileUrl: item.fileUrl,
          quantity: item.quantity,
          measurementCm: item.measurementCm,
          locationPlacementId: item.locationPlacementId,
          inventoryProductId: item.inventoryProductId,
        })),
      };

      const response = await orderService.createOrder(orderData);
      toast.success('¡Pedido creado exitosamente!');
      navigate(`/cliente/pedidos/${response.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al crear el pedido'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1TypeSelector
            value={formData.orderType}
            onChange={(type) => handleFieldChange('orderType', type)}
          />
        );

      case 2:
        return (
          <Step2Details
            orderType={formData.orderType}
            formData={formData}
            onChange={handleFieldChange}
            onNext={() => {
              if (formData.orderType === 'SCREENPRINTING_PRESSING') {
                if (formData.clientProvidedClothing === true) {
                  setCurrentStep(3);
                } else {
                  setCurrentStep(4);
                }
              } else {
                setCurrentStep(5);
              }
            }}
            onPrev={() => setCurrentStep(1)}
          />
        );

      case 3:
        return (
          <Step3aDetails
            formData={formData}
            onChange={handleFieldChange}
            onNext={() => setCurrentStep(5)}
            onPrev={() => setCurrentStep(2)}
          />
        );

      case 4:
        return (
          <Step3bDetails
            formData={formData}
            onChange={handleFieldChange}
            onNext={() => setCurrentStep(5)}
            onPrev={() => setCurrentStep(2)}
          />
        );

      case 5:
        return (
          <Step4Review
            items={items}
            formData={formData}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
            onPrev={() => {
              if (
                formData.orderType === 'SCREENPRINTING_PRESSING' &&
                formData.clientProvidedClothing === true
              ) {
                setCurrentStep(3);
              } else if (
                formData.orderType === 'SCREENPRINTING_PRESSING' &&
                formData.clientProvidedClothing === false
              ) {
                setCurrentStep(4);
              } else {
                setCurrentStep(2);
              }
            }}
            loading={loading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Crear Nuevo Pedido</h1>
        <p className="text-gray-600">
          Completa los pasos para realizar tu pedido de serigrafía
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                step <= currentStep
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <GlassCard className="p-8 mb-8">
        {renderStep()}
      </GlassCard>

      {/* Items Summary Sidebar */}
      {items.length > 0 && (
        <GlassCard className="p-6 bg-blue-50">
          <h3 className="font-bold text-lg mb-4">
            Items en el carrito ({items.length})
          </h3>
          <div className="space-y-2 text-sm">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between pb-2 border-b">
                <span>
                  {item.type === 'SCREENPRINTING'
                    ? 'Serigrafía Simple'
                    : 'Serigrafía + Planchado'}
                </span>
                <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

