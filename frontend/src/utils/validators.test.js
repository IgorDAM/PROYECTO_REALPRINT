import { describe, it, expect } from 'vitest';
import {
  isRequired,
  isEmail,
  isPhone,
  isMinLength,
  isMaxLength,
  isMinNumber,
  isMaxNumber,
  isUsername,
  isStrongPassword,
  isEnum,
  isValidNombre,
  isValidQuantity,
  validateLoginForm,
  validatePedidoForm,
  validateUsuarioForm,
  validateInventarioForm,
} from './validators.js';

describe('validators - primitivos', () => {
  it('isRequired debe validar campos obligatorios', () => {
    expect(isRequired('valor')).toBe(true);
    expect(isRequired('')).toBe(false);
    expect(isRequired(null)).toBe(false);
    expect(isRequired(undefined)).toBe(false);
    expect(isRequired('   ')).toBe(false); // solo espacios
  });

  it('isEmail debe validar emails correctos', () => {
    expect(isEmail('user@example.com')).toBe(true);
    expect(isEmail('test@test.co.uk')).toBe(true);
    expect(isEmail('invalid.email')).toBe(false);
    expect(isEmail('user@')).toBe(false);
  });

  it('isPhone debe validar teléfonos', () => {
    expect(isPhone('666555444')).toBe(true);
    expect(isPhone('+34 666 555 444')).toBe(true);
    expect(isPhone('+34666555444')).toBe(true);
    expect(isPhone('123')).toBe(false);
  });

  it('isMinLength debe validar longitud mínima', () => {
    expect(isMinLength('abc', 3)).toBe(true);
    expect(isMinLength('ab', 3)).toBe(false);
    expect(isMinLength('abcd', 3)).toBe(true);
  });

  it('isMaxLength debe validar longitud máxima', () => {
    expect(isMaxLength('abc', 3)).toBe(true);
    expect(isMaxLength('abcd', 3)).toBe(false);
    expect(isMaxLength('ab', 3)).toBe(true);
  });

  it('isMinNumber debe validar mínimo numérico', () => {
    expect(isMinNumber(10, 5)).toBe(true);
    expect(isMinNumber(5, 5)).toBe(true);
    expect(isMinNumber(3, 5)).toBe(false);
  });

  it('isMaxNumber debe validar máximo numérico', () => {
    expect(isMaxNumber(5, 10)).toBe(true);
    expect(isMaxNumber(10, 10)).toBe(true);
    expect(isMaxNumber(15, 10)).toBe(false);
  });

  it('isUsername debe validar formato de usuario', () => {
    expect(isUsername('user123')).toBe(true);
    expect(isUsername('valid_user')).toBe(true);
    expect(isUsername('ab')).toBe(false); // muy corto
    expect(isUsername('user-name')).toBe(false); // no permite guiones
  });

  it('isStrongPassword debe validar contraseñas fuertes', () => {
    expect(isStrongPassword('StrongPass123!')).toBe(true);
    expect(isStrongPassword('weak')).toBe(false);
    expect(isStrongPassword('NoNumber!')).toBe(false);
    expect(isStrongPassword('noupppercase1!')).toBe(false);
  });

  it('isEnum debe validar valores permitidos', () => {
    expect(isEnum('admin', ['admin', 'user'])).toBe(true);
    expect(isEnum('invalid', ['admin', 'user'])).toBe(false);
  });
});

describe('validators - dominio', () => {
  it('isValidNombre debe validar nombres', () => {
    expect(isValidNombre('Juan')).toBe(true);
    expect(isValidNombre('A')).toBe(false); // muy corto
    expect(isValidNombre('x'.repeat(101))).toBe(false); // muy largo
  });

  it('isValidQuantity debe validar cantidad', () => {
    expect(isValidQuantity(100)).toBe(true);
    expect(isValidQuantity(0)).toBe(false);
    expect(isValidQuantity(999999)).toBe(true);
    expect(isValidQuantity(1000000)).toBe(false);
  });
});

describe('validators - formularios', () => {
  it('validateLoginForm debe validar login', () => {
    const validLogin = { username: 'admin123', password: 'password123' };
    const result = validateLoginForm(validLogin);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('validateLoginForm debe rechazar login inválido', () => {
    const invalidLogin = { username: 'ab', password: 'short' };
    const result = validateLoginForm(invalidLogin);
    expect(result.isValid).toBe(false);
    expect(result.errors.username).toBeDefined();
    expect(result.errors.password).toBeDefined();
  });

  it('validatePedidoForm debe validar pedido completo', () => {
    const validPedido = {
      cliente: 'Juan Pérez',
      cantidad: 100,
      descripcion: 'Camisetas de prueba',
    };
    const result = validatePedidoForm(validPedido);
    expect(result.isValid).toBe(true);
  });

  it('validatePedidoForm debe rechazar cantidad inválida', () => {
    const invalidPedido = {
      cliente: 'Juan',
      cantidad: 0,
    };
    const result = validatePedidoForm(invalidPedido);
    expect(result.isValid).toBe(false);
    expect(result.errors.cantidad).toBeDefined();
  });

  it('validateUsuarioForm debe validar usuario completo', () => {
    const validUser = {
      username: 'user_demo',
      nombre: 'Usuario Demo',
      role: 'admin',
    };
    const result = validateUsuarioForm(validUser);
    expect(result.isValid).toBe(true);
  });

  it('validateUsuarioForm debe rechazar rol inválido', () => {
    const invalidUser = {
      username: 'user_demo',
      nombre: 'Usuario Demo',
      role: 'superadmin', // rol no permitido
    };
    const result = validateUsuarioForm(invalidUser);
    expect(result.isValid).toBe(false);
    expect(result.errors.role).toBeDefined();
  });

  it('validateInventarioForm debe validar inventario', () => {
    const validInventario = {
      nombre: 'Camiseta Blanca',
      stock: 100,
      usados: 10,
    };
    const result = validateInventarioForm(validInventario);
    expect(result.isValid).toBe(true);
  });

  it('validateInventarioForm debe rechazar stock negativo', () => {
    const invalidInventario = {
      nombre: 'Camiseta',
      stock: -5,
    };
    const result = validateInventarioForm(invalidInventario);
    expect(result.isValid).toBe(false);
    expect(result.errors.stock).toBeDefined();
  });
});

