/**
 * Ruta protegida por autenticación y roles.
 * Redirige según el estado de sesión y el rol del usuario.
 */
import React from "react";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Ruta protegida por autenticación y roles.
 * Redirige según el estado de sesión y el rol del usuario.
 *
 * Props:
 * - children: JSX.Element (contenido protegido)
 * - allowedRoles: array de roles permitidos
 *
 * Ejemplo de uso:
 * <ProtectedRoute allowedRoles={["admin"]}><ComponentePrivado /></ProtectedRoute>
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirige al dashboard correspondiente según el rol
    const redirectPath = `/${user.role}`;
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};
