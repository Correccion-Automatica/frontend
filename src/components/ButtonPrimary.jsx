import React from "react";

export default function ButtonPrimary({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-2 rounded-xl font-semibold shadow-sm
        transition-all duration-200
        ${disabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-[var(--color-primary)] text-[var(--color-onprimary)] hover:opacity-90 active:scale-95 cursor-pointer"
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}
