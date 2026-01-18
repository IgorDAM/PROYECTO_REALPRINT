
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import Login from "./pages/Login";
import Configuracion from "./pages/Configuracion";

// Páginas de administrador
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPedidos from "./pages/admin/AdminPedidos";
import AdminHistorial from "./pages/admin/AdminHistorial";
import AdminInventario from "./pages/admin/AdminInventario";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminReportes from "./pages/admin/AdminReportes";
import AdminProductosFinales from "./pages/admin/AdminProductosFinales";

// Páginas de cliente
import ClienteDashboard from "./pages/cliente/ClienteDashboard";
import ClienteNuevoPedido from "./pages/cliente/ClienteNuevoPedido";
import ClienteHistorial from "./pages/cliente/ClienteHistorial";
import React, { Suspense, lazy } from "react";
const ClienteEditarPedido = lazy(() => import("./pages/cliente/ClienteEditarPedido"));

// Páginas de operario
import OperarioDashboard from "./pages/operario/OperarioDashboard";
import OperarioTareas from "./pages/operario/OperarioTareas";
import OperarioPedidos from "./pages/operario/OperarioPedidos";


/**
 * Componente principal de la aplicación.
 * Gestiona rutas y proveedores de contexto global.
 */
export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AuthProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Rutas de administrador */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="pedidos" element={<AdminPedidos />} />
              <Route path="historial" element={<AdminHistorial />} />
              <Route path="inventario" element={<AdminInventario />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="productos-finales" element={<AdminProductosFinales />} />
              <Route path="reportes" element={<AdminReportes />} />
              <Route path="configuracion" element={<Configuracion />} />
            </Route>

            {/* Rutas de cliente */}
            <Route
              path="/cliente"
              element={
                <ProtectedRoute allowedRoles={["cliente"]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ClienteDashboard />} />
              <Route path="nuevo-pedido" element={<ClienteNuevoPedido />} />
              <Route path="editar-pedido/:id" element={
                <Suspense fallback={<div>Cargando...</div>}>
                  <ClienteEditarPedido />
                </Suspense>
              } />
              <Route path="historial" element={<ClienteHistorial />} />
              <Route path="configuracion" element={<Configuracion />} />
            </Route>

            {/* Rutas de operario */}
            <Route
              path="/operario"
              element={
                <ProtectedRoute allowedRoles={["operario"]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<OperarioDashboard />} />
              <Route path="tareas" element={<OperarioTareas />} />
              <Route path="pedidos" element={<OperarioPedidos />} />
              <Route path="configuracion" element={<Configuracion />} />
            </Route>

            {/* Ruta catch-all para redirección */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </DataProvider>
    </BrowserRouter>
  );
}
