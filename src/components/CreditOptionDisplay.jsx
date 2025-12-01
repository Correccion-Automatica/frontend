import React, { useState } from "react";
import ButtonPrimary from "./ButtonPrimary";
import { useNavigate } from "react-router-dom";

const packOptions = [
  { name: "Mini Pack", credits: 500, price: "$2.900", pricePerCredit: "$5,8" },
  { name: "Medium Pack", credits: 1000, price: "$4.900", pricePerCredit: "$4,9" },
  { name: "Max Pack", credits: 1500, price: "$6.900", pricePerCredit: "$4,6" },
];

const referencePrices = [
  { item: "Creacion de pauta", value: "Desde $1.000 + $250 por iteracion extra" },
  { item: "Correccion masiva", value: "$5 por 100 correcciones (≈ $0,05 por cada una)" },
];

export default function CreditOptionDisplay({ userName, credits }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-xs text-[var(--color-text)]">
      <div
        className="flex items-center justify-between cursor-pointer px-2 py-1 select-none"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <p className="text-sm">
          {userName}, tienes <span className="font-semibold">{credits.toLocaleString()}</span> créditos restantes
        </p>
        <span className={`transform transition-transform duration-300 ${expanded ? "rotate-180" : "rotate-0"}`}>
          {expanded ? "▴" : "▾"}
        </span>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          expanded ? "max-h-[600px] opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] space-y-4">
          <ButtonPrimary onClick={() => navigate("/payments/purchase")}>Comprar más créditos</ButtonPrimary>

          <div>
            <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-2">
              Paquetes recomendados
            </p>
            <ul className="space-y-2 text-sm">
              {packOptions.map((pack) => (
                <li key={pack.name} className="flex justify-between border-b border-[var(--color-border)] pb-1">
                  <div>
                    <p className="font-medium">{pack.name}</p>
                    <p className="text-xs text-[var(--color-muted)]">{pack.credits.toLocaleString()} créditos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{pack.price}</p>
                    <p className="text-xs text-[var(--color-muted)]">{pack.pricePerCredit} CLP/credito</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-2">
              Referencias rápidas
            </p>
            <table className="w-full text-sm">
              <tbody>
                {referencePrices.map((row) => (
                  <tr key={row.item}>
                    <td className="py-2 pr-3 font-medium">{row.item}</td>
                    <td className="py-2 text-right text-[var(--color-muted)]">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl bg-white/50 dark:bg-black/30 p-3 text-xs leading-relaxed">
            Los créditos extra para docentes son independientes y se consumen dentro del mes. Puedes revisar el
            detalle de compras en el historial para entender cuánto has usado y cuánto queda disponible.
          </div>
        </div>
      </div>
    </div>
  );
}
