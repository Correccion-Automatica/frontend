import React from "react";

export default function PrimaryToggle({
  label,
  value,
  onChange,
  range,
  step = 1,
  readOnly = false, // 👈 nuevo
}) {
  return (
    <div className="flex flex-col items-start">
      <label className="mb-1 text-sm font-semibold">{label}</label>
      <select
        value={value}
        onChange={(e) => !readOnly && onChange(Number(e.target.value))} // bloquea cambios si readOnly
        disabled={readOnly} // 👈 deshabilita si es solo lectura
        className={`rounded-lg border border-[var(--color-border)] p-2 text-sm 
                   text-[var(--color-text)]
                   ${
                     readOnly
                       ? "bg-gray-100 cursor-not-allowed opacity-70"
                       : "bg-[var(--color-surface)] hover:bg-[var(--color-hover)]"
                   }`}
      >
        {Array.from({ length: Math.floor(range / step) + 1 }, (_, i) => {
          const val = i * step;
          return (
            <option key={val} value={val}>
              {val}
            </option>
          );
        })}
      </select>
    </div>
  );
}
