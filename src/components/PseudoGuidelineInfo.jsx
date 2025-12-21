// src/components/PseudoGuidelineInfo.jsx
import React, { useMemo } from "react";

function IconDoc({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v4h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 11h6M9 15h6M9 19h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconInfo({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 10v7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 7.25h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function PseudoGuidelineInfo({
  value = "",
  onChange = () => {},
  maxChars = 3000,
  disabled = false,
}) {
  const len = value?.length || 0;
  const remaining = Math.max(0, maxChars - len);

  const meter = useMemo(() => {
    const ratio = maxChars > 0 ? len / maxChars : 0;
    if (ratio >= 0.9) return "bg-red-200";
    if (ratio >= 0.7) return "bg-amber-200";
    return "bg-indigo-200";
  }, [len, maxChars]);

  const helper =
    len === 0
      ? "Escribe criterios, definiciones o puntajes que te gustaría que la IA considerara al hacer la pauta y corregir."
      : remaining === 0
      ? "Llegaste al máximo permitido."
      : `Te quedan ${remaining} caracteres.`;

  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-(--color-border)">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <IconDoc className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate">
              (Opcional) Pseudopauta de corrección
            </h3>
            <p className="text-xs text-(--color-muted) mt-0.5">
              Define tus ideas (hasta {maxChars} caracteres)
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Textarea card */}
        <div className="rounded-2xl border border-(--color-border) bg-(--color-background) p-3">
          <div className="flex items-center justify-between gap-3 mb-2">
            <label className="text-sm font-semibold">Texto de pseudopauta</label>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-(--color-muted)">
                {len}/{maxChars}
              </span>
            </div>
          </div>

          {/* progress meter */}
          <div className="h-2 w-full rounded-full bg-(--color-surface) border border-(--color-border) overflow-hidden">
            <div
              className={`h-full ${meter} transition-all`}
              style={{ width: `${Math.min(100, (len / maxChars) * 100)}%` }}
            />
          </div>

          <textarea
            value={value}
            onChange={(e) => onChange((e.target.value || "").slice(0, maxChars))}
            maxLength={maxChars}
            disabled={disabled}
            className="mt-3 w-full min-h-[140px] resize-y rounded-xl border border-(--color-border) bg-(--color-surface) p-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder={
              "Ejemplo:\n- Se evalua el uso de estos tres conceptos...\n- Debe definir el concepto con sus palabras...\n- Incluir 2 ejemplos...\n- Puntajes máximo por criterio: 3 puntos..."
            }
          />

          <div className="mt-2 flex items-start justify-between gap-3">
            <p className="text-xs text-(--color-muted)">{helper}</p>

            {len > 0 && (
              <button
                type="button"
                onClick={() => onChange("")}
                disabled={disabled}
                className="text-xs font-semibold text-indigo-600 hover:underline"
                title="Limpiar"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="rounded-2xl border border-(--color-border) bg-(--color-background) p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold">Tips para una buena pauta</h4>
              <p className="text-xs text-(--color-muted) mt-1">
                Esto es opcional pues la IA puede crear una pauta por su cuenta
                pero...
              </p>
            </div>

            <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
              <IconInfo className="h-5 w-5" />
            </div>
          </div>

          <ul className="mt-3 space-y-2 text-xs">
            <li className="flex gap-2">
              <span className="text-indigo-600 font-semibold">•</span>
              Especificar las definiciones y criterios puede ayudar a que obtengas
              lo que quieres.
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-600 font-semibold">•</span>
              No hay que ser extenso. Un punteo breve suele ser suficiente.
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-600 font-semibold">•</span>
              Un pequeño párrafo por criterio de evaluación a considerar suele
              bastar.
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-600 font-semibold">•</span>
              Agrega el puntaje al que se opta por responder bien la
              pregunta/criterio.
            </li>
          </ul>

          <div className="mt-4 rounded-xl bg-indigo-50 border border-indigo-100 p-3 text-xs text-indigo-700 flex gap-2">
            <span className="mt-0.5">
              <IconInfo className="h-4 w-4" />
            </span>
            <span>
              <span className="font-semibold">Nota:</span> La IA es como un
              ayudante corrector. Redacta como si otra persona utilizara tu
              pseudopauta para corregir. Evita ambigüedades.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
