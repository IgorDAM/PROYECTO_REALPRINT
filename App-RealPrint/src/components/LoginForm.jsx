import FloatingInput from "./FloatingInput";
import { useLogin } from "../hooks/useLogin";

export default function LoginForm() {
  const { username, password, setUsername, setPassword, handleSubmit } = useLogin();

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <FloatingInput
        id="username"
        label="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <FloatingInput
        id="password"
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex items-center justify-between text-white text-sm">
        <label className="flex items-center cursor-pointer">
          <input type="checkbox" className="mr-2 w-4 h-4 accent-white" />
          Recordarme
        </label>
        <a className="hover:underline" href="#">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 rounded-full text-white font-bold bg-white/30 hover:bg-white/40 hover:-translate-y-1 shadow-md hover:shadow-lg transition-all duration-700"
      >
        Iniciar sesión
      </button>

      <div className="text-center text-white text-sm mt-6">
        <p>
          ¿No tienes una cuenta?{" "}
          <a className="font-bold hover:underline" href="#">
            Regístrate
          </a>
        </p>
      </div>
    </form>
  );
}
