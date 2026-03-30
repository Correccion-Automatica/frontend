import React from "react";

export default function CreditSummaryCard({
  iterations = 0,
  maxEdits = 0,
}) {
  const iters = Math.max(0, Number(iterations || 0));
  const edits = Math.max(0, Number(maxEdits || 0));

  const note =
    iters <= 0
      ? "Necesitas recargar para crear una pauta."
      : edits <= 0
        ? "Sin ediciones: finaliza la pauta o recarga."
        : null;

  return (
    <div className="p-4 rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm">
      <div className="text-[11px] text-(--color-muted) uppercase tracking-wide">
        Tu margen de trabajo disponible
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-(--color-border) bg-(--color-background) px-3 py-3 text-center">
          <div className="text-[11px] text-(--color-muted) leading-none">
            Iteraciones completas
          </div>
          <div className="mt-2 text-3xl font-extrabold text-(--color-text) leading-none">
            {iters}
          </div>
          <div className="mt-1 text-[11px] text-(--color-muted)">
            desde cero
          </div>
        </div>

        <div className="rounded-xl border border-(--color-border) bg-(--color-background) px-3 py-3 text-center">
          <div className="text-[11px] text-(--color-muted) leading-none">
            Hasta
          </div>
          <div className="mt-2 text-3xl font-extrabold text-(--color-text) leading-none">
            {edits}
          </div>
          <div className="mt-1 text-[11px] text-(--color-muted)">
            ediciones de criterios antes de finalizar
          </div>
        </div>
      </div>

      {note && (
        <div className="mt-3 text-xs text-(--color-muted) text-center">
          {note}
        </div>
      )}
    </div>
  );
}
