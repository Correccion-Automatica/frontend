import React, { useState } from "react";

export default function CreateGuideline() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | ready

  const handleSend = () => {
    if (!input.trim()) return;

    // 1. agregar mensaje usuario
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: input.trim() },
    ]);
    setInput("");
    setStatus("loading");

    // 2. simular backend
    setTimeout(() => {
      // loader se muestra automáticamente por status=loading
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: `Criterios de evaluación:
1. Concepto de valor
2. Beneficios funcionales
3. Beneficios psicológicos
4. Costos monetarios
5. Costos no monetarios

¿Estás de acuerdo con los criterios a evaluar?`,
        },
      ]);
      setStatus("ready");
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold text-center mb-4">
        Creación de pautas
      </h1>

      {/* Caja chat */}
      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-md p-4 space-y-4 min-h-[300px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[85%] px-4 py-2 rounded-2xl whitespace-pre-line ${
              msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-[var(--color-background)] text-[var(--color-text)]"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {/* Loader cuando status=loading */}
        {status === "loading" && (
          <div className="max-w-[70%] px-3 py-2 rounded-2xl bg-[var(--color-background)] text-[color:var(--color-muted)]">
            Pensando criterios de evaluación…
          </div>
        )}

        {/* Botones cuando status=ready */}
        {status === "ready" && (
          <div className="flex gap-3 mt-2">
            <button className="rounded-lg bg-[var(--color-primary)] text-[var(--color-onprimary)] px-4 py-2 text-sm">
              Sí, continuar
            </button>
            <button className="rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-2 text-sm">
              No, editar
            </button>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <textarea
          rows={2}
          className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm"
          placeholder="Escribe tu pregunta o contexto aquí..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="rounded-xl bg-[var(--color-primary)] text-[var(--color-onprimary)] px-4 py-2 text-sm hover:bg-[var(--color-hover-strong)]"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
