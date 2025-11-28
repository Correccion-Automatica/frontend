import React from "react";
import ButtonPrimary from "./ButtonPrimary";

export default function ChatActions({ onConfirm, onEdit, cost, canEdit = true }) {
  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="flex gap-3">
        <ButtonPrimary onClick={onConfirm}>
          Sí, continuar
        </ButtonPrimary>

        <ButtonPrimary
          onClick={onEdit}
          disabled={!canEdit}
          className={`border border-[var(--color-border)] 
                     ${canEdit
                       ? "bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-hover)]"
                       : "bg-gray-100 text-gray-400 cursor-not-allowed"
                     }`}
        >
          No, editar
        </ButtonPrimary>
      </div>

      {cost && (
        <p className="text-xs text-[var(--color-muted)]">
          Recuerda que editar los criterios consume {cost} créditos extra
        </p>
      )}

      {!canEdit && (
        <p className="text-xs text-red-500 font-medium">
          No tienes créditos suficientes para editar los criterios.
        </p>
      )}
    </div>
  );
}
