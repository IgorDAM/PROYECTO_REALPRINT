import { useState } from "react";
import { getReadableErrorMessage } from "../utils/errorHandler";

interface ApiStatusResult {
  loading: boolean;
  error: string;
  runApi: <T>(action: () => Promise<T>, fallbackMessage?: string) => Promise<T | null>;
  resetApiError: () => void;
}

/**
 * Hook comun para acciones asincronas de UI.
 * Unifica estados de loading/error y reduce codigo repetido.
 */
export function useApiStatus(): ApiStatusResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runApi = async <T>(action: () => Promise<T>, fallbackMessage = "No se ha podido completar la operacion") => {
    setError("");
    setLoading(true);

    try {
      return await action();
    } catch (err) {
      setError(getReadableErrorMessage(err, fallbackMessage));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetApiError = () => setError("");

  return {
    loading,
    error,
    runApi,
    resetApiError,
  };
}


