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
  const [status, setStatus] = useState("NOT_STARTED"); // NOT_STARTED | IN_PROGRESS | SUBMITTED
  const [studentAnswer, setStudentAnswer] = useState("");
  const studentAnswerRef = useRef("");
  const hasSubmittedRef = useRef(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoSubmitted, setAutoSubmitted] = useState(false);

  // 🔥 NUEVO → Última respuesta
  const [lastAnswer, setLastAnswer] = useState(null);

  // Mantener el ref actualizado
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

        const formatted = res.data.map((q) => ({
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
   * 2) VER SI YA RESPONDIÓ (GET /answers/all)
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
          const latest = myAnswers.reduce((max, a) =>
            a.id > max.id ? a : max
          );

          setLastAnswer(latest);
          setStatus("SUBMITTED");
        }
      } catch (err) {
        console.error("❌ Error obteniendo respuestas del alumno:", err);
      }
    };

    fetchAnswers();
  }, [user, isAuthenticated, questionId]);

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
  }, [status, question]);

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

      await api.post("/answers/submit", {
        students_answer: latestAnswer || "(sin respuesta)",
        questionId: question.id,
      });

      setStatus("SUBMITTED");
      setAutoSubmitted(auto);
      setLastAnswer({ content: latestAnswer });
    } catch (err) {
      console.error("❌ Error al enviar respuesta:", err);
      hasSubmittedRef.current = false;
    }
  };

  const handleAutoSubmit = () => handleSubmit(true);

  /* ---------------------------------------------------------
   *  Render
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
    return (
      <p className="p-6 text-center">
        No se encontró la pregunta solicitada.
      </p>
    );

  /* ---------------------------------------------------------
   * ❌ Pregunta NO publicada
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
   * ❌ Pregunta VENCIDA
   * --------------------------------------------------------- */
  const now = new Date();
  const deadline = question.endDatetime ? new Date(question.endDatetime) : null;

  if (deadline && now > deadline && !lastAnswer) {
    return (
      <div className="mt-6 px-4 text-center">
        <PageHeader columns={[question.title]} />
        <div className="max-w-3xl mx-auto mt-6 p-6 rounded-2xl shadow bg-[var(--color-surface)] border">
          <h2 className="text-2xl font-semibold mb-4">{question.title}</h2>
          <p className="text-lg mb-4">🚫 Esta pregunta ya no está disponible.</p>
          <BackButton label="Volver al curso" />
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------
   * ✅ SUBMITTED
   * --------------------------------------------------------- */

if (status === "SUBMITTED") {
  return (
    <div className="mt-6 px-4 text-center">
      <PageHeader columns={[question.title]} />
      <div className="max-w-3xl mx-auto mt-6 p-6 rounded-2xl shadow bg-[var(--color-surface)] border">

        <p className="text-lg font-semibold mb-4">Tu respuesta enviada:</p>

        <div className="p-3 rounded-md border bg-[var(--color-background)] text-sm mb-2">
          {lastAnswer?.content || "(sin respuesta)"}
        </div>

        {/* 🔎 Nuevo mensaje que pediste */}
        <p className="text-[var(--color-muted)] text-sm mt-4 italic">
          Una vez que la pregunta sea corregida podrás ver tu nota y los comentarios del corrector aquí.
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
   * 🚀 NOT_STARTED
   * --------------------------------------------------------- */
  if (status === "NOT_STARTED") {
    return (
      <div className="mt-6 px-4 text-center">
        <PageHeader columns={[question.title]} />

        <div className="max-w-3xl mx-auto mt-6 p-6 rounded-2xl shadow bg-[var(--color-surface)] border">
          <h2 className="text-2xl font-semibold mb-4">{question.title}</h2>
          <p className="text-lg mb-4 whitespace-pre-line">{question.content}</p>

          <p className="mb-2">Duración: {question.duration} segundos.</p>
          <p className="mb-6">
            Fecha límite:{" "}
            {deadline ? deadline.toLocaleDateString("es-CL") : "No definida"}
          </p>

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
 * 🟢 GRADED — Mostrar nota + feedback del asistente
 * --------------------------------------------------------- */
if (status === "GRADED") {
  return (
    <div className="mt-6 px-4 text-center">
      <PageHeader columns={[question.title]} />
      <div className="max-w-3xl mx-auto mt-6 p-6 rounded-2xl shadow 
        bg-[var(--color-surface)] text-[var(--color-text)] border">

        <p className="text-2xl font-semibold mb-4">📝 Resultado de la evaluación</p>

        {/* NOTA */}
        <div className="p-4 mb-4 rounded-xl border bg-[var(--color-background)]">
          <p className="text-xl font-bold text-[var(--color-primary)]">
            Nota final: {lastAnswer?.grade ?? "N/A"}
          </p>
        </div>

        {/* FEEDBACK DEL ASISTENTE */}
        <div className="text-left p-4 rounded-xl border bg-[var(--color-background)]">
          <h3 className="text-lg font-semibold mb-2">Comentarios del corrector:</h3>
          <p className="whitespace-pre-line text-[var(--color-text)]">
            {lastAnswer?.assistantFeedback || "Sin comentarios disponibles."}
          </p>
        </div>

        {/* RESPUESTA DEL ESTUDIANTE */}
        <div className="mt-6 text-left">
          <h3 className="text-lg font-semibold mb-2">Tu respuesta enviada:</h3>
          <div className="p-3 rounded-md border bg-[var(--color-background)] text-sm">
            {lastAnswer?.content || "(sin respuesta)"}
          </div>
        </div>
      </div>
    </div>
  );
}

  /* ---------------------------------------------------------
   * ✍️ IN_PROGRESS
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
