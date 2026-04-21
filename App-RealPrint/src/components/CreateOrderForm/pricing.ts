/**
 * pricing.ts
 * Propósito: Cálculo centralizado de métricas de distribución y precios de pedidos lineales.
 * 
 * Funciones principales:
 * - calculateLayoutMetrics(): Distribuye unidades en filas/columnas dentro del paño (60cm ancho fijo)
 *   considerando altura de unidad, cantidad y separación. Devuelve metros lineales totales facturables.
 * - calculateOrderPricing(): Integra layout + rangos de precios para calcular precio final por metro lineal.
 * 
 * Características:
 * - Soporte para modo "con dimensiones" (unitWidthCm, unitHeightCm) y "legacy" (linearMeters directo).
 * - Redondeo facturable al metro completo (Math.ceil).
 * - Validación defensiva de entradas (safeQuantity, safeSpacingCm, etc).
 */

import {
  DEFAULT_PRICING_CONFIG,
  getRangeForLinearMeters,
  type PricingConfig,
} from "../../utils/pricingConfig";

/** Ancho material del paño en centímetros (constante de negocio) */
export const MATERIAL_WIDTH_CM = 60;

/**
 * Entrada para cálculo de distribución de unidades.
 * Soporta dos modos:
 * 1. Con dimensiones: unitWidthCm + unitHeightCm → calcula automáticamente metros lineales.
 * 2. Legacy: linearMeters directamente.
 */
export interface LayoutMetricsInput {
  quantity?: number; // Cantidad total de unidades a distribuir
  spacingCm?: number; // Separación entre unidades en centímetros
  linearMeters?: number; // Modo legacy: metros lineales por unidad (ignorado si hay dimensiones)
  unitWidthCm?: number; // Ancho de cada unidad en cm
  unitHeightCm?: number; // Alto de cada unidad en cm (determina metros lineales por unidad)
}

/**
 * Resultado del cálculo de distribución de unidades y metros facturables.
 * Información usada por preview, cálculo de precios y payloads.
 */
export interface LayoutMetricsResult {
  quantity: number; // Cantidad normalizada (mínimo 1)
  spacingCm: number; // Separación normalizada (mínimo 0)
  unitWidthCm?: number; // Ancho de unidad procesado
  unitHeightCm?: number; // Alto de unidad procesado
  unitsPerRow: number; // Cuántas unidades caben en el ancho (60 cm)
  rows: number; // Cuántas filas se necesitan para distribuir todas
  linearMetersPerUnit: number; // Metros lineales que ocupa cada unidad (alto/100)
  totalLinearMetersRaw: number; // Total de metros sin redondeo (filas * alto + espacios)
  billableLinearMeters: number; // Total redondeado al metro superior completo (facturable)
}

/**
 * Calcula distribución de unidades en el paño y metros lineales totales.
 * 
 * Flujo:
 * 1. Normaliza entradas (seguridad defensiva).
 * 2. Detecta modo: ¿tenemos dimensiones o usamos legacy?
 * 3. Si dimensiones: calcula unitsPerRow = (60 + spacing) / (unitWidth + spacing), redondeado hacia abajo.
 * 4. Si dimensiones: calcula rows = cantidad / unitsPerRow, redondeado hacia arriba.
 * 5. Si dimensiones: metros totales = (rows * unitHeight + (rows-1)*spacing) / 100.
 * 6. Si legacy: metros totales = (linearMeters * quantity) + (cantidad-1)*spacing/100.
 * 7. Redondea al metro facturable (Math.ceil).
 * 
 * Retorna: distribución + metros facturables (usado por preview + pricing).
 */
export function calculateLayoutMetrics({
  quantity,
  spacingCm,
  linearMeters,
  unitWidthCm,
  unitHeightCm,
}: LayoutMetricsInput): LayoutMetricsResult {
  // Normalizar: evita NaN, negativos y da valores seguros por defecto.
  const safeQuantity = Math.max(1, Number(quantity) || 1);
  const safeSpacingCm = Math.max(0, Number(spacingCm) || 0);
  const safeUnitWidthCm = Number(unitWidthCm) > 0 ? Number(unitWidthCm) : undefined;
  const safeUnitHeightCm = Number(unitHeightCm) > 0 ? Number(unitHeightCm) : undefined;

  // Detectar modo: si tenemos ambas dimensiones, usamos distribución; si no, legacy.
  const canUseLayoutByDimensions = Boolean(safeUnitWidthCm && safeUnitHeightCm);

  // Calcular distribución en filas/columnas (modo dimensiones) o default 1 por fila (legacy).
  const unitsPerRow = canUseLayoutByDimensions
    ? Math.max(1, Math.floor((MATERIAL_WIDTH_CM + safeSpacingCm) / (safeUnitWidthCm! + safeSpacingCm)))
    : 1;
  const rows = Math.max(1, Math.ceil(safeQuantity / unitsPerRow));

  // Calcular metros lineales por unidad.
  const linearMetersPerUnit = canUseLayoutByDimensions
    ? safeUnitHeightCm! / 100 // Método 1: alto de unidad en metros
    : Math.max(0, Number(linearMeters) || 0); // Método 2: legacy directo

  // Calcular total de metros lineales antes de redondeo.
  const totalLinearMetersRaw = canUseLayoutByDimensions
    ? (rows * safeUnitHeightCm! + Math.max(0, rows - 1) * safeSpacingCm) / 100 // Distribución total (alto*filas + espacios)
    : linearMetersPerUnit * safeQuantity + (safeQuantity > 1 ? ((safeQuantity - 1) * safeSpacingCm) / 100 : 0); // Legacy (lineal*qty + espacios)

  // Redondear al metro facturable (mínimo 1 metro).
  const billableLinearMeters = Math.max(1, Math.ceil(totalLinearMetersRaw));

  return {
    quantity: safeQuantity,
    spacingCm: safeSpacingCm,
    unitWidthCm: safeUnitWidthCm,
    unitHeightCm: safeUnitHeightCm,
    unitsPerRow,
    rows,
    linearMetersPerUnit,
    totalLinearMetersRaw,
    billableLinearMeters,
  };
}

/** Desglose de precio para mostrar al cliente/admin en CV. */
export interface PricingBreakdownItem {
  label: string; // Descripción del rango (ej: "Pequeño (5 m lineales)")
  price: number; // Precio total de este componente
}

/** Entrada para cálculo de precios (integra layout + tarifa). */
export interface PricingInput {
  orderType?: string; // Tipo de servicio (ej: "SCREENPRINTING")
  quantity?: number; // Cantidad de unidades
  linearMeters?: number; // Metros por unidad (legacy)
  spacingCm?: number; // Separación entre unidades
  unitWidthCm?: number; // Ancho de unidad
  unitHeightCm?: number; // Alto de unidad
  selectedProductPrice?: number; // Precio override si aplica
  selectedProductLabel?: string; // Etiqueta del producto
  pricingConfig?: PricingConfig; // Configuración de rangos de precio
}

/** Resultado final de cálculo de precios y distribución. Usado en resumen y payload. */
export interface PricingResult {
  unitPrice: number; // Precio por metro lineal según rango
  quantity: number; // Cantidad normalizada
  linearMetersPerUnit: number; // Metros por unidad (sin multiply)
  rows: number; // Filas en distribución
  unitsPerRow: number; // Unidades por fila
  totalLinearMetersRaw: number; // Total metros sin redondeo
  totalLinearMeters: number; // Metros facturables (redondeados)
  totalPrice: number; // Precio final (unitPrice * totalLinearMeters)
  breakdown: PricingBreakdownItem[]; // Desglose para mostrar
}

/**
 * Integra distribución de unidades + tarifa de precios para calcular precio final.
 *
 * Flujo:
 * 1. Calcula distribución (layout metrics) a partir de cantidad, dimensiones y spacing.
 * 2. Busca el rango de precio activo según metros facturables.
 * 3. Si es "SCREENPRINTING": calcula unitPrice (€/metro) y price total.
 * 4. Construye breakdown para mostrar al cliente.
 *
 * Ejemplo: 10 unidades × 15 cm = 1.5 m/unidad. Con spacing → ~1.8 m → redondea a 2 m facturable.
 *          Si rango es €3.5/metro → totalPrice = 2 * 3.5 = €7.
 */
export function calculateOrderPricing({
  orderType,
  quantity,
  linearMeters,
  spacingCm,
  unitWidthCm,
  unitHeightCm,
  pricingConfig = DEFAULT_PRICING_CONFIG,
}: PricingInput): PricingResult {
  let unitPrice = 0;
  const breakdown: PricingBreakdownItem[] = [];

  // Calcular distribución de unidades y metros facturables.
  const layout = calculateLayoutMetrics({
    quantity,
    linearMeters,
    spacingCm,
    unitWidthCm,
    unitHeightCm,
  });
  const billableLinearMeters = layout.billableLinearMeters;

  // Buscar rango de precio según metros facturables (ej: "Pequeño", "Mediano", "Grande").
  const activeRange = getRangeForLinearMeters(billableLinearMeters, pricingConfig);

  // Calcular precio según tipo de servicio (hoy solo SCREENPRINTING).
  const isOnlyScreenPrinting = orderType === "SCREENPRINTING" || !orderType;
  if (isOnlyScreenPrinting) {
    unitPrice = activeRange?.pricePerLinearMeter || 0;
    breakdown.push({
      label: activeRange
        ? `${activeRange.label} (${billableLinearMeters} m lineales)`
        : `Metros lineales fuera de rango (${billableLinearMeters} m)`,
      price: unitPrice * billableLinearMeters,
    });
  }

  return {
    unitPrice,
    quantity: layout.quantity,
    linearMetersPerUnit: layout.linearMetersPerUnit,
    rows: layout.rows,
    unitsPerRow: layout.unitsPerRow,
    totalLinearMetersRaw: layout.totalLinearMetersRaw,
    totalLinearMeters: billableLinearMeters,
    totalPrice: unitPrice * billableLinearMeters,
    breakdown,
  };
}

