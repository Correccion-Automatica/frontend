// src/pages/student-profile/question-view/QuestionDetail.jsx

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import TextAreaInput from "../../../../components/TextAreaInput";
import ButtonPrimary from "../../../../components/ButtonPrimary";
import BackButton from "../../../../components/BackButton";
import PageHeader from "../../../../components/PageHeader";
import { api } from "../../../../lib/axios";
import { useAuth } from "../../../../context/AuthProvider";

export default function QuestionDetail() {
  const { courseId, questionId } = useParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [question, setQuestion] = useState(null);
  const [status, setStatus] = useState("NOT_STARTED"); // NOT_STARTED | IN_PROGRESS | SUBMITTED | GRADED
  const [studentAnswer, setStudentAnswer] = useState("");
  const studentAnswerRef = useRef("");
  const hasSubmittedRef = useRef(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoSubmitted, setAutoSubmitted] = useState(false);

  // 🔥 Última respuesta (Answer)
  const [lastAnswer, setLastAnswer] = useState(null);

  // ✅ Recorrección (request del alumno)
  const [recorrectionText, setRecorrectionText] = useState("");
  const [recorrectionSending, setRecorrectionSending] = useState(false);
  const [recorrectionSuccess, setRecorrectionSuccess] = useState(false);
  const [recorrectionError, setRecorrectionError] = useState("");

  // ✅ Recorrección (data existente asociada a AnswerId)
  const [recorrection, setRecorrection] = useState(null);
  const [recorrectionLoading, setRecorrectionLoading] = useState(false);

  // Mantener ref actualizado
  useEffect(() => {
    studentAnswerRef.current = studentAnswer;
  }, [studentAnswer]);

  /* ---------------------------------------------------------
   * 1) Traer preguntas del curso
   * --------------------------------------------------------- */
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/questions/${courseId}`);

        const formatted = (res.data || []).map((q) => ({
          id: q.id,
          title: q.title,
          content:
            typeof q.content === "object"
              ? q.content.text || JSON.stringify(q.content)
              : q.content || "Sin contenido disponible",
          duration: q.duration || 180,
          endDatetime: q.endDatetime || null,
          isPublished: q.isPublished ?? false,
        }));

        const found = formatted.find((q) => q.id === parseInt(questionId, 10));
        setQuestion(found || null);
      } catch (err) {
        console.error("❌ Error al obtener preguntas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [courseId, questionId]);

  /* ---------------------------------------------------------
   * 2) Ver si ya respondió (GET /answers/all)
   * --------------------------------------------------------- */
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        if (!user || !isAuthenticated) return;

        const res = await api.get("/answers/all");
        const answers = res.data || [];

        const myAnswers = answers.filter(
          (a) =>
            Number(a.userId) === Number(user.id) &&
            Number(a.questionId) === Number(questionId)
        );

        if (myAnswers.length > 0) {
          const latest = myAnswers.reduce((max, a) => (a.id > max.id ? a : max));

          setLastAnswer(latest);

          // Si viene con grade, considerarlo "GRADED"
          if (latest?.grade !== null && latest?.grade !== undefined) {
            setStatus("GRADED");
          } else {
            setStatus("SUBMITTED");
          }
        }
      } catch (err) {
        console.error("❌ Error obteniendo respuestas:", err);
      }
    };

    fetchAnswers();
  }, [user, isAuthenticated, questionId]);

  /* ---------------------------------------------------------
   * 2.1) Si hay grade, buscar si existe recorrection asociada a answerId
   * --------------------------------------------------------- */
  useEffect(() => {
    const fetchRecorrection = async () => {
      try {
        setRecorrection(null);

        const hasGrade =
          lastAnswer?.grade !== null && lastAnswer?.grade !== undefined;

        if (!hasGrade || !lastAnswer?.id) return;

        setRecorrectionLoading(true);

        // 🔥 NUEVO: traer TODAS las recorreciones
        const res = await api.get("/recorrection");
        const allRecorrections = res.data || [];

        // 🔎 Buscar la que corresponde a esta respuesta
        const found = allRecorrections.find(
          (r) => Number(r.answerId) === Number(lastAnswer.id)
        );

        setRecorrection(found || null);
      } catch (err) {
        console.error("❌ Error obteniendo recorreción:", err);
        setRecorrection(null);
      } finally {
        setRecorrectionLoading(false);
      }
    };

    fetchRecorrection();
  }, [lastAnswer?.id, lastAnswer?.grade]);

  /* ---------------------------------------------------------
   * 3) Timer
   * --------------------------------------------------------- */
  useEffect(() => {
    if (status === "IN_PROGRESS" && question?.duration) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status, question]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  /* ---------------------------------------------------------
   * 4) Envío manual / automático
   * --------------------------------------------------------- */
  const handleSubmit = async (auto = false) => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;

    try {
      const latestAnswer = studentAnswerRef.current;

      // ✅ Backend espera students_answer (según tu router)
      const res = await api.post("/answers/submit", {
        studentsAnswer: latestAnswer || "(sin respuesta)",
        questionId: question.id,
      });

      setStatus("SUBMITTED");
      setAutoSubmitted(auto);

      // si el backend devuelve newAnswer, lo guardamos
      const created = res?.data?.newAnswer;
      if (created) {
        setLastAnswer(created);
      } else {
        setLastAnswer({ content: latestAnswer, grade: null });
      }
    } catch (err) {
      console.error("❌ Error al enviar respuesta:", err);
      hasSubmittedRef.current = false;
    }
  };

  const handleAutoSubmit = () => handleSubmit(true);

  /* ---------------------------------------------------------
   * 5) Enviar solicitud de recorreción
   * --------------------------------------------------------- */
  const handleRecorrection = async () => {
    try {
      setRecorrectionError("");
      setRecorrectionSuccess(false);

      if (!lastAnswer?.id) {
        setRecorrectionError("No se encontró el ID de tu respuesta (answerId).");
        return;
      }

      if (!recorrectionText.trim()) {
        setRecorrectionError("Escribe un motivo para solicitar la recorreción.");
        return;
      }

      setRecorrectionSending(true);

      await api.post("/recorrection", {
        answerId: lastAnswer.id,
        content: recorrectionText.trim(),
      });

      setRecorrectionSuccess(true);
      setRecorrectionText("");

      // marcamos recorrection como "existente" localmente (para bloquear reenvíos)
      setRecorrection((prev) => {
        if (prev) return prev;
        return {
          id: "pending",
          content: recorrectionText.trim(),
          teachersFeedback: null,
          answerId: lastAnswer.id,
          newGrade: null,
        };
      });

      setTimeout(() => setRecorrectionSuccess(false), 4000);
    } catch (err) {
      console.error("❌ Error enviando recorreción:", err);
      setRecorrectionError(
        "No se pudo enviar la recorreción. Revisa la consola o intenta nuevamente."
      );
    } finally {
      setRecorrectionSending(false);
    }
  };

  /* ---------------------------------------------------------
   * Render
   * --------------------------------------------------------- */
  if (authLoading || loading)
    return <p className="p-6 text-center">Cargando pregunta...</p>;

  if (!isAuthenticated)
    return (
      <p className="p-6 text-center text-[var(--color-muted)]">
        Debes iniciar sesión para ver esta pregunta.
      </p>
    );

  if (!question)
    return <p className="p-6 text-center">No se encontró la pregunta solicitada.</p>;

  /* ---------------------------------------------------------
   * Pregunta NO publicada
   * --------------------------------------------------------- */
  if (!question.isPublished) {
    return (
      <div className="mt-6 px-4 text-center">
        <PageHeader columns={[question.title]} />
        <div className="max-w-3xl mx-auto mt-6 p-6 rounded-2xl shadow bg-[var(--color-surface)] border">
          <h2 className="text-2xl font-semibold mb-4">{question.title}</h2>
          <p className="mb-2">⛔ Esta pregunta aún no ha sido publicada.</p>
          <BackButton label="Volver al curso" />
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------
   * Pregunta vencida
   * --------------------------------------------------------- */
  const now = Date.now();
  const deadlineMs = question.endDatetime
    ? new Date(question.endDatetime).getTime()
    : null;

  if (deadlineMs && now > deadlineMs && !lastAnswer) {
    return (
      <div className="mt-6 px-4 text-center">
        <PageHeader columns={[question.title]} />
        <div className="max-w-3xl mx-auto mt-6 p-6 rounded-2xl shadow bg-[var(--color-surface)] border">
          <h2 className="text-2xl font-semibold mb-4">{question.title}</h2>
          <p className="text-lg mb-4">
            🚫 Esta pregunta no está disponible porque ya pasó la fecha de entrega.
          </p>
          <BackButton label="Volver al curso" />
        </div>
      </div>
    );
  }

  // helper: “ya está corregida”
  const isGraded =
    status === "GRADED" ||
    (lastAnswer?.grade !== null && lastAnswer?.grade !== undefined);

  const hasRecorrection =
    !!recorrection && Number(recorrection?.answerId) === Number(lastAnswer?.id);

  /* ---------------------------------------------------------
   * SUBMITTED (sin nota)
   * --------------------------------------------------------- */
  if (status === "SUBMITTED" && !isGraded) {
    return (
      <div className="mt-6 px-4 text-center">
        <PageHeader columns={[question.title]} />
        <div className="max-w-3xl mx-auto mt-6 p-6 rounded-2xl shadow bg-[var(--color-surface)] border">
          <p className="text-lg font-semibold mb-4">Tu respuesta enviada:</p>

          <details className="text-left p-3 rounded-md border bg-[var(--color-background)] text-sm mb-2">
            <summary className="cursor-pointer font-semibold">
              Ver respuesta enviada
            </summary>
            <div className="mt-2 whitespace-pre-line">
              {lastAnswer?.content || "(sin respuesta)"}
            </div>
          </details>

          <p className="text-[var(--color-muted)] text-sm mt-4 italic">
            Una vez que la pregunta sea corregida podrás ver tu nota y los
            comentarios del corrector aquí.
          </p>

          {autoSubmitted ? (
            <p className="text-orange-500 text-sm mt-4">
              ⏰ Tu tiempo se agotó y la respuesta fue enviada automáticamente.
            </p>
          ) : (
            <p className="text-green-600 text-sm mt-4">
              ✅ Tu respuesta fue enviada correctamente.
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------
   * NOT_STARTED
   * --------------------------------------------------------- */
  if (status === "NOT_STARTED") {
    const deadlineText = question.endDatetime
      ? new Intl.DateTimeFormat("es-CL", {
          timeZone: "America/Santiago",
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(question.endDatetime))
      : "No definida";

    return (
      <div className="mt-6 px-4 text-center">
        <PageHeader columns={[question.title]} />
        <div className="max-w-3xl mx-auto mt-6 p-6 rounded-2xl shadow bg-[var(--color-surface)] border">
          <h2 className="text-2xl font-semibold mb-4">{question.title}</h2>
          <p className="text-lg mb-4 whitespace-pre-line">{question.content}</p>

          <p className="mb-2">Duración: {question.duration} segundos.</p>
          <p className="mb-6">Fecha límite: {deadlineText}</p>

          <ButtonPrimary
            onClick={() => {
              setStatus("IN_PROGRESS");
              setTimeLeft(question.duration);
            }}
          >
            Empezar
          </ButtonPrimary>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------
   * GRADED — nota + feedback + (si existe) recorrection asociada
   * --------------------------------------------------------- */
  if (isGraded) {
    const displayedGrade =
      hasRecorrection && recorrection?.newGrade != null
        ? recorrection.newGrade
        : lastAnswer?.grade;

    return (
      <div className="mt-6 px-4 text-center">
        <PageHeader columns={[question.title]} />
        <div className="max-w-3xl mx-auto mt-6 p-6 rounded-2xl shadow bg-[var(--color-surface)] border">
          <p className="text-2xl font-semibold mb-4">📝 Resultado de la evaluación</p>

          {/* Banner éxito recorreción */}
          {recorrectionSuccess && (
            <div
              className="mb-4 text-center p-3 rounded-xl 
                         bg-green-100 text-green-700 border border-green-300 
                         font-medium animate-fade-in"
            >
              ✅ Corrección enviada correctamente
            </div>
          )}

          {/* NOTA */}
          <div className="p-4 mb-4 rounded-xl border bg-[var(--color-background)]">
            <p className="text-xl font-bold">
              Nota final: {displayedGrade ?? "N/A"}
            </p>

            {hasRecorrection && recorrection?.newGrade != null && (
              <p className="text-xs text-[var(--color-muted)] mt-1">
                (Mostrando la nueva nota luego de la recorreción)
              </p>
            )}
          </div>

          {/* Si existe recorrection asociada, mostrar ese bloque arriba */}
          {recorrectionLoading ? (
            <div className="mb-4 text-sm text-[var(--color-muted)]">
              Cargando estado de recorreción...
            </div>
          ) : hasRecorrection ? (
            <div className="mb-6 text-left p-4 rounded-xl border bg-[var(--color-background)]">
              <h3 className="text-lg font-semibold mb-3">🔁 Recorreción</h3>

              <details className="rounded-lg border bg-white/40 p-3">
                <summary className="cursor-pointer font-semibold">
                  Motivo de Recorrección
                </summary>
                <div className="mt-2 whitespace-pre-line text-sm">
                  {recorrection?.content || "(sin contenido)"}
                </div>
              </details>

              <details className="mt-3 rounded-lg border bg-white/40 p-3">
                <summary className="cursor-pointer font-semibold">
                  Feedback Recorrección
                </summary>
                <div className="mt-2 whitespace-pre-line text-sm">
                  {recorrection?.teachersFeedback || "Esperando respuesta"}
                </div>
              </details>

              <div className="mt-3 text-sm">
                <span className="font-semibold">Nueva nota:</span>{" "}
                {recorrection?.newGrade ?? "Esperando respuesta"}
              </div>
            </div>
          ) : null}

          {/* FEEDBACK DEL ASISTENTE (desplegable) */}
          <details className="text-left p-4 rounded-xl border bg-[var(--color-background)]">
            <summary className="cursor-pointer text-lg font-semibold">
              Comentarios del corrector
            </summary>
            <div className="mt-3 whitespace-pre-line">
              {lastAnswer?.assistantFeedback || "Sin comentarios disponibles."}
            </div>
          </details>

          {/* RESPUESTA DEL ESTUDIANTE (desplegable) */}
          <details className="mt-4 text-left p-4 rounded-xl border bg-[var(--color-background)]">
            <summary className="cursor-pointer text-lg font-semibold">
              Tu respuesta enviada
            </summary>
            <div className="mt-3 whitespace-pre-line text-sm">
              {lastAnswer?.content || "(sin respuesta)"}
            </div>
          </details>

          {/* Recorrección (solo si NO existe una recorrection asociada) */}
          {!hasRecorrection && (
            <div className="mt-6 text-left">
              <h3 className="text-lg font-semibold mb-2">
                ¿Quieres pedir una recorreción?
              </h3>

              {recorrectionError && (
                <div className="mb-3 text-sm text-red-600">{recorrectionError}</div>
              )}

              <TextAreaInput
                placeholder="Explica por qué crees que deberían revisarte la corrección..."
                value={recorrectionText}
                onChange={setRecorrectionText}
              />

              <div className="flex justify-center mt-4">
                <ButtonPrimary
                  onClick={handleRecorrection}
                  disabled={recorrectionSending}
                >
                  {recorrectionSending ? "Enviando..." : "Recorregir pregunta"}
                </ButtonPrimary>
              </div>
            </div>
          )}

          {hasRecorrection && (
            <div className="mt-6 text-[var(--color-muted)] text-sm">
              Ya solicitaste una recorreción para esta respuesta.
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------
   * IN_PROGRESS
   * --------------------------------------------------------- */
  return (
    <div className="mt-6 px-4 text-center">
      <PageHeader columns={[question.title]} />
      <div className="max-w-3xl mx-auto mt-6 p-6 rounded-2xl shadow bg-[var(--color-surface)] border">
        <div className="mb-4 flex justify-end text-sm font-semibold">
          ⏳ Tiempo restante: {formatTime(timeLeft)}
        </div>

        <p className="text-lg mb-4 whitespace-pre-line">{question.content}</p>

        <TextAreaInput
          placeholder="Escribe tu respuesta aquí..."
          value={studentAnswer}
          onChange={setStudentAnswer}
        />

        <div className="flex justify-center mt-6">
          <ButtonPrimary onClick={() => handleSubmit(false)}>
            Enviar respuesta
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
