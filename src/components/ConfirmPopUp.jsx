import React from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import ButtonPrimary from "./ButtonPrimary";

export default function ConfirmPopup({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onCancel) {
      onCancel();
    }
  };

  const isString = typeof confirmText === "string";

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/40 backdrop-blur-sm px-4
      "
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="
          relative w-full max-w-md rounded-3xl border border-(--color-border) 
          bg-(--color-surface) shadow-[0_18px_60px_rgba(15,23,42,0.55)]
          px-6 py-5 md:px-7 md:py-6 overflow-hidden
          transition-transform duration-200 ease-out
        "
      >
        {/* Barra superior de acento */}
        <div
          className="
            pointer-events-none absolute left-6 right-6 top-0 h-1.5
            -translate-y-1/2 rounded-full
            bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400
          "
        />

        {/* Botón de cierre */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="
              absolute right-4 top-4 inline-flex h-7 w-7 items-center justify-center
              rounded-full text-(--color-muted) hover:text-indigo-700
              hover:bg-indigo-50 transition-colors text-xs
            "
            aria-label="Cerrar"
          >
            ✕
          </button>
        )}

        <div className="flex gap-4">
          {/* Icono principal */}
          <div className="mt-1 hidden sm:flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm">
            <FaRegQuestionCircle className="text-xl" />
          </div>

          <div className="flex-1">
            {/* Título */}
            <h2
              id="confirm-dialog-title"
              className="text-base md:text-lg font-semibold text-(--color-text) mb-2"
            >
              {title}
            </h2>

            {/* Mensaje */}
            <p className="text-sm text-(--color-text) mb-5 leading-relaxed">
              {message}
            </p>

            {/* BOTONES */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4">
              {/* Botón cancelar */}
              <ButtonPrimary
                onClick={onCancel}
                className="
                  border border-(--color-border) bg-(--color-surface)
                  text-(--color-text)
                  hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700
                  text-sm px-4 py-2 rounded-xl transition-colors
                "
              >
                {cancelText}
              </ButtonPrimary>

              {/* Botón confirmar */}
              {isString ? (
                // Caso 1: texto normal
                <ButtonPrimary
                  onClick={onConfirm}
                  className="
                    bg-gradient-to-r from-indigo-500 to-blue-500
                    text-white
                    hover:from-indigo-600 hover:to-blue-600
                    text-sm px-4 py-2 rounded-xl shadow-md
                    transition-colors
                  "
                >
                  {confirmText}
                </ButtonPrimary>
              ) : (
                // Caso 2: confirmText es un <Link> u otro elemento
                <div className="w-full sm:w-auto">
                  {React.cloneElement(confirmText, {
                    className: `
                      block text-center
                      bg-gradient-to-r from-indigo-500 to-blue-500
                      text-white
                      hover:from-indigo-600 hover:to-blue-600
                      text-sm px-4 py-2 rounded-xl shadow-md w-full
                      transition-colors
                    `,
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
