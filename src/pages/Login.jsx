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

  // Mostrar mensaje de éxito si viene del registro
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      if (location.state?.email) {
        setEmail(location.state.email);
      }
      // Limpiar el state para que no se muestre en futuros reloads
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await signIn(email, password);
      console.log("Usuario autenticado:", user);
      if (!user) throw new Error("No se pudo obtener el usuario");

      const role = (user.role || user.firstRole || "").toLowerCase();

      switch (role) {
        case "student":
          navigate("/student-profile");
          break;
        case "teacher":
          navigate("/teacher-profile");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "aux-teacher":
          navigate("/teacher-profile");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("Error de login:", err);

      let message = "Error al iniciar sesión. Intenta nuevamente.";

      // Si el servidor responde con un código HTTP
      const status = err?.response?.status;

      if (status === 401) {
        message = "Correo o contraseña incorrectos. Por favor, verifica tus datos.";
      } else if (status === 403) {
        message = "Tu cuenta no tiene permisos para acceder. Contacta al administrador.";
      } else if (status === 404) {
        message = "No se encontró el usuario. Verifica el correo ingresado.";
      } else if (status >= 500) {
        message = "Error del servidor. Intenta nuevamente en unos minutos.";
      } else if (err?.code === "auth/invalid-email") {
        message = "El formato del correo electrónico no es válido.";
      } else if (err?.code === "auth/wrong-password") {
        message = "La contraseña es incorrecta.";
      } else if (err?.code === "auth/user-not-found") {
        message = "No existe una cuenta con este correo electrónico.";
      }
      setError(message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-(--color-background) transition-colors duration-300"
      style={{ fontFamily: "Inter, Arial, sans-serif" }}
    >
      <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-(--color-surface) rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden min-h-[500px] lg:min-h-[600px] transition-colors duration-300">
        {/* Panel izquierdo */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-8 lg:p-12 bg-(--color-elevated)">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-(--color-text) mb-4 lg:mb-6 text-center">
            Inicia sesión
          </h1>
          <p className="text-(--color-muted) text-sm sm:text-base lg:text-lg text-center mb-4 lg:mb-6 max-w-sm lg:max-w-md">
            Accede a tu cuenta para continuar con tu aprendizaje y evaluaciones personalizadas.
          </p>
          <p className="text-(--color-text) text-sm sm:text-base text-center mb-4 lg:mb-6">
            ¿No tienes cuenta?{" "}
            <a
              href="/register"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline transition-colors"
            >
              Regístrate aquí.
            </a>
          </p>
          <div className="bg-(--color-surface) rounded-xl shadow-lg p-4 sm:p-6 max-w-sm lg:max-w-md text-left w-full border border-(--color-border)">
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li className="flex items-start sm:items-center">
                <span
                  className="text-white rounded px-2 py-1 text-xs font-medium mr-2 flex-shrink-0"
                  style={{ background: "#6C63FF" }}
                >
                  estudiante
                </span>
                <span className="text-(--color-muted)">
                  ver cursos, responder preguntas y recibir retroalimentación.
                </span>
              </li>
              <li className="flex items-start sm:items-center">
                <span
                  className="text-white rounded px-2 py-1 text-xs font-medium mr-2 flex-shrink-0"
                  style={{ background: "#A259FF" }}
                >
                  profesor
                </span>
                <span className="text-(--color-muted)">
                  gestionar cursos, crear preguntas y revisar respuestas.
                </span>
              </li>
              <li className="flex items-start sm:items-center">
                <span className="bg-(--color-border) text-(--color-text) rounded px-2 py-1 text-xs font-medium mr-2 flex-shrink-0">
                  administrador
                </span>
                <span className="text-(--color-muted)">
                  gestión de profesores y estadísticas.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-8 lg:p-12 bg-(--color-surface)">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            {successMessage && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm sm:text-base font-semibold text-(--color-text) mb-2"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className={`w-full px-4 py-3 rounded-lg border border-(--color-border) bg-(--color-background) text-(--color-text) placeholder-(--color-muted) text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                placeholder="tu@email.com"
              />
            </div>

            {/* Campo contraseña con mostrar/ocultar */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm sm:text-base font-semibold text-(--color-text) mb-2"
              >
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type={showPwd ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className={`w-full px-4 py-3 rounded-lg border border-(--color-border) bg-(--color-background) text-(--color-text) placeholder-(--color-muted) text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 text-slate-500 hover:text-slate-700"
                aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPwd ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 sm:py-4 text-base sm:text-lg font-bold rounded-lg transition-all duration-200 shadow-lg hover:cursor-pointer ${
                loading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>

            <div className="text-center text-sm sm:text-base text-gray-600">
              ¿No tienes cuenta?{" "}
              <a href="/register" className="text-blue-600 font-semibold hover:underline">
                Regístrate aquí
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
