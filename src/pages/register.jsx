import React, { useMemo, useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { getOrganizations } from "../hooks/api";

function Register() {
  const { signUp, signIn, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    firstRole: "",
    password: "",
    confirmPassword: "",
    organizationId: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orgs, setOrgs] = useState([]);
  const [orgsLoading, setOrgsLoading] = useState(true);
  const [orgsError, setOrgsError] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setOrgsLoading(true);
        setOrgsError("");
        const res = await getOrganizations();
        if (!res) throw new Error(`HTTP ${res?.status}`);
        if (isMounted) setOrgs(res || []);
      } catch (e) {
        if (isMounted) setOrgsError("No se pudieron cargar las organizaciones.");
        console.error("Fetch organizations error:", e);
      } finally {
        if (isMounted) setOrgsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const emailValid = useMemo(() => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(form.email), [form.email]);
  const pwdLength = useMemo(() => form.password.length > 7, [form.password]);
  const pwdMatch = useMemo(() => form.password === form.confirmPassword, [form.password, form.confirmPassword]);
  const canSubmit = useMemo(
    () => form.fullName.trim() && emailValid && pwdMatch && !!form.firstRole && !!form.organizationId && !submitting,
    [form.fullName, emailValid, pwdMatch, form.firstRole, form.organizationId, submitting],
  );

  const onChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleRegister = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const { fullName, email, password, confirmPassword, firstRole, organizationId } = form;
      const organizationIdNumber = Number(organizationId);
      await signUp(fullName, email, firstRole, password, confirmPassword, organizationIdNumber);
      const loggedUser = await signIn(email, password);
      window.alert("Cuenta creada! Bienvenido a Automatic Correction");
      const rawRole = (loggedUser?.role || loggedUser?.firstRole || firstRole || "").toLowerCase();
      if (rawRole.includes("admin")) navigate("/admin-dashboard");
      else if (rawRole.includes("teacher")) navigate("/teacher-profile");
      else navigate("/student-profile");
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al registrar. Inténtalo nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-[#f6f7fb] flex items-center justify-center px-4 py-10"
      style={{ fontFamily: "Inter, Arial, sans-serif" }}
    >
      <div className="w-full max-w-[1400px] min-h-[90vh] grid grid-cols-1 lg:grid-cols-2 rounded-[32px] overflow-hidden shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
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
            <h1 className="text-4xl lg:text-[44px] font-bold leading-tight">Crea tu cuenta</h1>
            <p className="text-white/90 text-base lg:text-lg max-w-2xl leading-relaxed">
              Regístrate para acceder a las herramientas de aprendizaje, evaluación y gestión de cursos.
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

        {/* Panel derecho: formulario */}
        <div className="w-full h-full bg-white px-6 sm:px-10 lg:px-14 py-14 flex items-center justify-center">
          <div className="w-full max-w-xl">
            <div className="mb-6 text-left text-sm text-[#6b7280]">
              <p>Completa tus datos para comenzar</p>
            </div>

            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleRegister();
              }}
              noValidate
            >
              <div>
                <label htmlFor="fullName" className="block font-semibold text-[#0f172a]">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={onChange("fullName")}
                  placeholder="Nombres y Apellidos"
                  className="mt-1 w-full h-12 rounded-xl border border-[#d1d5db] bg-white text-[#0f172a] px-4 focus:outline-none focus:ring-2 focus:ring-[#2E8FE6]"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-semibold text-[#0f172a]">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                  placeholder="correo@ejemplo.com"
                  className="mt-1 w-full h-12 rounded-xl border border-[#d1d5db] bg-white text-[#0f172a] px-4 focus:outline-none focus:ring-2 focus:ring-[#2E8FE6]"
                  required
                  aria-invalid={!emailValid && form.email.length > 0}
                  aria-describedby={!emailValid && form.email.length > 0 ? "email-error" : undefined}
                />
                {!emailValid && form.email.length > 0 && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">
                    Ingresa un email válido.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="firstRole" className="block font-semibold text-[#0f172a]">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  id="firstRole"
                  value={form.firstRole}
                  onChange={onChange("firstRole")}
                  className="mt-1 w-full h-12 rounded-xl border border-[#d1d5db] bg-white px-4 focus:outline-none focus:ring-2 focus:ring-[#2E8FE6]"
                  required
                >
                  <option value="" disabled>
                    Selecciona tu rol
                  </option>
                  <option value="TEACHER">Profesor</option>
                  <option value="STUDENT">Estudiante</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="password" className="block font-semibold text-[#0f172a]">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="password"
                      type={showPwd ? "text" : "password"}
                      value={form.password}
                      onChange={onChange("password")}
                      placeholder="••••••••"
                      className="w-full h-12 rounded-xl border border-[#d1d5db] bg-white text-[#0f172a] px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#2E8FE6]"
                      required
                      minLength={8}
                      aria-describedby="pwd-help"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#111827] text-sm"
                      aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPwd ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                  {!pwdLength && (
                    <p id="pwd-help" className="mt-1 text-xs text-red-600">
                      Mínimo 8 caracteres.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirm" className="block font-semibold text-[#0f172a]">
                    Confirmar contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={onChange("confirmPassword")}
                      placeholder="••••••••"
                      className="w-full h-12 rounded-xl border border-[#d1d5db] bg-white text-[#0f172a] px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#2E8FE6]"
                      required
                      minLength={8}
                      aria-invalid={!pwdMatch && form.confirmPassword.length > 7}
                      aria-describedby={!pwdMatch && form.confirmPassword.length > 7 ? "confirm-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#111827] text-sm"
                      aria-label={showConfirm ? "Ocultar confirmación" : "Mostrar confirmación"}
                    >
                      {showConfirm ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                  {!pwdMatch && (
                    <p id="confirm-error" className="mt-1 text-sm text-red-600">
                      Las contraseñas no coinciden.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="organizationId" className="block font-semibold text-[#0f172a]">
                  Organización <span className="text-red-500">*</span>
                </label>
                <select
                  id="organizationId"
                  value={form.organizationId}
                  onChange={onChange("organizationId")}
                  className="mt-1 w-full h-12 rounded-xl border border-[#d1d5db] bg-white px-4 focus:outline-none focus:ring-2 focus:ring-[#2E8FE6]"
                  required
                  disabled={orgsLoading || !!orgsError}
                >
                  <option value="" disabled>
                    {orgsLoading ? "Cargando organizaciones…" : "Selecciona tu organización"}
                  </option>
                  {orgs.map((o) => (
                    <option key={o.id} value={String(o.id)}>
                      {o.name ?? o.nombre ?? `Org #${o.id}`}
                    </option>
                  ))}
                </select>
                {orgsError && (
                  <p className="mt-1 text-sm text-red-600">
                    {orgsError} Intenta recargar la página.
                  </p>
                )}
              </div>

              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-[#0b1a33] text-white font-semibold shadow-[0_14px_32px_rgba(11,26,51,0.25)] hover:brightness-110 transition disabled:opacity-60"
                  disabled={submitting || loading}
                >
                  {submitting || loading ? "Creando cuenta…" : "Crear cuenta"}
                </button>
                <p className="text-center text-sm text-[#6b7280]">
                  ¿Ya tienes cuenta?{" "}
                  <a href="/login" className="text-[#2563eb] font-semibold hover:underline">
                    Inicia sesión aquí
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
