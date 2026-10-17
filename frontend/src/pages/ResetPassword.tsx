import React, { useState } from "react";
import { httpClient } from "../services/httpClient";
import FloatingInput from "../components/FloatingInput";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError("El enlace no incluye un token válido. Solicita uno nuevo desde 'Recuperar contraseña'.");
      return;
    }

    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await httpClient.post("/auth/reset-password", { token, newPassword });
      setMessage("Contraseña actualizada. Ya puedes iniciar sesión con tu nueva contraseña.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err?.message || "El enlace no es válido o ha caducado. Solicita uno nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow">
        <h2 className="text-lg font-bold mb-4">Restablecer contraseña</h2>

        {message ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">{message}</div>
        ) : null}

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingInput
            id="newPassword"
            label="Nueva contraseña"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <FloatingInput
            id="confirmPassword"
            label="Confirmar contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <Link to="/login" className="text-surface-500 hover:underline text-sm">Volver al login</Link>
            <button type="submit" className="py-2 px-4 bg-primary-600 text-white rounded" disabled={loading}>
              {loading ? "Guardando..." : "Guardar contraseña"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
