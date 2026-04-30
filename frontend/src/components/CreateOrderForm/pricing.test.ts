import { describe, expect, it } from 'vitest';
import { calculateLayoutMetrics, calculateOrderPricing } from './pricing';

describe('calculateLayoutMetrics', () => {
  it('distribuye unidades por filas considerando ancho y separacion', () => {
    const result = calculateLayoutMetrics({
      quantity: 20,
      unitWidthCm: 20,
      unitHeightCm: 15,
      spacingCm: 2,
    });

    expect(result.unitsPerRow).toBe(2);
    expect(result.rows).toBe(10);
    expect(result.linearMetersPerUnit).toBeCloseTo(0.15, 5);
    expect(result.totalLinearMetersRaw).toBeCloseTo(1.68, 5);
    expect(result.billableLinearMeters).toBe(2);
  });

  it('usa modo legacy cuando faltan dimensiones y calcula separacion por unidad', () => {
    const result = calculateLayoutMetrics({
      quantity: 10,
      linearMeters: 0.25,
      spacingCm: 2,
    });

    expect(result.unitsPerRow).toBe(1);
    expect(result.rows).toBe(10);
    expect(result.linearMetersPerUnit).toBeCloseTo(0.25, 5);
    expect(result.totalLinearMetersRaw).toBeCloseTo(2.68, 5);
    expect(result.billableLinearMeters).toBe(3);
  });

  it('normaliza valores invalidos y mantiene minimo facturable de 1 metro', () => {
    const result = calculateLayoutMetrics({
      quantity: 0,
      linearMeters: -1,
      spacingCm: -5,
    });

    expect(result.quantity).toBe(1);
    expect(result.spacingCm).toBe(0);
    expect(result.linearMetersPerUnit).toBe(0);
    expect(result.totalLinearMetersRaw).toBe(0);
    expect(result.billableLinearMeters).toBe(1);
  });

  it('cuando el ancho de unidad supera 60 cm, fuerza 1 unidad por fila', () => {
    const result = calculateLayoutMetrics({
      quantity: 5,
      unitWidthCm: 70,
      unitHeightCm: 20,
      spacingCm: 2,
    });

    expect(result.unitsPerRow).toBe(1);
    expect(result.rows).toBe(5);
    expect(result.totalLinearMetersRaw).toBeCloseTo(1.08, 5);
    expect(result.billableLinearMeters).toBe(2);
  });

  it('con cantidades grandes mantiene distribucion estable y redondeo correcto', () => {
    const result = calculateLayoutMetrics({
      quantity: 123,
      unitWidthCm: 14,
      unitHeightCm: 18,
      spacingCm: 1.5,
    });

    expect(result.unitsPerRow).toBe(3);
    expect(result.rows).toBe(41);
    expect(result.totalLinearMetersRaw).toBeCloseTo(7.98, 5);
    expect(result.billableLinearMeters).toBe(8);
  });
});

describe('calculateOrderPricing', () => {
  it('propaga los metros calculados por layout al total facturable', () => {
    const result = calculateOrderPricing({
      orderType: 'SCREENPRINTING',
      quantity: 20,
      unitWidthCm: 20,
      unitHeightCm: 15,
      spacingCm: 2,
    });

    expect(result.unitsPerRow).toBe(2);
    expect(result.rows).toBe(10);
    expect(result.totalLinearMetersRaw).toBeCloseTo(1.68, 5);
    expect(result.totalLinearMeters).toBe(2);
    expect(result.totalPrice).toBeGreaterThanOrEqual(0);
  });

  it('respeta el redondeo al metro facturable en escenarios frontera', () => {
    const result = calculateOrderPricing({
      orderType: 'SCREENPRINTING',
      quantity: 7,
      unitWidthCm: 30,
      unitHeightCm: 14,
      spacingCm: 1,
    });

    expect(result.unitsPerRow).toBe(1);
    expect(result.rows).toBe(7);
    expect(result.totalLinearMetersRaw).toBeCloseTo(1.04, 5);
    expect(result.totalLinearMeters).toBe(2);
  });
});

