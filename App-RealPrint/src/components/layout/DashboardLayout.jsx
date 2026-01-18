/**
 * Layout principal del dashboard con sidebar y cabecera responsive.
 */

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import PropTypes from "prop-types";

/**
 * Layout principal del dashboard con sidebar y cabecera responsive.
 * Proporciona navegación lateral y cabecera móvil.
 *
 * Ejemplo de uso:
 * <DashboardLayout />
 */
export default function DashboardLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface-100 font-display">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar lateral */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto lg:ml-0">
        {/* Cabecera móvil */}
        <div className="sticky top-0 z-30 lg:hidden bg-white border-b border-surface-200 px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-surface-100 transition-colors"
          >
            <span className="material-symbols-outlined text-surface-700">menu</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RP</span>
            </div>
            <span className="font-bold text-surface-900">RealPrint</span>
          </div>
        </div>

        <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          {/* Pasar prop sidebarOpen solo a AdminDashboard */}
          <Outlet context={{ sidebarOpen }} />
        </div>
      </main>
    </div>
  );
}

// No recibe props, pero se deja la estructura para futuras extensiones
DashboardLayout.propTypes = {};
