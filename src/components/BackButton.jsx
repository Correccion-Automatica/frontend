import { Link } from "react-router-dom";

export default function BackButton({ to = null, label = "Volver" }) {
  const handleClick = (e) => {
    // Si no se pasa un destino explícito, volver en el historial
    if (!to) {
      e.preventDefault();
      window.history.back();
    }
  };

  return (
    <Link
      to={to || "#"}
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2
        px-3 py-1.5 text-xs    /* móvil */
        sm:px-4 sm:py-2 sm:text-sm  /* tablets / desktop */
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
