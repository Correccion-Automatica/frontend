import React, { useEffect, useRef } from "react";
import { FaPenFancy } from "react-icons/fa";

export default function TextAreaInput({
  placeholder,
  value,
  onChange,
  readOnly = false,
  label,
  height = "min-h-[140px]", // altura configurable
  singleLine = false, // si true: muestra inicialmente una línea y auto-ajusta altura
}) {
  const taRef = useRef(null);

  useEffect(() => {
    if (singleLine && taRef.current) {
      taRef.current.style.height = "auto";
      taRef.current.style.height = `${taRef.current.scrollHeight}px`;
    }
  }, [value, singleLine]);

  const handleInput = (e) => {
    if (singleLine) {
      const el = e.target;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <label
          className="
          flex items-center gap-2 text-lg font-semibold tracking-wide
          text-(--color-text) 
        "
        >
          <FaPenFancy className="text-blue-600 text-xs opacity-80" />
          <span>{label}</span>
        </label>
      )}

      <div
        className={`rounded-2xl border border-(--color-border) shadow-sm transition-all
        ${readOnly ? "bg-gray-100/60" : "bg-(--color-background)"}
        hover:shadow-md focus-within:shadow-lg
        focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-300/40
        `}
      >
        <textarea
          ref={taRef}
          rows={singleLine ? 1 : undefined}
          placeholder={placeholder}
          value={value}
          onChange={(e) => !readOnly && onChange(e.target.value)}
          onInput={handleInput}
          disabled={readOnly}
          className={`
            w-full ${singleLine ? "h-auto" : height} px-4 ${singleLine ? "py-2 sm:py-3" : "py-3"} rounded-2xl ${singleLine ? "resize-none overflow-hidden leading-tight" : "resize-y"}
            text-(--color-text) text-sm outline-none placeholder:text-(--color-muted) placeholder:text-sm sm:placeholder:text-base
            transition-all
            ${readOnly ? "cursor-not-allowed opacity-70" : ""}
            bg-transparent
          `}
          style={singleLine ? { overflow: "hidden" } : undefined}
        />
      </div>
    </div>
  );
}