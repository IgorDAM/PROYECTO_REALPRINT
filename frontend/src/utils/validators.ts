/**
 * Sistema de validación centralizado para formularios.
 *
 * Proporciona validadores reutilizables y composables
 * para garantizar integridad de datos en el frontend.
 */

// ============================================================================
// VALIDADORES PRIMITIVOS
// ============================================================================

export function isRequired(value) {
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
}

export function isEmail(value) {
  if (!isRequired(value)) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
}

export function isPhone(value) {
  if (!isRequired(value)) return false;
  // Acepta formatos: +34 666 555 444, +34666555444, 666555444
  const regex = /^(\+\d{1,3})?[- .]?\d{9}$/;
  return regex.test(value.replace(/\s/g, ''));
}

export function isMinLength(value, min) {
  if (!isRequired(value)) return false;
  return value.length >= min;
}

export function isMaxLength(value, max) {
  if (!isRequired(value)) return false;
  return value.length <= max;
}

export function isMinNumber(value, min) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= min;
}

export function isMaxNumber(value, max) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric <= max;
}

export function isURL(value) {
  if (!isRequired(value)) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function isDate(value) {
  if (!isRequired(value)) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(value)) return false;
  const date = new Date(value);
  return date instanceof Date && !isNaN(date.getTime());
}

export function isUsername(value) {
  if (!isRequired(value)) return false;
  // Username: 3-20 caracteres, solo letras, números y guiones bajos
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(value);
}

export function isStrongPassword(value) {
  if (!isRequired(value)) return false;
  // Al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número, 1 símbolo
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(value);
}

export function isInRange(value, min, max) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= min && numeric <= max;
}

export function isEnum(value, options) {
  if (!isRequired(value)) return false;
  return options.includes(value);
}

export function matchesPattern(value, pattern) {
  if (!isRequired(value)) return false;
  return new RegExp(pattern).test(value);
}

// ============================================================================
// VALIDADORES DE DOMINIO
// ============================================================================

export function isValidNombre(value) {
  return isRequired(value) && isMinLength(value, 2) && isMaxLength(value, 100);
}

export function isValidQuantity(value) {
  return isMinNumber(value, 1) && isMaxNumber(value, 999999);
}

export function isValidPrice(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0;
}

// ============================================================================
// VALIDADORES DE FORMULARIOS COMPLETOS
// ============================================================================

export function validateLoginForm({ username, password }) {
  const errors: Record<string, string> = {};

  if (!isRequired(username)) {
    errors.username = "El usuario es obligatorio";
  } else if (!isMinLength(username, 3)) {
    errors.username = "El usuario debe tener al menos 3 caracteres";
  }

  if (!isRequired(password)) {
    errors.password = "La contraseña es obligatoria";
  } else if (!isMinLength(password, 6)) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validatePedidoForm(data) {
  const errors: Record<string, string> = {};

  if (!isRequired(data.cliente)) {
    errors.cliente = "El cliente es obligatorio";
  } else if (!isMinLength(data.cliente, 3)) {
    errors.cliente = "El nombre debe tener al menos 3 caracteres";
  }

  if (!isRequired(data.cantidad)) {
    errors.cantidad = "La cantidad es obligatoria";
  } else if (!isValidQuantity(data.cantidad)) {
    errors.cantidad = "La cantidad debe ser un número entre 1 y 999999";
  }

  if (data.descripcion && !isMaxLength(data.descripcion, 500)) {
    errors.descripcion = "La descripción no puede exceder 500 caracteres";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateUsuarioForm(data) {
  const errors: Record<string, string> = {};

  if (!isRequired(data.username)) {
    errors.username = "El username es obligatorio";
  } else if (!isUsername(data.username)) {
    errors.username = "El username debe tener 3-20 caracteres (letras, números, guiones bajos)";
  }

  if (!isRequired(data.nombre)) {
    errors.nombre = "El nombre es obligatorio";
  } else if (!isMinLength(data.nombre, 3)) {
    errors.nombre = "El nombre debe tener al menos 3 caracteres";
  }

  if (!isRequired(data.role)) {
    errors.role = "El rol es obligatorio";
  } else if (!isEnum(data.role, ['admin', 'cliente'])) {
    errors.role = "El rol debe ser admin o cliente";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateInventarioForm(data) {
  const errors: Record<string, string> = {};

  if (!isRequired(data.nombre)) {
    errors.nombre = "El nombre es obligatorio";
  } else if (!isMinLength(data.nombre, 3)) {
    errors.nombre = "El nombre debe tener al menos 3 caracteres";
  }

  if (!isRequired(data.stock)) {
    errors.stock = "El stock es obligatorio";
  } else if (!isValidQuantity(data.stock)) {
    errors.stock = "El stock debe ser un número entre 1 y 999999";
  }

  if (data.usados && !isMinNumber(data.usados, 0)) {
    errors.usados = "Los usados no puede ser negativo";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================================================
// VALIDADOR GENÉRICO POR ESQUEMA
// ============================================================================

export function validateBySchema(data, schema) {
  const errors = {};

  for (const [field, rules] of Object.entries(schema)) {
    if (typeof rules === 'function') {
      const result = rules(data[field]);
      if (!result) {
        errors[field] = `${field} is invalid`;
      }
    } else if (Array.isArray(rules)) {
      for (const rule of rules) {
        const result = typeof rule === 'function' ? rule(data[field]) : false;
        if (!result) {
          errors[field] = `${field} is invalid`;
          break;
        }
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

