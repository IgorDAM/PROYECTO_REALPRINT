import { z } from 'zod';

export const Step1Schema = z.object({
  linearMeters: z.number().positive('Los metros lineales deben ser mayores a 0'),
  spacingCm: z.number().min(0, 'La separación no puede ser negativa').default(0),
});

export const Step2Schema = z.object({
  fileUrls: z.array(z.string().min(1)).min(1, 'Archivo requerido'),
  quantity: z.number().int().min(1, 'Mínimo 1 unidad').max(1000, 'Máximo 1000 unidades'),
  linearMeters: z.number().positive('Los metros lineales deben ser mayores a 0'),
  spacingCm: z.number().min(0, 'La separación no puede ser negativa').default(0),
});

export const Step3Schema = z.object({
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos de servicio',
  }),
  dataCorrect: z.boolean().refine((val) => val === true, {
    message: 'Debes confirmar que los datos son correctos',
  }),
});

export const OrderItemSchema = z.object({
  type: z.literal('SCREENPRINTING'),
  fileUrls: z.array(z.string().min(1)).min(1),
  quantity: z.number().int().min(1),
  linearMeters: z.number().positive(),
  spacingCm: z.number().min(0).default(0),
});

export const CreateOrderSchema = z.object({
  customerId: z.string().min(1, 'Cliente requerido'),
  items: z.array(OrderItemSchema).min(1, 'Mínimo 1 item'),
});

export type Step1Type = z.infer<typeof Step1Schema>;
export type Step2Type = z.infer<typeof Step2Schema>;
export type Step3Type = z.infer<typeof Step3Schema>;
export type OrderItemType = z.infer<typeof OrderItemSchema>;
export type CreateOrderType = z.infer<typeof CreateOrderSchema>;

