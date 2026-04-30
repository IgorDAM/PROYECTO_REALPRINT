/**
 * Página de login principal.
 * Muestra el formulario de acceso y el logo.
 */
import LoginForm from "../components/LoginForm";
import Logo from "../components/Logo";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden p-4">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-gold-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-primary-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="bg-white w-full max-w-md p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <Logo />
          <p className="text-surface-500 mt-2 text-sm sm:text-base">Inicie sesión en su cuenta</p>
        </div>

        <LoginForm />

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-surface-200 text-center">
          <p className="text-xs sm:text-sm text-surface-500">
            © 2024 RealPrint. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
