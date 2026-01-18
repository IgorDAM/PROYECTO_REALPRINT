/**
 * Contexto global de autenticación para la aplicación.
 * Proporciona login, logout, estado de usuario y control de sesión persistente.
 *
 * Buenas prácticas:
 * - Usa localStorage para persistencia de sesión
 * - Expone un hook useAuth para consumir el contexto
 * - Documenta cada función relevante
 */
import { createContext, useContext, useState, useEffect } from "react";
import { useData } from "./DataContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { usuarios } = useData();

  useEffect(() => {
    // Verifica si hay sesión guardada
    const savedUser = localStorage.getItem("realprint_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Inicia sesión si las credenciales son correctas
  const login = (username, password) => {
    const foundUser = usuarios.find(
      (u) => u.username === username && u.password === password && u.activo !== false
    );
    if (foundUser) {
      const userData = {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.nombre || foundUser.name,
        role: foundUser.role,
      };
      setUser(userData);
      localStorage.setItem("realprint_user", JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, error: "Credenciales incorrectas" };
  };

  // Cierra la sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem("realprint_user");
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para consumir el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
