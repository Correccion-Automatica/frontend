import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Login() {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
    try {
      const user = await signIn(email, password);
      if (!user) throw new Error("No se pudo obtener el usuario");
      const role = (user.role || user.firstRole || "").toLowerCase();
      if (role === "student") navigate("/student-profile");
      else if (role === "teacher" || role === "aux-teacher") navigate("/teacher-profile");
      else if (role === "admin") navigate("/admin-dashboard");
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
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-[#f6f7fb] flex items-center justify-center px-4 py-10"
      style={{ fontFamily: "Inter, Arial, sans-serif" }}
    >
      <div className="w-full max-w-[1400px] min-h-[90vh] grid grid-cols-1 lg:grid-cols-2 rounded-[32px] overflow-hidden shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
        {/* Panel izquierdo 50%  */}
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
            <h1 className="text-4xl lg:text-[44px] font-bold leading-tight">Nos alegra verte denuevo!</h1>
            <p className="text-white/90 text-base lg:text-lg max-w-2xl leading-relaxed">
              Accede a tu cuenta para continuar con tu aprendizaje y evaluaciones personalizadas.
            </p>

            <div className="space-y-3">
              {[
                { title: "estudiante", desc: "ver cursos, responder preguntas y recibir retroalimentación.", pill: "bg-[#e43aff]" },
                { title: "profesor", desc: "gestionar cursos, crear preguntas y revisar respuestas.", pill: "bg-[#6b8bff]" },
                { title: "administrador", desc: "gestión de profesores y estadísticas.", pill: "bg-[#f8fafc]" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/12 backdrop-blur-[8px] px-5 py-3 mx-auto"
                >
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-md ${
                      item.title === "administrador" ? "text-[#0f172a]" : "text-white"
                    } ${item.pill}`}
                  >
                    {item.title}
                  </span>
                  <p className="text-white/90 text-sm flex-1 leading-relaxed text-left">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel derecho 50% - formulario */}
        <div className="w-full h-full bg-white px-6 sm:px-10 lg:px-14 py-14 flex items-center justify-center">
          <div className="w-full max-w-xl">
            <div className="mb-6 text-left text-sm text-[#6b7280]">
              <p>Ingresa tus credenciales para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">{successMessage}</div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-[#0f172a]">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full h-12 rounded-xl border border-[#d1d5db] bg-white px-4 text-base placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#2E8FE6] disabled:opacity-60"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-[#0f172a]">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full h-12 rounded-xl border border-[#d1d5db] bg-white px-4 pr-12 text-base placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#2E8FE6] disabled:opacity-60"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#111827] text-sm"
                    aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPwd ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-[#6b7280]">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="rounded border-[#d1d5db] text-[#2563eb] focus:ring-[#2563eb]" />
                  <span>Recordar sesión</span>
                </label>
                <a href="#" className="text-[#2563eb] hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#0b1a33] text-white font-semibold shadow-[0_14px_32px_rgba(11,26,51,0.25)] hover:brightness-110 transition disabled:opacity-60"
              >
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>

              <div className="text-center text-sm text-[#6b7280]">
                ¿No tienes cuenta?{" "}
                <a href="/register" className="text-[#2563eb] font-semibold hover:underline">
                  Regístrate aquí
                </a>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
