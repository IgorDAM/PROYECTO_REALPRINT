import FloatingInput from "./FloatingInput";
import { useLogin } from "../hooks/useLogin";

export default function LoginForm() {
  const { username, password, setUsername, setPassword, handleSubmit, error, loading } = useLogin();

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">error</span>
          {error}
        </div>
      )}

      {/* Campo usuario */}
      <FloatingInput
        id="username"
        label="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Campo contraseña */}
      <FloatingInput
        id="password"
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Recordarme y link */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center cursor-pointer text-surface-600">
          <input type="checkbox" className="mr-2 w-4 h-4 accent-primary-600 rounded" />
          Recordarme
        </label>
        <a className="text-primary-600 hover:text-primary-700 font-medium hover:underline" href="#">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      {/* Botón de login */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 hover:-translate-y-0.5 shadow-blue hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Iniciando sesión...
          </span>
        ) : "Iniciar sesión"}
      </button>

      {/* Usuarios de prueba */}
      <div className="text-center text-xs mt-6 p-4 bg-surface-50 rounded-xl border border-surface-200">
        <p className="text-surface-500 mb-2">Usuarios de prueba:</p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-2 py-1 bg-white rounded-lg border border-surface-200 text-surface-700"><strong>admin</strong> / admin123</span>
          <span className="px-2 py-1 bg-white rounded-lg border border-surface-200 text-surface-700"><strong>cliente</strong> / cliente123</span>
          <span className="px-2 py-1 bg-white rounded-lg border border-surface-200 text-surface-700"><strong>operario_demo_serigrafia</strong> / operario123</span>
          <span className="px-2 py-1 bg-white rounded-lg border border-surface-200 text-surface-700"><strong>operario_demo_rotulacion</strong> / operario123</span>
        </div>
      </div>
    </form>
  );
}
