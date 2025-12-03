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
        /* Tamaños responsivos */
        px-3 py-1.5 text-sm     /* → móvil */
        sm:px-4 sm:py-2 sm:text-sm
        md:px-6 md:py-2 md:text-base  /* → tablet/desktop */

        rounded-xl font-semibold shadow-sm
        transition-all duration-200 whitespace-nowrap

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
