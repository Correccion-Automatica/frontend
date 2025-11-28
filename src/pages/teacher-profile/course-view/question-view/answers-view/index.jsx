import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../../../../components/PageHeader";
import CreditOptionDisplay from "../../../../../components/CreditOptionDisplay";
import ButtonPrimary from "../../../../../components/ButtonPrimary";
import BackButton from "../../../../../components/BackButton";
import { api } from "../../../../../lib/axios";

export default function AnswersView() {
  const { courseId, questionId } = useParams();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🧠 Cargar datos desde el backend
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);

        // Trae todas las preguntas del curso
        const res = await api.get(`/questions/${courseId}`);
        const questions = res.data || [];

        // Filtra por ID de pregunta
        const found = questions.find((q) => q.id === Number(questionId));

        if (!found) {
          setError("No se encontró la pregunta solicitada.");
          return;
        }

        setQuestion(found);
      } catch (err) {
        console.error("❌ Error al obtener la pregunta:", err);
        setError("Error al cargar la pregunta.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [courseId, questionId]);

  // --- Renderizado ---
  if (loading)
    return <p className="text-center mt-10 text-[var(--color-muted)]">Cargando pregunta...</p>;

  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="mt-6 px-4 space-y-6">
      {/* ✅ Header principal */}
      <PageHeader columns={[`Preguntas profesor curso ${courseId}`]} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 📊 Panel lateral */}
        <div className="lg:col-span-1">
          <CreditOptionDisplay userName="Carolina" credits={50} />
        </div>

        {/* 📋 Contenido principal */}
        <div className="lg:col-span-3 space-y-4">
          {/* 🔙 Volver + Info curso */}
          <div className="flex items-center justify-between bg-[var(--color-surface)] p-4 rounded-xl shadow-sm border border-[var(--color-border)]">
            <BackButton to={`/teacher-profile/course-view/${courseId}`} />
            <div className="text-center flex-1 font-semibold text-lg">
              {question?.courseTitle || "Marketing - ICS3313"}
            </div>
            <div className="text-[var(--color-muted)] text-sm">
              {question?.teacher || "Carolina Martínez"}
            </div>
          </div>

          {/* 🧾 Card principal */}
          <div
            className="max-w-2xl mx-auto p-8 rounded-3xl 
                       bg-[var(--color-surface)] border border-[var(--color-border)] 
                       shadow-md text-center"
          >
            <h2 className="text-xl font-bold mb-2">
              Pregunta {question?.title || "Control Sorpresa"}
            </h2>

            {/* 📅 Datos principales */}
            <div className="flex flex-col sm:flex-row justify-between text-sm text-[var(--color-muted)] mb-4">
              <span>
                Fecha de entrega:{" "}
                {question?.endDatetime
                  ? new Date(question.endDatetime).toLocaleDateString("es-CL")
                  : "Sin fecha"}
              </span>
              <span>
                Duración:{" "}
                {question?.duration
                  ? `${Math.floor(question.duration / 60)} minutos`
                  : "—"}
              </span>
              <span
                className={`font-semibold ${
                  question?.isPublished ? "text-green-600" : "text-red-500"
                }`}
              >
                {question?.isPublished ? "PUBLICADA" : "NO PUBLICADA"}
              </span>
            </div>

            {/* 📄 Pauta */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <img src="/pdf-icon.svg" alt="PDF" className="w-6 h-6" />
              <a
                href={question?.guidelineUrl || "#"}
                className="underline text-[var(--color-primary)] hover:text-[var(--color-hover-strong)]"
                target="_blank"
                rel="noreferrer"
              >
                Pauta {question?.title || "de la pregunta"}.pdf
              </a>
            </div>

            {/* 📊 Calificación y respuestas */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <p>
                Calificación promedio: <strong>__ /10</strong>
              </p>
              <p>
                Respuestas:{" "}
                <strong>
                  {question?.numAnswers || 0}/{question?.numStudents || 88}
                </strong>
              </p>
            </div>

            {/* ⚙️ Acciones */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
              <ButtonPrimary
                disabled
                className="bg-gray-500 hover:bg-gray-500 cursor-not-allowed"
              >
                Corregir todas las respuestas
              </ButtonPrimary>

              <ButtonPrimary className="bg-[var(--color-primary)] text-[var(--color-onprimary)] hover:bg-[var(--color-hover-strong)]">
                PUBLICAR
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
