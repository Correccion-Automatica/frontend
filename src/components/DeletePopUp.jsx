// ConfirmPopUp.jsx
import React from "react";
import ButtonPrimary from "./ButtonPrimary";

export default function ConfirmPopUp({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--color-surface)] rounded-2xl p-6 max-w-md w-full shadow-lg border border-[var(--color-border)]">
        <h2 className="text-xl font-bold mb-3 text-[var(--color-text)]">
          {title}
        </h2>

        <p className="mb-6 text-[var(--color-text)]">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-[var(--color-border)]
                       bg-[var(--color-surface)]
                       text-[var(--color-text)]
                       hover:bg-[var(--color-hover)]
                       transition-all"
          >
            {cancelText}
          </button>

          <ButtonPrimary onClick={onConfirm}>
            {confirmText}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
