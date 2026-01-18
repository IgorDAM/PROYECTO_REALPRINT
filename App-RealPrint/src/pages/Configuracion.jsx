/**
 * Página de configuración de usuario.
 * Permite editar perfil, notificaciones y cerrar sesión.
 */
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { GlassCard, Button, Input } from "../components/ui";

export default function Configuracion() {
  const { user, logout } = useAuth();
  const [perfil, setPerfil] = useState({
    nombre: user?.name || "",
    email: "",
    passwordActual: "",
    passwordNueva: "",
    passwordConfirmar: "",
  });
  const [mensaje, setMensaje] = useState("");

  // Maneja cambios en los campos del perfil
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfil((prev) => ({ ...prev, [name]: value }));
  };

  // Simula guardado de cambios de perfil
  const handleGuardar = (e) => {
    e.preventDefault();
    setMensaje("Cambios guardados correctamente");
    setTimeout(() => setMensaje(""), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">Configuración</h1>
        <p className="text-surface-500 mt-1">Administra tu cuenta y preferencias</p>
      </div>

      {mensaje && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined">check_circle</span>
          {mensaje}
        </div>
      )}

      {/* Perfil */}
      <GlassCard className="p-4 sm:p-6 mb-6" hover={false}>
        <h2 className="text-lg sm:text-xl font-bold text-surface-900 mb-4">Perfil</h2>
        <form onSubmit={handleGuardar} className="space-y-4">
          <div className="flex items-center gap-3 sm:gap-4 mb-6">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-blue flex-shrink-0">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="font-bold text-base sm:text-lg text-surface-900">{user?.name}</p>
              <p className="text-surface-500 text-sm capitalize">{user?.role}</p>
            </div>
          </div>

          <Input
            label="Nombre completo"
            name="nombre"
            value={perfil.nombre}
            onChange={handleChange}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={perfil.email}
            onChange={handleChange}
            placeholder="tu@email.com"
          />

          <div className="pt-4">
            <Button type="submit">Guardar Cambios</Button>
          </div>
        </form>
      </GlassCard>

      {/* Cambiar Contraseña */}
      <GlassCard className="p-4 sm:p-6 mb-6" hover={false}>
        <h2 className="text-lg sm:text-xl font-bold text-surface-900 mb-4">Cambiar Contraseña</h2>
        <form className="space-y-4">
          <Input
            label="Contraseña actual"
            name="passwordActual"
            type="password"
            value={perfil.passwordActual}
            onChange={handleChange}
          />
          <Input
            label="Nueva contraseña"
            name="passwordNueva"
            type="password"
            value={perfil.passwordNueva}
            onChange={handleChange}
          />
          <Input
            label="Confirmar nueva contraseña"
            name="passwordConfirmar"
            type="password"
            value={perfil.passwordConfirmar}
            onChange={handleChange}
          />
          <div className="pt-4">
            <Button type="submit" variant="secondary">Cambiar Contraseña</Button>
          </div>
        </form>
      </GlassCard>

      {/* Notificaciones */}
      <GlassCard className="p-4 sm:p-6 mb-6" hover={false}>
        <h2 className="text-lg sm:text-xl font-bold text-surface-900 mb-4">Notificaciones</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between text-surface-700">
            <span>Notificaciones por email</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary-600 rounded" />
          </label>
          <label className="flex items-center justify-between text-surface-700">
            <span>Alertas de stock bajo</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary-600 rounded" />
          </label>
          <label className="flex items-center justify-between text-surface-700">
            <span>Actualizaciones de pedidos</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary-600 rounded" />
          </label>
        </div>
      </GlassCard>

      {/* Zona de Peligro */}
      <GlassCard className="p-4 sm:p-6 border-l-4 border-l-red-500" hover={false}>
        <h2 className="text-lg sm:text-xl font-bold text-red-600 mb-4">Zona de Peligro</h2>
        <p className="text-surface-500 text-sm mb-4">
          Acciones irreversibles que afectan a tu cuenta.
        </p>
        <Button variant="danger" onClick={logout}>
          Cerrar Sesión
        </Button>
      </GlassCard>
    </div>
  );
}
