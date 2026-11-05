import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import HomeRedirect from "./components/layout/HomeRedirect";
import LoadingFallback from "./components/ui/LoadingFallback";
import DashboardLayout from "./components/layout/DashboardLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import { ErrorFallback } from "./components/ErrorFallback";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { CreateOrderForm } from "./components/CreateOrderForm";
import { Suspense, lazy } from "react";

// Paginas de paneles: se cargan bajo demanda para reducir el JS inicial (landing/login).
const Configuracion = lazy(() => import("./pages/Configuracion"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminPedidos = lazy(() => import("./pages/admin/AdminPedidos"));
const AdminUsuarios = lazy(() => import("./pages/admin/AdminUsuarios"));
const ClienteDashboard = lazy(() => import("./pages/cliente/ClienteDashboard"));
const ClienteHistorial = lazy(() => import("./pages/cliente/ClienteHistorial"));
const ClienteEditarPedido = lazy(() => import("./pages/cliente/ClienteEditarPedido"));

/**
 * Componente principal de la aplicacion.
 * Gestiona rutas y proveedores de contexto global.
 */
export default function App() {
  return (
    <ErrorBoundary name="App" fallback={<ErrorFallback error={null} resetErrorBoundary={() => window.location.reload()} />}>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Rutas publicas */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

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
                <Route path="editar-pedido/:id" element={<ClienteEditarPedido />} />
                <Route path="historial" element={<ClienteHistorial />} />
                <Route path="configuracion" element={<Configuracion />} />
              </Route>

              {/* Ruta catch-all: redirige segun la sesion */}
              <Route path="*" element={<HomeRedirect />} />
            </Routes>
            </Suspense>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
