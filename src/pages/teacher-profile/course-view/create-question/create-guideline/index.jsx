// CreateGuideline.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ChatMessage from "../../../../../components/ChatMessage";
import ChatActions from "../../../../../components/ChatActions";
import PageHeader from "../../../../../components/PageHeader";
import ButtonPrimary from "../../../../../components/ButtonPrimary";
import CreditOptionDisplay from "../../../../../components/CreditOptionDisplay";
// CreditSummaryCard moved to sidebar (CreditOptionDisplay)
import CreditSummaryCard from "../../../../../components/CreditSummaryCard";
import { api } from "../../../../../lib/axios";
import { useAuth } from "../../../../../context/AuthProvider";
import { useCredits } from "../../../../../context/CreditsContext";
import gsap from "gsap";

export default function CreateGuideline() {
  const { courseId, questionId } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const sidebarCredits = Number(user?.remaining_credits ?? user?.credits ?? 0);
  const sidebarName = user?.fullName || user?.name || "Usuario";

  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("intro"); // intro | loading | ready | editing | done
  const [question, setQuestion] = useState(null);
  const [allowancePre, setAllowancePre] = useState(null);
  const [allowancePost, setAllowancePost] = useState(null);
  const [iterationsPossible, setIterationsPossible] = useState(null);
  const { refreshCredits } = useCredits();

  const [fase1ResponseId, setFase1ResponseId] = useState(null);
  const [_guidelineId, setGuidelineId] = useState(null);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const messagesEndRef = React.useRef(null);

  const loadingRef = React.useRef(null);
  const loadingTextRef = React.useRef(null);

  const minCreditsForEdit = 110;

  const loadingPhrases = [
    "Procesando solicitud…",
    "Generando criterios de evaluación…",
    "Aplicando observaciones del docente…",
    "Preparando versión final de criterios…",
  ];
  const [loadingText, _setLoadingText] = useState(loadingPhrases[0]);

  // removed interval-based text cycling; GSAP will handle loading animations

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  useEffect(() => {
    if (status !== "loading") return;
    if (!loadingRef.current || !loadingTextRef.current) return;

    const ctx = gsap.context(() => {
      const dots = gsap.utils.toArray(".dot", loadingRef.current);
      const tl = gsap.timeline({ repeat: -1 });

      // animate dots
      tl.to(dots, { y: -6, opacity: 1, stagger: 0.12, duration: 0.35 })
        .to(dots, { y: 0, opacity: 0.6, stagger: 0.12, duration: 0.35 }, "+=0.12");

      // cycle loading text from loadingPhrases
      let i = 0;
      tl.call(() => {
        loadingTextRef.current.innerText = loadingPhrases[i];
        i = (i + 1) % loadingPhrases.length;
      })
        .to(loadingTextRef.current, { opacity: 1, y: 0, duration: 0.18 })
        .to(loadingTextRef.current, { opacity: 0, y: -6, duration: 0.18, delay: 1 });

      return () => tl.kill();
    }, loadingRef);

    return () => ctx.revert && ctx.revert();
  }, [status]);
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

  // Consultar al backend si el usuario tiene créditos y cuántas ediciones permite
  const fetchAllowance = async () => {
    try {
      const res = await api.get("/guidelines/calculate");
      const { pre, post } = res.data || {};
      setAllowancePre(pre || null);
      setAllowancePost(post || null);
      // compute iterations possible based on full-cost (fase1 + finish)
      if (pre && typeof pre.remainingCredits === "number") {
        const fase1 = Number(pre.fase1Cost || 0);
        const finish = Number(pre.finishCost || 0);
        const denom = fase1 + finish;
        const iters =
          denom > 0
            ? Math.floor((Number(pre.remainingCredits) || 0) / denom)
            : 0;
        setIterationsPossible(iters);
      } else {
        setIterationsPossible(null);
      }

      return pre || null;
    } catch (err) {
      console.error("❌ Error obteniendo allowance de créditos:", err);
      return null;
    }
  };

  useEffect(() => {
    fetchAllowance();
    // also consider re-fetching when question or user changes
  }, []);

  /** ------------------------------------------------------------------
   *  2) FASE 1 — Se activa al presionar “Comenzar criterio de evaluación”
   * ------------------------------------------------------------------ */
  const handleStart = async () => {
    if (!question) return;

    // ensure we have allowance info
    const pre = allowancePre || (await fetchAllowance());
    if (!pre || !pre.canProceed) {
      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          content:
            "No tienes créditos suficientes para generar la pauta. Por favor, recarga tu cuenta.",
        },
      ]);
      setStatus("intro");
      return;
    }

    setStatus("loading");

    try {
      const res = await api.post("/guidelines/fase-1", {
        questionId: question.id,
      });

      console.log("FASE 1 RESPONSE:", res.data);

      setFase1ResponseId(res.data.responseId);

      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          content: res.data.criteria,
        },
      ]);

      // refresh allowance after consuming fase1 cost
      await fetchAllowance();
      // update global credits context
      try {
        refreshCredits();
      } catch (err) {
        void err;
      }

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
   *  2.5) FASE 1-EDIT — Se activa al enviar observaciones en modo "editing"
   *  - Llama a POST /guidelines/fase-1-edit
   *  - Continúa desde fase1ResponseId (previous_response_id) y ajusta criterios
   *  - Devuelve criteria + responseId nuevo (se guarda para continuar el flujo)
   * ------------------------------------------------------------------ */
  const handleSendEdit = async (feedback) => {
    if (!fase1ResponseId) return;

    setStatus("loading");

    try {
      // check allowance for edits
      const post = allowancePost || (await fetchAllowance());
      if (!post || (post.maxEdits || 0) <= 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: "assistant",
            content: "No tienes créditos suficientes para editar la pauta.",
          },
        ]);
        setStatus("ready");
        return;
      }

      const res = await api.post("/guidelines/fase-1-edit", {
        fase1ResponseId,
        feedback,
      });

      setFase1ResponseId(res.data.responseId);

      // Solo append: conservar historial de user -> assistant -> user -> assistant
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "assistant", content: res.data.criteria },
      ]);

      // refresh allowance after consuming edit cost
      await fetchAllowance();
      // update global credits context
      try {
        refreshCredits();
      } catch (err) {
        void err;
      }
      setStatus("ready");
    } catch (err) {
      console.error("❌ Error editando criterios:", err);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content:
            "❌ No se pudo ajustar los criterios en este momento. Intenta nuevamente.",
        },
      ]);

      setStatus("ready");
    }
  };

  /** ------------------------------------------------------------------
   *  3) FINISH FASES — Se activa al confirmar criterios
   * ------------------------------------------------------------------ */
  const handleConfirm = async () => {
    if (!fase1ResponseId || !question) return;

    const key = `guideline_generating_${String(questionId)}`;
    localStorage.setItem(key, "1");

    try {
      const bc = new BroadcastChannel("guideline-status");
      bc.postMessage({ type: "guideline_generating", questionId });
      bc.close();
    } catch (err) {
      void err;
    }

    navigate(-1);
    setStatus("loading");

    try {
      const res = await api.post("/guidelines/finish-fases", {
        fase1ResponseId,
        title: question.title,
        questionId: question.id,
      });

      console.log("FINISH FASES RESPONSE:", res.data);

      const newId = res.data.id;
      setGuidelineId(newId);

      localStorage.removeItem(key);

      try {
        const bc = new BroadcastChannel("guideline-status");
        bc.postMessage({
          type: "guideline_created",
          questionId,
          guidelineId: newId,
        });
        bc.close();
      } catch (err) {
        void err;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: (
            <div className="space-y-2">
              <p>
                🎉 Tu pauta fue generada correctamente y cargada al curso. Ahora
                puedes descargarla en PDF.
              </p>

              <ButtonPrimary onClick={() => handleDownloadPDF(newId)}>
                📄 Descargar Pauta en PDF
              </ButtonPrimary>
            </div>
          ),
        },
      ]);

      // refresh allowance and global credits after finishing
      await fetchAllowance();
      try {
        refreshCredits();
      } catch (err) {
        void err;
      }

      setStatus("done");
    } catch (err) {
      console.error("❌ Error en finish-fases:", err);

      localStorage.removeItem(key);

      try {
        const bc = new BroadcastChannel("guideline-status");
        bc.postMessage({ type: "guideline_error", questionId });
        bc.close();
      } catch (err) {
        void err;
      }

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
   *  4) DESCARGAR PDF — GET /guidelines/generatePDF/:guidelineId
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

  /** ------------------------- RENDER ------------------------------- */
  return (
    <div className="mb-6">
      <PageHeader columns={["Creación de pautas"]} showBack={false} />

      <div className="max-w-7xl mx-auto mt-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Sidebar (desktop/tablet) */}
        <div className="hidden lg:block">
          <div className="flex flex-col gap-3 sticky top-6 max-h-[calc(100vh-3rem)] overflow-auto">
            <CreditOptionDisplay
              userName={sidebarName}
              credits={sidebarCredits}
              isCreditsPending={status === "loading"}
            />

            <CreditSummaryCard
              iterations={iterationsPossible ?? 0}
              maxEdits={Number(allowancePost?.maxEdits ?? 0)}
            />
          </div>
        </div>

        {/* Main */}
        <div>
          {/* Mobile credits (sticky and compact) */}
          <div className="lg:hidden sticky top-0 z-20 bg-[var(--color-background)]">
            <div className="mx-auto max-w-7xl px-4 pt-3 pb-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                <div className="w-full">
                  <CreditOptionDisplay
                    userName={sidebarName}
                    credits={sidebarCredits}
                    isCreditsPending={status === "loading"}
                  />
                </div>
                <div className="w-full">
                  <CreditSummaryCard
                    iterations={iterationsPossible ?? 0}
                    maxEdits={Number(allowancePost?.maxEdits ?? 0)}
                  />
                </div>
              </div>
            </div>
            <div className="h-px bg-[var(--color-border)] opacity-70" />
          </div>

          <div
            className="p-6 rounded-2xl shadow
                       bg-[var(--color-surface)] text-[var(--color-text)] 
                       border border-[var(--color-border)] 
                       min-h-[300px] flex flex-col space-y-4"
          >
            {question && (
              <ChatMessage
                role="assistant"
                content={
                  <div>
                    <p className="font-semibold text-lg mb-2">
                      🧩 {question.title}
                    </p>
                    <p className="whitespace-pre-line text-[var(--color-text)]">
                      {typeof question.content === "object"
                        ? question.content.text
                        : question.content}
                    </p>
                  </div>
                }
              />
            )}

            <div className="flex flex-col gap-3 flex-1">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
              ))}

              <div ref={messagesEndRef} />

              {status === "loading" && (
                <ChatMessage
                  role="assistant"
                  muted
                  content={
                    <div ref={loadingRef} className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="dot inline-block h-2 w-2 rounded-full bg-[var(--color-primary)] opacity-60" />
                        <span className="dot inline-block h-2 w-2 rounded-full bg-[var(--color-primary)] opacity-60" />
                        <span className="dot inline-block h-2 w-2 rounded-full bg-[var(--color-primary)] opacity-60" />
                      </div>

                      <div
                        ref={loadingTextRef}
                        className="ml-3 text-sm italic text-[var(--color-muted)] opacity-0 -translate-y-1"
                      >
                        {loadingText}
                      </div>
                    </div>
                  }
                />
              )}

              {status === "ready" && (
                <ChatActions
                  onConfirm={handleConfirm}
                  onEdit={() => setStatus("editing")}
                  cost={allowancePost?.editCost ?? minCreditsForEdit}
                  canEdit={(allowancePost?.maxEdits || 0) > 0}
                />
              )}
            </div>

            {status === "intro" && (
              <div className="border-t border[var(--color-border)] pt-4 flex flex-col items-center gap-3">
                {/** compute allowance states */}
                {(() => {
                  const canStart = Boolean(allowancePre?.canProceed);
                  const remaining = allowancePre?.remainingCredits ?? sidebarCredits;
                  const baseCost =
                    allowancePre?.baseCost ?? allowancePre?.fase1Cost ?? 0;
                  const editCost =
                    allowancePost?.editCost ??
                    allowancePre?.editCost ??
                    minCreditsForEdit;

                  if (!allowancePre) {
                    return (
                      <div className="w-full flex justify-center">
                        <ButtonPrimary
                          disabled
                          className="px-6 py-3 text-base font-semibold opacity-80"
                        >
                          Comprobando créditos…
                        </ButtonPrimary>
                      </div>
                    );
                  }

                  if (!canStart) {
                    return (
                      <>
                        <div className="w-full flex justify-center">
                          <ButtonPrimary
                            disabled
                            className="px-6 py-3 text-base font-semibold bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                          >
                            ⚠️ Créditos insuficientes
                          </ButtonPrimary>
                        </div>

                        <div className="text-center text-sm text-(--color-muted) max-w-xl">
                          <p>
                            Necesitas al menos <strong>{baseCost}</strong>{" "}
                            créditos (costo base) para generar la pauta.
                            Actualmente tienes <strong>{remaining}</strong>{" "}
                            créditos.
                          </p>
                          <div className="mt-2">
                            <Link
                              to="/payments/purchase"
                              className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-md text-sm hover:opacity-90"
                            >
                              Comprar créditos
                            </Link>
                          </div>
                        </div>
                      </>
                    );
                  }

                  return (
                    <>
                      <div className="w-full flex justify-center">
                        <ButtonPrimary
                          onClick={handleStart}
                          className="px-6 py-3 text-base font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-2xl shadow-lg hover:from-indigo-600 hover:to-blue-600 transform transition-transform duration-150 hover:-translate-y-0.5"
                        >
                          ⚙️ Comenzar criterio de evaluación
                        </ButtonPrimary>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

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

                    handleSendEdit(inputValue);
                  }}
                >
                  <div className="flex gap-3 items-end">
                    <textarea
                      name="feedback"
                      placeholder="Escribe tus observaciones…"
                      className="flex-1 p-3 rounded-md border border-[var(--color-border)] 
                                 bg[var(--color-background)] focus:ring-2 
                                 focus:ring-[var(--color-primary)]"
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={() => setStatus("ready")}
                      className="px-5 py-3 text-sm font-semibold rounded-md border border-[var(--color-border)] bg-[var(--color-background)] cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <ButtonPrimary
                      type="submit"
                      className="px-5 py-3 text-sm font-semibold"
                    >
                      Enviar
                    </ButtonPrimary>
                  </div>
                </form>
              </div>
            )}
          </div>

          {status === "done" && (
            <div className="flex flex-col items-center mt-6 gap-4">
              <ButtonPrimary
                onClick={() => window.history.back()}
                disabled={downloadingPDF}
              >
                {downloadingPDF ? "Descargando…" : "Ir a mi pregunta"}
              </ButtonPrimary>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
