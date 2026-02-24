import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const roles = [
  { title: "estudiante", desc: "ver cursos, responder preguntas y recibir retroalimentación.", pill: "bg-[#e43aff]" },
  { title: "profesor", desc: "gestionar cursos, crear preguntas y revisar respuestas.", pill: "bg-[#6b8bff]" },
  { title: "administrador", desc: "gestión de profesores y estadísticas.", pill: "bg-white text-[#0f172a]" },
];

export default function Login() {
  const { signIn, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      if (location.state?.email) setEmail(location.state.email);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const user = await signIn(email, password);
      if (!user) throw new Error("No se pudo obtener el usuario");

      const role = (user.role || user.firstRole || "").toLowerCase();
      if (role.includes("student")) navigate("/student-profile");
      else if (role.includes("teacher")) navigate("/teacher-profile");
      else if (role.includes("admin")) navigate("/admin-dashboard");
      else if (role.includes("aux-teacher")) navigate("/teacher-profile");
      else navigate("/");
    } catch (err) {
      console.error("Error de login:", err);
      let message = "Error al iniciar sesión. Intenta nuevamente.";

      const status = err?.response?.status;
      if (status === 401) message = "Correo o contraseña incorrectos. Por favor, verifica tus datos.";
      else if (status === 403) message = "Tu cuenta no tiene permisos para acceder. Contacta al administrador.";
      else if (status === 404) message = "No se encontró el usuario. Verifica el correo ingresado.";
      else if (status >= 500) message = "Error del servidor. Intenta nuevamente en unos minutos.";
      else if (err?.code === "auth/invalid-email") message = "El formato del correo electrónico no es válido.";
      else if (err?.code === "auth/wrong-password") message = "La contraseña es incorrecta.";
      else if (err?.code === "auth/user-not-found") message = "No existe una cuenta con este correo electrónico.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const busy = loading || submitting;

  return (
    <div
      className="min-h-screen w-full bg-[#f6f7fb] flex items-center justify-center px-4 py-10"
      style={{ fontFamily: "Inter, Arial, sans-serif" }}
    >
      <div className="w-full max-w-[1400px] min-h-[90vh] grid grid-cols-1 lg:grid-cols-2 rounded-[32px] overflow-hidden shadow-[0_30px_90px_rgba(15,23,42,0.18)] bg-white">
        {/* Panel izquierdo */}
        <div
          className="relative w-full h-full px-6 lg:px-12 py-12 text-white flex items-center"
          style={{
            background: "linear-gradient(135deg, #1a0b2a 0%, #28134d 45%, #1f4a8b 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-90 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08), transparent 35%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.06), transparent 40%)",
            }}
          />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-[900px] h-[900px] rounded-full border border-white/6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute w-[760px] h-[760px] rounded-full border border-white/8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute w-[620px] h-[620px] rounded-full border border-white/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute w-[480px] h-[480px] rounded-full border border-white/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute w-[1080px] h-[1080px] rounded-full border border-white/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>

          <div className="relative z-10 w-full max-w-[620px] mx-auto text-left space-y-6">
            <div className="space-y-3">
              <h1 className="text-[34px] lg:text-[40px] font-bold leading-tight">Nos alegra verte de nuevo!</h1>
              <p className="text-white/85 text-sm lg:text-base max-w-xl leading-relaxed">
                Accede a tu cuenta para continuar con tu aprendizaje y evaluaciones personalizadas.
              </p>
            </div>

            <div className="space-y-2">
              {roles.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/10 backdrop-blur-md px-4 py-2.5"
                >
                  <span className={`px-3 py-1 rounded-md text-xs font-semibold text-purple ${item.pill}`}>
                    {item.title}
                  </span>
                  <p className="text-white/80 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="w-full h-full flex items-center justify-center px-6 sm:px-8 lg:px-12 py-10 bg-white">
          <div className="w-full max-w-2xl space-y-6">
            {successMessage && (
              <div className="rounded-xl bg-green-50 px-4 py-3 text-green-700 text-sm font-semibold">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-red-700 text-sm font-semibold">
                {error}
              </div>
            )}

            <p className="text-sm font-semibold text-[#0f172a]">Ingresa tus credenciales para continuar</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-semibold text-[#0f172a]">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 rounded-xl border border-[#d1d5db] bg-white text-[#0f172a] px-4 focus:outline-none focus:ring-2 focus:ring-[#2E8FE6]"
                  placeholder="tu@email.com"
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-semibold text-[#0f172a]">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-12 rounded-xl border border-[#d1d5db] bg-white text-[#0f172a] px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#2E8FE6]"
                    placeholder="********"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-sm text-[#64748b] hover:text-[#0f172a]"
                  >
                    {showPwd ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-[#64748b]">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-[#cbd5e1] text-[#2E8FE6] focus:ring-[#2E8FE6]"
                    disabled
                  />
                  Recordar sesión
                </label>
                <Link to="#" className="text-[#2563eb] font-semibold hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full h-12 rounded-xl bg-[#0f172a] text-white font-semibold hover:bg-[#111827] transition disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(15,23,42,0.25)]"
              >
                {busy ? "Ingresando..." : "Iniciar sesión"}
              </button>

              <div className="text-center text-sm text-[#0f172a]">
                ¿No tienes cuenta?{" "}
                <Link to="/register" className="text-[#2563eb] font-semibold hover:underline">
                  Regístrate aquí
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
