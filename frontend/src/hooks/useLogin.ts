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
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getReadableErrorMessage } from "../utils/errorHandler";
import { validateLoginForm } from "../utils/validators";

interface UseLoginResult {
  username: string;
  password: string;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  error: string;
  loading: boolean;
}

export function useLogin(): UseLoginResult {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    // Validacion temprana para evitar llamadas innecesarias a authService.
    const validation = validateLoginForm({ username, password });
    if (!validation.isValid) {
      const errors = validation.errors as Record<string, string>;
      setError(errors.username || errors.password || "Formulario inválido");
      return;
    }

    setLoading(true);

    try {
      const result = await login(username.trim(), password);
      if (result.success) {
        // Solo se soportan dashboards de admin y cliente.
        const redirectPath = result.user.role === "admin"
          ? "/admin"
          : result.user.role === "cliente"
            ? "/cliente"
            : "/login";
        navigate(redirectPath);
      } else {
        const errorMessage = "error" in result ? result.error : "No se ha podido iniciar sesion";
        setError(getReadableErrorMessage(errorMessage));
      }
    } catch (err) {
      setError(getReadableErrorMessage(err, "No se ha podido iniciar sesion"));
    } finally {
      // Se ejecuta siempre (exito o error) para desbloquear el boton.
      setLoading(false);
    }
  }

  return { username, password, setUsername, setPassword, handleSubmit, error, loading };
}

