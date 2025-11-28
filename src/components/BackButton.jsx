import React from "react";
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
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border 
                 bg-[var(--color-surface)] text-[var(--color-text)] 
                 border-[var(--color-border)] hover:bg-[var(--color-hover-strong)] 
                 transition-colors duration-200"
    >
      <span className="text-lg">⬅️</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
