import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import { ErrorFallback } from "./components/ErrorFallback";
import Login from "./pages/Login";
import Configuracion from "./pages/Configuracion";

// Paginas de administrador
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPedidos from "./pages/admin/AdminPedidos";
import AdminUsuarios from "./pages/admin/AdminUsuarios";

// Paginas de cliente
import ClienteDashboard from "./pages/cliente/ClienteDashboard";
import ClienteHistorial from "./pages/cliente/ClienteHistorial";
import { CreateOrderForm } from "./components/CreateOrderForm";
import React, { Suspense, lazy } from "react";
const ClienteEditarPedido = lazy(() => import("./pages/cliente/ClienteEditarPedido"));

/**
 * Componente principal de la aplicacion.
 * Gestiona rutas y proveedores de contexto global.
 */
export default function App() {
  return (
    <ErrorBoundary name="App" fallback={<ErrorFallback error={null} resetErrorBoundary={() => window.location.reload()} />}>
      <BrowserRouter>
        <DataProvider>
          <AuthProvider>
            <Routes>
              {/* Rutas publicas */}
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
                <Route path="historial" element={<Navigate to="/admin/pedidos?tab=completados" replace />} />
                <Route path="usuarios" element={<AdminUsuarios />} />
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
                <Route path="nuevo-pedido" element={<CreateOrderForm />} />
                <Route path="crear-pedido" element={<CreateOrderForm />} />
                <Route
                  path="editar-pedido/:id"
                  element={
                    <Suspense fallback={<div>Cargando...</div>}>
                      <ClienteEditarPedido />
                    </Suspense>
                  }
                />
                <Route path="historial" element={<ClienteHistorial />} />
                <Route path="configuracion" element={<Configuracion />} />
              </Route>

              {/* Ruta catch-all para redireccion */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AuthProvider>
        </DataProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
