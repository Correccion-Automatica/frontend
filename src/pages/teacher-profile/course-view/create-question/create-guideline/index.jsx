import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatMessage from "../../../../../components/ChatMessage";
import ChatActions from "../../../../../components/ChatActions";
import PageHeader from "../../../../../components/PageHeader";
import ButtonPrimary from "../../../../../components/ButtonPrimary";
import CreditOptionDisplay from "../../../../../components/CreditOptionDisplay";
import { api } from "../../../../../lib/axios";

export default function CreateGuideline() {
  const { courseId, questionId } = useParams();

  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("intro"); // intro | loading | ready | editing | done
  const [question, setQuestion] = useState(null);

  const [fase1ResponseId, setFase1ResponseId] = useState(null);
  const [guidelineId, setGuidelineId] = useState(null);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  // créditos del usuario (mock)
  const userName = "Carolina";
  const credits = 8000;
  const minCreditsForEdit = 2000;

  /** ------------------------------------------------------------------
   *  1) CARGAR LA PREGUNTA
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await api.get(`/questions/${courseId}`);
        const found = res.data.find((q) => q.id === parseInt(questionId, 10));
        if (found) setQuestion(found);
      } catch (err) {
        console.error("❌ Error al obtener la pregunta:", err);
      }
    };
    fetchQuestion();
  }, [courseId, questionId]);


  /** ------------------------------------------------------------------
   *  2) FASE 1 — Se activa al presionar “Comenzar criterio de evaluación”
   * ------------------------------------------------------------------ */
  const handleStart = async () => {
    if (!question) return;

    setStatus("loading");

    try {
      const res = await api.post("/guidelines/fase-1", {
        content: question.content, // <-- NO MODIFICAR
      });

      console.log("FASE 1 RESPONSE:", res.data);

      setFase1ResponseId(res.data.responseId);

      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          content: res.data.criteria, // texto del modelo
        },
      ]);

      setStatus("ready");
    } catch (err) {
      console.error("❌ Error en Fase 1:", err);

      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          content: "❌ Error generando criterios.",
        },
      ]);

      setStatus("intro");
    }
  };


  /** ------------------------------------------------------------------
   *  3) FINISH FASES — Se activa al confirmar criterios
   * ------------------------------------------------------------------ */
  const handleConfirm = async () => {
    if (!fase1ResponseId || !question) return;

    setStatus("loading");

    try {
      const res = await api.post("/guidelines/finish-fases", {
        fase1ResponseId,
        title: question.title,
        questionId: question.id,
      });

      console.log("FINISH FASES RESPONSE:", res.data);

      const newId = res.data.id; // <-- ID de la pauta
      setGuidelineId(newId);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: (
            <div className="space-y-2">
              <p>
                🎉 Tu pauta fue generada correctamente y cargada al curso.
                Ahora puedes descargarla en PDF.
              </p>

              {/* Descargar PDF solo cuando se hace click */}
              <ButtonPrimary onClick={() => handleDownloadPDF(newId)}>
                📄 Descargar Pauta en PDF
              </ButtonPrimary>
            </div>
          ),
        },
      ]);

      setStatus("done");
    } catch (err) {
      console.error("❌ Error en finish-fases:", err);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: "❌ Ocurrió un error al finalizar la pauta.",
        },
      ]);

      setStatus("ready");
    }
  };


  /** ------------------------------------------------------------------
   *  4) DESCARGAR PDF — GET /guideline/generatePDF/:guidelineId
   * ------------------------------------------------------------------ */
  const handleDownloadPDF = async (id) => {
    if (!id) {
      console.error("❌ No hay guidelineId, no se puede descargar");
      return;
    }

    try {
      setDownloadingPDF(true);

      const res = await api.get(`/guidelines/generatePDF/${id}`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Pauta - ${question?.title || "pregunta"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Error descargando PDF:", err);
      alert("Error descargando PDF.");
    } finally {
      setDownloadingPDF(false);
    }
  };


  /** ------------------------------------------------------------------
   *  MODO EDICIÓN (dummy)
   * ------------------------------------------------------------------ */
  const handleEdit = () => setStatus("editing");


  /** ------------------------- RENDER ------------------------------- */
  return (
    <div className="mb-6">
      <PageHeader columns={["Creación de pautas"]} showBack={false} />

      <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Panel lateral créditos */}
        <div className="md:col-span-1">
          <CreditOptionDisplay userName={userName} credits={credits} />
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="md:col-span-3">
          <div
            className="p-6 rounded-2xl shadow
                       bg-[var(--color-surface)] text-[var(--color-text)] 
                       border border-[var(--color-border)] 
                       min-h-[300px] flex flex-col space-y-4"
          >
            {/* Pregunta */}
            {question && (
              <ChatMessage
                role="assistant"
                content={
                  <div>
                    <p className="font-semibold text-lg mb-2">🧩 {question.title}</p>
                    <p className="whitespace-pre-line text-[var(--color-text)]">
                      {typeof question.content === "object"
                        ? question.content.text
                        : question.content}
                    </p>
                  </div>
                }
              />
            )}

            {/* Mensajes */}
            <div className="flex flex-col gap-3 flex-1">
              {status === "loading" && (
                <ChatMessage role="assistant" muted content="🤔 Generando criterios…" />
              )}

              {messages.map((msg) => (
                <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
              ))}

              {status === "ready" && (
                <ChatActions
                  onConfirm={handleConfirm}
                  onEdit={handleEdit}
                  cost={250}
                  canEdit={credits >= minCreditsForEdit}
                />
              )}
            </div>

            {/* Botón inicial */}
            {status === "intro" && (
              <div className="border-t border-[var(--color-border)] pt-4 flex justify-center">
                <ButtonPrimary
                  onClick={handleStart}
                  className="px-6 py-3 text-base font-semibold"
                >
                  ⚙️ Comenzar criterio de evaluación
                </ButtonPrimary>
              </div>
            )}

            {/* Modo edición */}
            {status === "editing" && (
              <div className="border-t border-[var(--color-border)] pt-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target;
                    const inputValue = form.elements.feedback.value.trim();
                    if (!inputValue) return;

                    setMessages((prev) => [
                      ...prev,
                      { id: Date.now(), role: "user", content: inputValue },
                    ]);
                    form.reset();
                    setStatus("loading");

                    setTimeout(() => {
                      setMessages((prev) => [
                        ...prev,
                        {
                          id: Date.now() + 1,
                          role: "assistant",
                          content:
                            "Criterios ajustados según tu observación. ¿Estás conforme?",
                        },
                      ]);
                      setStatus("ready");
                    }, 1500);
                  }}
                >
                  <div className="flex gap-3 items-end">
                    <textarea
                      name="feedback"
                      placeholder="Escribe tus observaciones…"
                      className="flex-1 p-3 rounded-md border border-[var(--color-border)] 
                                 bg-[var(--color-background)] focus:ring-2 
                                 focus:ring-[var(--color-primary)]"
                      rows={2}
                    />
                    <ButtonPrimary type="submit" className="px-5 py-3 text-sm font-semibold">
                      Enviar
                    </ButtonPrimary>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* FINAL */}
          {status === "done" && (
            <div className="flex flex-col items-center mt-6 gap-4">

              <ButtonPrimary
                onClick={() => window.history.back()}
                disabled={downloadingPDF}
              >
                {downloadingPDF ? "Descargando…" : "Ir a mi pregunta"}
              </ButtonPrimary>

              {/* Descargar PDF solo si existe guidelineId */}
              {guidelineId && (
                <ButtonPrimary onClick={() => handleDownloadPDF(guidelineId)}>
                  📄 Descargar Pauta en PDF
                </ButtonPrimary>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
