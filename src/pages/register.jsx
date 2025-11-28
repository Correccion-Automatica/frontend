import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { getOrganizations } from '../hooks/api';

function Register() {
  const { signUp, signIn, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', firstRole: '', password: '', confirmPassword: '', organizationId: '' });

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [orgs, setOrgs] = useState([]); // [{id, name}]
  const [orgsLoading, setOrgsLoading] = useState(true);
  const [orgsError, setOrgsError] = useState('');

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setOrgsLoading(true);
        setOrgsError('');
        const res = await getOrganizations();
        console.log("RES: ", res)
        if (!res) throw new Error(`HTTP ${res.status}`);

        if (isMounted) setOrgs(res || []);
      } catch (e) {
        if (isMounted) setOrgsError('No se pudieron cargar las organizaciones.');
        console.error('Fetch organizations error:', e);
      } finally {
        if (isMounted) setOrgsLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const emailValid = useMemo(() => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(form.email), [form.email]);
  const pwdLength = useMemo(() => form.password.length > 7, [form.password]);
  const pwdMatch = useMemo(() => form.password === form.confirmPassword, [form.password, form.confirmPassword]);
  const canSubmit = useMemo(() =>
    form.fullName.trim() && emailValid && pwdMatch && !!form.firstRole && !!form.organizationId && !submitting,
    [form.fullName, emailValid, pwdMatch, form.firstRole, form.organizationId, submitting]
  );

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleRegister = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const { fullName, email, password, confirmPassword, firstRole, organizationId } = form;
      const organizationIdNumber = Number(organizationId);
      const registerResponse = await signUp(fullName, email, firstRole, password, confirmPassword, organizationIdNumber);
      console.log("register response: ", registerResponse);
      const loggedUser = await signIn(email, password);
      window.alert('¡Cuenta creada! Bienvenido a Automatic Correction');
      const rawRole = (loggedUser?.role || loggedUser?.firstRole || firstRole || '').toLowerCase();

      if (rawRole.includes('admin')) {
        navigate('/admin-dashboard');
      } else if (rawRole.includes('teacher')) {
        navigate('/teacher-profile');
      } else {
        // por defecto, estudiante
        navigate('/student-profile');
      }
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al registrar. Inténtalo nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-(--color-background) transition-colors duration-300">
        <div className='h-24' />

        <div className="mx-auto max-w-6xl px-4 md:px-10">
          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start">
            {/* Left: Title & pitch */}
            <section className="md:w-5/12">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-(--color-text)">Crea tu cuenta</h1>
              <p className="mt-3 text-(--color-muted) leading-relaxed">
                Bienvenida/o a la plataforma. Regístrate para comenzar a utilizar las herramientas de
                aprendizaje y evaluación. Si ya tienes cuenta, <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">inicia sesión aquí</a>.
              </p>

              <div className="mt-8 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-sm">
                <h2 className="font-semibold text-(--color-text)">¿Eres nueva/o?</h2>
                <p className="mt-2 text-sm text-(--color-muted)">
                  Selecciona tu rol (Profesor o Estudiante). Esto nos ayuda a personalizar tu experiencia y
                  permisos dentro del sistema.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-(--color-muted) list-disc list-inside">
                  <li>Acceso seguro con contraseña y verificación básica.</li>
                  <li>Interfaz limpia con foco en productividad.</li>
                  <li>Compatible con navegación móvil y escritorio.</li>
                </ul>
              </div>
            </section>

            {/* Right: Form card */}
            <section className="md:w-7/12 w-full">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
                <form
                  className="grid grid-cols-1 gap-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister();
                  }}
                  noValidate
                >
                  {/* Nombre completo */}
                  <div>
                    <label htmlFor="fullName" className="block font-semibold text-(--color-text)">
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={form.fullName}
                      onChange={onChange('fullName')}
                      placeholder="Nombres y Apellidos"
                      className="mt-1 w-full rounded-lg border border-(--color-border) bg-(--color-background) text-(--color-text) p-3 focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block font-semibold text-(--color-text)">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={onChange('email')}
                      placeholder="correo@ejemplo.com"
                      className="mt-1 w-full rounded-lg border border-(--color-border) bg-(--color-background) text-(--color-text) p-3 focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                      required
                      aria-invalid={!emailValid && form.email.length > 0}
                      aria-describedby={!emailValid && form.email.length > 0 ? "email-error" : undefined}
                    />
                    {!emailValid && form.email.length > 0 && (
                      <p id="email-error" className="mt-1 text-sm text-red-600">Ingresa un email válido.</p>
                    )}
                  </div>

                  {/* Rol */}
                  <div>
                    <label htmlFor="firstRole" className="block font-semibold text-black">Rol <span className="text-red-500">*</span></label>
                    <select
                      id="firstRole"
                      value={form.firstRole}
                      onChange={onChange('firstRole')}
                      className="mt-1 w-full appearance-none rounded-lg border border-slate-300 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-800"
                      required
                    >
                      <option value="" disabled>Selecciona tu rol</option>
                      <option value="TEACHER">Profesor</option>
                      <option value="STUDENT">Estudiante</option>
                    </select>
                  </div>

                  {/* Passwords */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="password" className="block font-semibold text-(--color-text)">
                        Contraseña <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1">
                        <input
                          id="password"
                          type={showPwd ? "text" : "password"}
                          value={form.password}
                          onChange={onChange('password')}
                          placeholder="••••••••"
                          className="w-full rounded-lg border border-(--color-border) bg-(--color-background) text-(--color-text) p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                          required
                          minLength={8}
                          aria-describedby="pwd-help"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwd((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                          aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          {showPwd ? "Ocultar" : "Mostrar"}
                        </button>
                      </div>
                      {!pwdLength && <p id="pwd-help" className="mt-1 text-xs text-red-600">Mínimo 8 caracteres.</p>}
                    </div>

                    <div>
                      <label htmlFor="confirm" className="block font-semibold text-(--color-text)">
                        Confirmar contraseña <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1">
                        <input
                          id="confirm"
                          type={showConfirm ? "text" : "password"}
                          value={form.confirmPassword}
                          onChange={onChange('confirmPassword')}
                          placeholder="••••••••"
                          className="w-full rounded-lg border border-(--color-border) bg-(--color-background) text-(--color-text) p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                          required
                          minLength={8}
                          aria-invalid={!pwdMatch && form.confirmPassword.length > 7}
                          aria-describedby={!pwdMatch && form.confirmPassword.length > 7 ? "confirm-error" : undefined}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                          aria-label={showConfirm ? "Ocultar confirmación" : "Mostrar confirmación"}
                        >
                          {showConfirm ? "Ocultar" : "Mostrar"}
                        </button>
                      </div>
                      {!pwdMatch && (
                        <p id="confirm-error" className="mt-1 text-sm text-red-600">Las contraseñas no coinciden.</p>
                      )}
                    </div>
                  </div>

                  {/* Organización */}
                  <div>
                    <label htmlFor="organizationId" className="block font-semibold text-black">
                      Organización <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="organizationId"
                      value={form.organizationId}
                      onChange={onChange('organizationId')}
                      className="mt-1 w-full appearance-none rounded-lg border border-slate-300 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-800"
                      required
                      disabled={orgsLoading || !!orgsError}
                    >
                      <option value="" disabled>
                        {orgsLoading ? 'Cargando organizaciones…' : 'Selecciona tu organización'}
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

                  {/* Actions */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-black px-4 py-3 font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
                    >
                      {submitting || loading ? "Creando cuenta…" : "Crear cuenta"}
                    </button>
                    <p className="mt-3 text-center text-sm text-(--color-muted)">
                      Al registrarte, aceptas nuestros <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Términos</a> y la <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Política de Privacidad</a>.
                    </p>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-16 border-t border-(--color-border)" />
        <div className="py-8 text-center text-xs text-(--color-muted)">
          © {new Date().getFullYear()}— Automatic Correction
        </div>
      </div>
    </>
  );
}

export default Register;
