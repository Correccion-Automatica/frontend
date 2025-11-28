import React from "react";

export default function PrimaryCalendar({ label, value, onChange, min, max, readOnly = false }) {
  return (
    <div className="flex flex-col items-start">
      {label && (
        <label className="mb-1 text-sm font-semibold text-[var(--color-text)]">
          {label}
        </label>
      )}
      <input
        type="date"
        value={value}
        onChange={(e) => !readOnly && onChange(e.target.value)} // bloquea cambios si readOnly
        min={min}
        max={max}
        disabled={readOnly} // deshabilita si es solo lectura
        className={`rounded-lg border border-[var(--color-border)] p-2 text-sm 
                   text-[var(--color-text)]
                   ${readOnly
                     ? "bg-gray-100 cursor-not-allowed opacity-70"
                     : "bg-[var(--color-surface)] hover:bg-[var(--color-hover)]"}`}
      />
    </div>
  );
}
