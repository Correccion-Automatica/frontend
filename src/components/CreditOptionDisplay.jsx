import React, { useState } from "react";
import ButtonPrimary from "./ButtonPrimary";
import { useNavigate } from "react-router-dom";

export default function CreditOptionDisplay({ userName, credits }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-xs">
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer
                   text-(--color-text) px-2 py-1 select-none"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <p className="text-sm">
          {userName}, tienes{" "}
          <span className="font-bold">{credits.toLocaleString()}</span>{" "}
          créditos
        </p>

        <span
          className={`transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          ⌄
        </span>
      </div>

      {/* Expandible */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out
          ${expanded ? "max-h-[420px] opacity-100 mt-3" : "max-h-0 opacity-0"}`}
      >
        <div className="p-4 bg-(--color-surface) rounded-2xl shadow-sm border border-(--color-border) space-y-4">

          {/* CTA */}
          <ButtonPrimary
            onClick={() => navigate("/payments/purchase")}
            className="
              w-full
              bg-gradient-to-r from-indigo-500 to-blue-500
              hover:from-indigo-600 hover:to-blue-600
              text-white
              px-4 py-2 rounded-xl text-sm
              shadow-md transition-colors
            "
          >
            Obtener más créditos
          </ButtonPrimary>

          {/* Tabla moderna */}
          <div className="rounded-xl border border-(--color-border) bg-(--color-background) overflow-hidden">
            <div className="grid grid-cols-[1fr_auto] px-3 py-2 text-[11px] font-semibold text-(--color-muted) border-b border-(--color-border)">
              <div>Acción</div>
              <div className="text-right">Créditos</div>
            </div>

            <div className="divide-y divide-(--color-border) text-sm">
              <div className="grid grid-cols-[1fr_auto] px-3 py-2">
                <div>
                  <div>Crear pauta</div>
                  <div className="text-[11px] text-(--color-muted) whitespace-nowrap">
                    Generación total automática
                  </div>
                </div>
                <div className="text-right font-semibold">330</div>
              </div>

              <div className="grid grid-cols-[1fr_auto] px-3 py-2">
                <div>
                  <div>Editar pauta</div>
                  <div className="text-[11px] text-(--color-muted) whitespace-nowrap">
                    Iteración adicional sobre crear pauta
                  </div>
                </div>
                <div className="text-right font-semibold">110</div>
              </div>

              <div className="grid grid-cols-[1fr_auto] px-3 py-2">
                <div>
                  <div>Corrección automática</div>
                  <div className="text-[11px] text-(--color-muted) whitespace-nowrap">
                    Por respuesta de estudiante
                  </div>
                </div>
                <div className="text-right font-semibold">3</div>
              </div>
            </div>
          </div>

          {/* Microcopy sobrio */}
          <div className="mx-auto max-w-[220px] text-xs text-(--color-muted) text-center leading-snug opacity-90">
            "Cuando los criterios son claros, las decisiones son justas."
          </div>
        </div>
      </div>
    </div>
  );
}
