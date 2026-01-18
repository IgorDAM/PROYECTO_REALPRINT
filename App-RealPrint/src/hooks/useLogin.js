/**
 * Hook personalizado para gestionar el login de usuario.
 * Devuelve estado, setters y función de submit.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function useLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simula delay de red y realiza login
    setTimeout(() => {
      const result = login(username, password);
      if (result.success) {
        // Redirige según el rol
        const redirectPath = `/${result.user.role}`;
        navigate(redirectPath);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 500);
  }

  return { username, password, setUsername, setPassword, handleSubmit, error, loading };
}
