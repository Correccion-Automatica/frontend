import React, { useState } from "react";
import ButtonPrimary from "./ButtonPrimary";
import { useNavigate } from "react-router-dom";

export default function CreditOptionDisplay({ userName, credits }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-xs">
      {/* Header resumido */}
      <div
        className="flex items-center justify-between cursor-pointer 
                   text-[var(--color-text)] px-2 py-1 select-none"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <p className="text-sm">
          {userName}, tienes{" "}
          <span className="font-bold">{credits.toLocaleString()}</span> créditos
          restantes
        </p>
        <span
          className={`transform transition-transform duration-300 ${
            expanded ? "rotate-180" : "rotate-0"
          }`}
        >
          ⌄
        </span>
      </div>

      {/* Contenido expandible con animación */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          expanded ? "max-h-[500px] opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] space-y-4">
          {/* Botón comprar créditos */}
          <ButtonPrimary
            onClick={() => navigate("/payments/purchase")}
            className="
              bg-gradient-to-r from-indigo-500 to-blue-500
              text-white
              hover:from-indigo-600 hover:to-blue-600
              px-4 py-2 rounded-xl text-sm shadow-md
              transition-colors
            "
          >
            Comprar más créditos
          </ButtonPrimary>

          {/* Tabla de precios */}
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="pb-2 font-semibold text-[var(--color-muted)]">
                  Ítem
                </th>
                <th className="pb-2 font-semibold text-[var(--color-muted)]">
                  Precio
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">Creación pauta</td>
                <td className="py-2">
                  Desde $1.000 + $250 por iteración extra
                </td>
              </tr>
              <tr>
                <td className="py-2">Corrección</td>
                <td className="py-2">$5 por 100 correcciones</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
