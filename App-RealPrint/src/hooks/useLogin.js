/**
 * Hook de login para desacoplar formulario y autenticacion.
 *
 * Responsabilidades:
 * - controlar estado del formulario,
 * - validar campos minimos,
 * - ejecutar login asincrono,
 * - redirigir por rol al dashboard correspondiente.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getReadableErrorMessage } from "../utils/errorHandler";
import { validateLoginForm } from "../utils/validators";

export function useLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validacion temprana para evitar llamadas innecesarias a authService.
    const validation = validateLoginForm({ username, password });
    if (!validation.isValid) {
      setError(validation.errors.username || validation.errors.password);
      return;
    }

    setLoading(true);

    try {
      const result = await login(username.trim(), password);
      if (result.success) {
        // Regla actual: cada rol tiene su ruta base /admin, /cliente, /operario.
        const redirectPath = `/${result.user.role}`;
        navigate(redirectPath);
      } else {
        setError(getReadableErrorMessage(result.error));
      }
    } catch (error) {
      setError(getReadableErrorMessage(error, "No se ha podido iniciar sesion"));
    } finally {
      // Se ejecuta siempre (exito o error) para desbloquear el boton.
      setLoading(false);
    }
  }

  return { username, password, setUsername, setPassword, handleSubmit, error, loading };
}
