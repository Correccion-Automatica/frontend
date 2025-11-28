import React from "react";
import { FaPenFancy } from "react-icons/fa";

export default function TextAreaInput({
  placeholder,
  value,
  onChange,
  readOnly = false,
  label,
  height = "min-h-[140px]", // altura configurable
}) {
  return (
    <div className="w-full space-y-2">
      {/* Label estilizado */}
      {label && (
        <label className="
          flex items-center gap-2 text-lg font-semibold tracking-wide
          text-(--color-text) 
        ">
          <FaPenFancy className="text-blue-600 text-xs opacity-80" />
          <span>{label}</span>
        </label>
      )}

      {/* Caja contenedora con estilo premium */}
      <div
        className={`rounded-2xl border border-(--color-border) shadow-sm transition-all
        ${readOnly ? "bg-gray-100/60" : "bg-(--color-background)"}
        hover:shadow-md focus-within:shadow-lg
        focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-300/40
        `}
      >
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => !readOnly && onChange(e.target.value)}
          disabled={readOnly}
          className={`
            w-full ${height} px-4 py-3 rounded-2xl resize-y
            text-(--color-text) text-sm outline-none placeholder:text-(--color-muted)
            transition-all
            ${readOnly ? "cursor-not-allowed opacity-70" : ""}
            bg-transparent
          `}
        />
      </div>
    </div>
  );
}
