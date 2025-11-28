import React from "react";
import BackButton from "./BackButton";

export default function PageHeader({ columns = [] }) {
  return (
    <div className="relative flex items-center p-4 rounded-md bg-[var(--color-border)]">
      {/* Botón volver a la izquierda */}
      <div className="absolute left-4">
        <BackButton label="Volver" />
      </div>

      {/* Columnas centradas */}
      <div className="flex-1 flex justify-center gap-8">
        {columns.map((col, index) => (
          <div
            key={index}
            className="text-lg font-bold text-[var(--color-text)] text-center"
          >
            {col}
          </div>
        ))}
      </div>
    </div>
  );
}
