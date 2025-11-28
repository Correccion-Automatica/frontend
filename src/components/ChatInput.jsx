import React, { useState } from "react";
import ButtonPrimary from "./ButtonPrimary";

export default function ChatInput({ onSend, disabled }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="mt-4 flex gap-2">
      <textarea
        rows={2}
        className="flex-1 rounded-xl border border-[var(--color-border)] 
                   bg-[var(--color-background)] px-3 py-2 text-sm"
        placeholder="Escribe tu pregunta o contexto aquí..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
      />
      <ButtonPrimary onClick={handleSend} disabled={disabled}>
        Enviar
      </ButtonPrimary>
    </div>
  );
}
