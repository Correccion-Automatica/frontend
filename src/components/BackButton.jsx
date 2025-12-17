import { Link, useLocation, useNavigate } from "react-router-dom";

/**
 * BackButton robusto (sin loops):
 * - Si `to` viene definido: navega ahí SIEMPRE.
 * - Si no hay `to`:
 *   1) usa location.state.backTo (si existe)
 *   2) si no existe, usa `fallback` (si viene)
 *   3) si no hay fallback, intenta navigate(-1) pero evita caer en rutas bloqueadas
 *
 * Props:
 * - label: texto
 * - to: destino explícito (string)
 * - fallback: destino seguro (string)
 * - replace: si true, reemplaza en historial
 * - state: state adicional para Link cuando uses `to`
 * - blocklist: rutas/patrones que NO queremos al volver (por defecto pasos de flujo)
 */
export default function BackButton({
  label = "Volver",
  to = null,
  fallback = null,
  replace = true,
  state = undefined,
  blocklist = [
    "/teacher-profile/course-view/",
    "/create-question",
    "/create-guideline",
    "/answers",
  ],
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const backTo = location.state?.backTo; // 👈 el “volver lógico”

  const isBlocked = (path) => {
    if (!path) return false;
    // Bloquea pantallas de flujo típicas
    // (si quieres, puedes afinar esto, pero así ya evita loops comunes)
    return blocklist.some((b) => path.includes(b));
  };

  const handleClick = (e) => {
    // Si hay destino explícito, Link se encarga.
    if (to) return;

    e.preventDefault();

    // 1) si existe un backTo explícito, úsalo
    if (backTo && !isBlocked(backTo)) {
      navigate(backTo, { replace });
      return;
    }

    // 2) fallback estable (recomendado)
    if (fallback && !isBlocked(fallback)) {
      navigate(fallback, { replace });
      return;
    }

    // 3) último recurso: back del router
    //    si no hay historial útil, vuelve al home
    if (window.history.length <= 2) {
      navigate("/", { replace: true });
      return;
    }

    navigate(-1);
  };

  return (
    <Link
      to={to || "#"}
      state={state}
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2
        px-3 py-1.5 text-xs
        sm:px-4 sm:py-2 sm:text-sm
        rounded-lg border
        bg-[var(--color-surface)] text-[var(--color-text)]
        border-[var(--color-border)]
        hover:bg-[var(--color-hover-strong)]
        transition-colors duration-200
        whitespace-nowrap
      `}
    >
      <span className="text-base sm:text-lg">⬅️</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
