// src/components/FileUpload.jsx
import React, { useState } from "react";

export default function FileUpload({ label = "Subir archivo", onChange }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex flex-col items-start gap-2">
      {/* Etiqueta */}
      <label className="text-sm font-medium text-[var(--color-text)]">
        {label}
      </label>

      {/* Botón de carga */}
      <label
        className="px-4 py-2 rounded-lg cursor-pointer border border-[var(--color-border)] 
                   bg-[var(--color-surface)] text-[var(--color-text)] transition"
        style={{
          backgroundColor: hovered
            ? "var(--color-hover-strong)" // oscurece más
            : "var(--color-surface)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        📂 Seleccionar archivo
        <input
          type="file"
          className="hidden"
          onChange={onChange}
        />
      </label>
    </div>
  );
}
