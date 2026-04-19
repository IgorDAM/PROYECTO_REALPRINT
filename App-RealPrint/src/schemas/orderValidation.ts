import { z } from 'zod';

export const Step1Schema = z.object({
  orderType: z.enum(['SCREENPRINTING', 'SCREENPRINTING_PRESSING'], {
    errorMap: () => ({ message: 'Selecciona un tipo de pedido' }),
  }),
});

export const Step2ScreenprintingSchema = z.object({
  fileUrl: z.string().min(1, 'Archivo requerido'),
  quantity: z.number().int().min(1, 'Mínimo 1 unidad').max(1000, 'Máximo 1000 unidades'),
  measurementCm: z.number().int().min(1, 'Mínimo 1 cm').max(50, 'Máximo 50 cm'),
});

export const Step2PressingSchema = z.object({
  clientProvidedClothing: z.boolean(),
});

export const Step3aSchema = z.object({
  fileUrl: z.string().min(1, 'Archivo requerido'),
  quantity: z.number().int().min(1, 'Mínimo 1 unidad').max(1000, 'Máximo 1000 unidades'),
  measurementCm: z.number().int().min(1, 'Mínimo 1 cm').max(50, 'Máximo 50 cm'),
  clothingType: z.enum(['Camiseta', 'Sudadera', 'Pantalón', 'Polo'], {
    errorMap: () => ({ message: 'Selecciona un tipo de prenda' }),
  }),
  locationPlacementId: z.string().min(1, 'Selecciona una posición de marcaje'),
});

export const Step3bSchema = z.object({
  inventoryProductId: z.string().min(1, 'Selecciona una prenda'),
  locationPlacementId: z.string().min(1, 'Selecciona una posición de marcaje'),
  quantity: z.number().int().min(1, 'Mínimo 1 unidad').max(1000, 'Máximo 1000 unidades'),
  finalProductId: z.string().optional(),
});

export const Step4Schema = z.object({
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos de servicio',
  }),
  dataCorrect: z.boolean().refine((val) => val === true, {
    message: 'Debes confirmar que los datos son correctos',
  }),
});

export const OrderItemSchema = z.object({
  type: z.enum(['SCREENPRINTING', 'SCREENPRINTING_PRESSING']),
  clientProvidedClothing: z.boolean().optional(),
  fileUrl: z.string().optional(),
  quantity: z.number().int().min(1),
  measurementCm: z.number().int().optional(),
  locationPlacementId: z.string().optional(),
  inventoryProductId: z.string().optional(),
  finalProductId: z.string().optional(),
});

export const CreateOrderSchema = z.object({
  customerId: z.string().min(1, 'Cliente requerido'),
  items: z.array(OrderItemSchema).min(1, 'Mínimo 1 item'),
});

export type Step1Type = z.infer<typeof Step1Schema>;
export type Step2ScreenprintingType = z.infer<typeof Step2ScreenprintingSchema>;
export type Step2PressingType = z.infer<typeof Step2PressingSchema>;
export type Step3aType = z.infer<typeof Step3aSchema>;
export type Step3bType = z.infer<typeof Step3bSchema>;
export type Step4Type = z.infer<typeof Step4Schema>;
export type OrderItemType = z.infer<typeof OrderItemSchema>;
export type CreateOrderType = z.infer<typeof CreateOrderSchema>;

