/**
 * Validaciones reutilizables para formularios.
 */
export function isRequired(value) {
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
}

export function minNumber(value, min) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= min;
}

export function validateLoginForm({ username, password }) {
  const errors = {};

  if (!isRequired(username)) {
    errors.username = "El usuario es obligatorio";
  }

  if (!isRequired(password)) {
    errors.password = "La contrasena es obligatoria";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

