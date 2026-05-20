import React, { useState } from "react";
import { httpClient } from "../services/httpClient";
import FloatingInput from "../components/FloatingInput";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!identifier.trim()) {
      setError("Introduce tu correo o nombre de usuario");
      return;
    }

    setLoading(true);
    try {
      // Endpoint de backend esperado: POST /auth/forgot-password { identifier }
      await httpClient.post("/auth/forgot-password", { identifier: identifier.trim() });
      setMessage("Si existe una cuenta asociada, recibirás un correo con instrucciones.");
    } catch (err: any) {
      setError(err?.message || "No se ha podido procesar la petición");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow">
        <h2 className="text-lg font-bold mb-4">Recuperar contraseña</h2>

        {message ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">{message}</div>
        ) : null}

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingInput id="identifier" label="Correo o nombre de usuario" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />

          <div className="flex items-center justify-between">
            <Link to="/login" className="text-surface-500 hover:underline text-sm">Volver al login</Link>
            <button type="submit" className="py-2 px-4 bg-primary-600 text-white rounded" disabled={loading}>
              {loading ? "Enviando..." : "Enviar instrucciones"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

