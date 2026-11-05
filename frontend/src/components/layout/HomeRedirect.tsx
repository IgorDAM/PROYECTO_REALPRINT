import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingFallback from "../ui/LoadingFallback";

/**
 * Destino de las rutas desconocidas: con sesion lleva al panel del rol,
 * sin sesion al login (antes un usuario logueado acababa siempre en /login).
 */
export default function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingFallback />;
  if (user?.role === "admin") return <Navigate to="/admin" replace />;
  if (user?.role === "cliente") return <Navigate to="/cliente" replace />;
  return <Navigate to="/login" replace />;
}
