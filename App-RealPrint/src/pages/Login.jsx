import LoginForm from "../components/LoginForm";
import Logo from "../components/Logo";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 bg-[length:400%_400%] animate-gradient">
      <div className="glass-container w-full max-w-md p-10 rounded-2xl">
        <div className="text-center mb-8">
          <Logo />
          <p className="text-white/80">Inicie sesión en su cuenta</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
