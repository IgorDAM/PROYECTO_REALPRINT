/**
 * Guard de rutas por autenticacion y roles.
 *
 * Flujo:
 * 1) espera hidratacion de sesion,
 * 2) si no hay login, envia a /login,
 * 3) si el rol no esta permitido, redirige a su dashboard base.
 */
import React from "react";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Componente contenedor para rutas privadas.
 *
 * Diseno:
 * - encapsula reglas de acceso en un unico punto,
 * - evita repetir validaciones de rol en cada pagina.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-600">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Conserva ruta origen para futuros flujos "volver a donde estabas".
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Fallback seguro: cada rol vuelve a su home autorizada.
    const redirectPath = `/${user.role}`;
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};
