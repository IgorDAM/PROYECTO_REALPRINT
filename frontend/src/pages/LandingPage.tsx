import { Link } from "react-router-dom";
import { CheckCircle, Printer, Zap, Shield, ArrowRight, Package, Clock, TrendingUp, Users } from "lucide-react";
import { GlassCard, Badge } from "../components/ui";

/**
 * Landing page pública de RealPrint.
 * Presenta servicios, preview del dashboard y redirige a /login.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20">
                <h1 className="text-4xl sm:text-5xl font-bold text-white flex items-center gap-3">
                  <Printer className="w-10 h-10 sm:w-12 sm:h-12 text-gold-400" />
                  RealPrint
                </h1>
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Gestión Profesional de
              <span className="text-gold-400 block mt-2">Pedidos de Impresión</span>
            </h2>

            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Simplifica tu flujo de trabajo con nuestra plataforma especializada en serigrafía,
              planchado y servicios de impresión personalizada.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/login"
                className="group bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Acceder a la Plataforma
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#servicios"
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300"
              >
                Conocer Más
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section id="servicios" className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">
              Nuestros Servicios
            </h3>
            <p className="text-xl text-surface-600 max-w-2xl mx-auto">
              Soluciones completas para todas tus necesidades de impresión
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Servicio 1 */}
            <div className="glass-card p-8 text-center group">
              <div className="bg-primary-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                <Printer className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-2xl font-bold text-surface-900 mb-4">Serigrafía</h4>
              <p className="text-surface-600 leading-relaxed">
                Impresión de alta calidad en textiles y diversos materiales con acabados profesionales.
              </p>
            </div>

            {/* Servicio 2 */}
            <div className="glass-card p-8 text-center group">
              <div className="bg-gold-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gold-200 transition-colors">
                <Zap className="w-8 h-8 text-gold-600" />
              </div>
              <h4 className="text-2xl font-bold text-surface-900 mb-4">Planchado</h4>
              <p className="text-surface-600 leading-relaxed">
                Aplicación por calor de diseños personalizados con resultados duraderos y vibrantes.
              </p>
            </div>

            {/* Servicio 3 */}
            <div className="glass-card p-8 text-center group">
              <div className="bg-primary-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-2xl font-bold text-surface-900 mb-4">Personalización</h4>
              <p className="text-surface-600 leading-relaxed">
                Diseños únicos adaptados a tus necesidades con seguimiento completo del proceso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas Section */}
      <section className="relative bg-gradient-to-br from-primary-700 to-primary-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Package, label: "Pedidos Gestionados", value: "500+" },
              { icon: Clock, label: "Tiempo Ahorrado", value: "60%" },
              { icon: TrendingUp, label: "Satisfacción", value: "98%" },
              { icon: Users, label: "Clientes Activos", value: "50+" }
            ].map((stat, index) => (
              <div key={index} className="text-center text-white">
                <stat.icon className="w-10 h-10 mx-auto mb-3 text-gold-400" />
                <div className="text-3xl sm:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="relative bg-surface-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">
              Vista del Dashboard
            </h3>
            <p className="text-xl text-surface-600 max-w-2xl mx-auto">
              Interfaz intuitiva diseñada para optimizar tu flujo de trabajo
            </p>
          </div>

          {/* Dashboard Mockup - Vista Cliente */}
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="primary">Panel Cliente</Badge>
              <span className="text-surface-600 text-sm">Vista de gestión de pedidos</span>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-6 border-4 border-surface-200">
              {/* Header simulado */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-sm text-surface-500">Bienvenido,</div>
                    <div className="font-bold text-surface-900">Cliente Demo</div>
                  </div>
                </div>
                <Badge variant="success">Activo</Badge>
              </div>

              {/* Cards de pedidos simulados */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: "#001", estado: "En Proceso", color: "primary", cantidad: "50 unidades" },
                  { id: "#002", estado: "Completado", color: "success", cantidad: "100 unidades" },
                  { id: "#003", estado: "Pendiente", color: "warning", cantidad: "25 unidades" }
                ].map((pedido) => (
                  <GlassCard key={pedido.id} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs text-surface-500">Pedido</div>
                        <div className="font-bold text-surface-900">{pedido.id}</div>
                      </div>
                      <Badge variant={pedido.color as any}>{pedido.estado}</Badge>
                    </div>
                    <div className="text-sm text-surface-600 mb-2">
                      Serigrafía • {pedido.cantidad}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-surface-500">
                      <Clock className="w-4 h-4" />
                      <span>Hace 2 días</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>

          {/* Dashboard Mockup - Vista Admin */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">Panel Administrador</Badge>
              <span className="text-surface-600 text-sm">Vista de gestión completa</span>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-6 border-4 border-surface-200">
              {/* Estadísticas simuladas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Pedidos", value: "28", icon: Package, color: "bg-blue-100 text-blue-600" },
                  { label: "En Proceso", value: "12", icon: Clock, color: "bg-yellow-100 text-yellow-600" },
                  { label: "Completados", value: "14", icon: CheckCircle, color: "bg-green-100 text-green-600" },
                  { label: "Ingresos", value: "€2.4k", icon: TrendingUp, color: "bg-purple-100 text-purple-600" }
                ].map((stat, index) => (
                  <div key={index} className="bg-surface-50 rounded-xl p-4">
                    <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-surface-900">{stat.value}</div>
                    <div className="text-xs text-surface-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Tabla simulada */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface-100 text-surface-700">
                    <tr>
                      <th className="px-4 py-3 text-left rounded-tl-lg">ID</th>
                      <th className="px-4 py-3 text-left">Cliente</th>
                      <th className="px-4 py-3 text-left">Servicio</th>
                      <th className="px-4 py-3 text-left">Estado</th>
                      <th className="px-4 py-3 text-left rounded-tr-lg">Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-surface-600">
                    {[
                      { id: "#001", cliente: "Cliente A", servicio: "Serigrafía", estado: "process", total: "€120" },
                      { id: "#002", cliente: "Cliente B", servicio: "Planchado", estado: "completed", total: "€85" },
                      { id: "#003", cliente: "Cliente C", servicio: "Personalizado", estado: "pending", total: "€200" }
                    ].map((row) => (
                      <tr key={row.id} className="border-b border-surface-100 hover:bg-surface-50">
                        <td className="px-4 py-3 font-medium">{row.id}</td>
                        <td className="px-4 py-3">{row.cliente}</td>
                        <td className="px-4 py-3">{row.servicio}</td>
                        <td className="px-4 py-3">
                          <Badge variant={row.estado === "completed" ? "success" : row.estado === "process" ? "primary" : "warning"}>
                            {row.estado === "completed" ? "Completado" : row.estado === "process" ? "En Proceso" : "Pendiente"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-semibold">{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Características Section */}
      <section className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-6">
                Plataforma Completa de Gestión
              </h3>
              <p className="text-xl text-surface-600 mb-8">
                Gestiona tus pedidos de impresión de forma eficiente con nuestra plataforma especializada.
              </p>

              <ul className="space-y-4">
                {[
                  "Seguimiento en tiempo real de tus pedidos",
                  "Gestión de archivos y diseños centralizada",
                  "Historial completo de trabajos realizados",
                  "Sistema de roles (Admin/Cliente)",
                  "Dashboard intuitivo y fácil de usar",
                  "Notificaciones de estado automáticas"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-surface-700 text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="glass-container p-8">
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-8 text-white">
                  <h4 className="text-2xl font-bold mb-4">¿Listo para empezar?</h4>
                  <p className="text-white/90 mb-6 leading-relaxed">
                    Accede a tu panel de control y gestiona todos tus pedidos de impresión desde un solo lugar.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-gold-400 hover:text-white transition-all duration-300"
                  >
                    Iniciar Sesión
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-surface-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Printer className="w-8 h-8 text-gold-400" />
              <h5 className="text-2xl font-bold">RealPrint</h5>
            </div>
            <p className="text-surface-400 mb-4">
              Plataforma profesional de gestión de pedidos de impresión
            </p>
            <p className="text-surface-500 text-sm">
              © 2024 RealPrint. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}