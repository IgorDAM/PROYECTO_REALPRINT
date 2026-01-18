import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Menú de navegación lateral según el rol del usuario.
 */
const menuItems = {
  admin: [
    { path: "/admin", label: "Dashboard", icon: "dashboard" },
    { path: "/admin/pedidos", label: "Pedidos", icon: "package_2" },
    { path: "/admin/historial", label: "Historial", icon: "history" },
    { path: "/admin/inventario", label: "Inventario", icon: "inventory_2" },
    { path: "/admin/productos-finales", label: "Productos Finales", icon: "checkroom" },
    { path: "/admin/usuarios", label: "Usuarios", icon: "group" },
    { path: "/admin/reportes", label: "Reportes", icon: "monitoring" },
  ],
  cliente: [
    { path: "/cliente", label: "Mis Pedidos", icon: "package_2" },
    { path: "/cliente/nuevo-pedido", label: "Nuevo Pedido", icon: "add_circle" },
    { path: "/cliente/historial", label: "Historial", icon: "history" },
  ],
  operario: [
    { path: "/operario", label: "Panel", icon: "dashboard" },
    { path: "/operario/tareas", label: "Mis Tareas", icon: "task" },
    { path: "/operario/pedidos", label: "Pedidos", icon: "package_2" },
  ],
};

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = menuItems[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavClick = () => {
    // Cerrar sidebar en móvil al hacer clic en un enlace
    if (window.innerWidth < 1024) {
      onClose?.();
    }
  };

  return (
    <aside className={`
      glass-sidebar flex flex-col w-72 min-h-screen
      fixed lg:static inset-y-0 left-0 z-50
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Header with Logo */}
      <div className="flex items-center justify-between h-20 lg:h-24 border-b border-white/10 px-4 lg:px-6">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-gold-400 to-gold-500 rounded-xl flex items-center justify-center shadow-gold">
            <span className="text-white font-bold text-lg lg:text-xl">RP</span>
          </div>
          <div>
            <h1 className="text-lg lg:text-xl font-bold text-white tracking-tight">REALPRINT</h1>
            <p className="text-xs text-blue-200">Gestión Profesional</p>
          </div>
        </div>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-white">close</span>
        </button>
      </div>

      {/* User Info */}
      <div className="px-4 lg:px-6 py-4 lg:py-5 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center text-white font-bold shadow-lg">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{user?.name}</p>
            <p className="text-blue-200 text-xs capitalize">
              {user?.role === "admin" ? "Administrador" : user?.role === "cliente" ? "Cliente" : "Operario"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 lg:px-4 py-4 lg:py-6 space-y-1 overflow-y-auto">
        <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider px-4 mb-3">Menú Principal</p>
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin" || item.path === "/cliente" || item.path === "/operario"}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "bg-white text-primary-700 font-semibold shadow-lg" 
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 lg:px-4 py-4 lg:py-5 border-t border-white/10 space-y-1">
        <NavLink
          to={`/${user?.role}/configuracion`}
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive 
                ? "bg-white text-primary-700 font-semibold" 
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <span className="material-symbols-outlined text-xl">settings</span>
          <span className="text-sm">Configuración</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-white/80 hover:bg-red-500/20 hover:text-red-200"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
