// src/pages/teacher-profile/question-view/QuestionView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuestionForm from "../../../../components/QuestionForm";
import CreditOptionDisplay from "../../../../components/CreditOptionDisplay";
import PageHeader from "../../../../components/PageHeader";
import { api } from "../../../../lib/axios";
import { useAuth } from "../../../../context/AuthProvider";


export default function QuestionView() {
  const { courseId, questionId } = useParams();

    const { user } = useAuth();
    const sidebarCredits = Number(user?.remaining_credits ?? user?.credits ?? 0);
    const sidebarName = user?.fullName || user?.name || "Usuario";

  // Estados de la pregunta
  const [title, setTitle] = useState("");
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [content, setContent] = useState("");

  // ⭐ Nuevo estado requerido:
  const [isPublished, setIsPublished] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Obtener pregunta por ID
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);

        // Endpoint devuelve TODAS las preguntas del curso
        const res = await api.get(`/questions/${courseId}`);
        const questions = res.data || [];

        // Buscar por ID
        const found = questions.find(
          (q) => q.id === Number(questionId)
        );

        if (!found) {
          setError("No se encontró la pregunta solicitada.");
          return;
        }

        // --- Adaptar la data ---
        setTitle(found.title || "");

        setContent(
          typeof found.content === "object"
            ? found.content.text || JSON.stringify(found.content)
            : found.content || ""
        );

        // ⭐ Cargar estado publicado
        setIsPublished(Boolean(found.isPublished));

        // Duración → días / horas / minutos
        const duration = found.duration || 0;
        setDays(Math.floor(duration / (24 * 3600)));
        setHours(Math.floor((duration % (24 * 3600)) / 3600));
        setMinutes(Math.floor((duration % 3600) / 60));

        // Fecha límite
        setDueDate(
          found.endDatetime
            ? new Date(found.endDatetime).toISOString().slice(0, 16)
            : ""
        );
      } catch (err) {
        console.error("❌ Error al obtener la pregunta:", err);
        setError("Error al cargar la pregunta.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [courseId, questionId]);

  // 🔹 Guardar cambios
  const handleSave = async () => {
    try {
      console.log("🔄 Enviando datos actualizados:", {
        title,
        days,
        hours,
        minutes,
        dueDate,
        content,
      });

      // Aquí luego haces PATCH o PUT
    } catch (error) {
      console.error("❌ Error al actualizar pregunta:", error);
    }
  };

  // --- Renderizado ---
  if (loading)
    return <p className="text-center p-6">Cargando pregunta...</p>;

  if (error)
    return (
      <p className="text-center text-red-500 p-6">{error}</p>
    );

  return (
    <div className="mt-6 px-4 space-y-6">
      {/* Encabezado */}
      <PageHeader columns={[title || `Pregunta ${questionId}`]} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel lateral */}
        <div className="lg:col-span-1">
          <CreditOptionDisplay userName={sidebarName} credits={sidebarCredits} />
        </div>

        {/* Formulario principal */}
        <div className="lg:col-span-3">
          <QuestionForm
            mode="view"
            title={title}
            setTitle={setTitle}
            days={days}
            setDays={setDays}
            hours={hours}
            setHours={setHours}
            minutes={minutes}
            setMinutes={setMinutes}
            dueDate={dueDate}
            setDueDate={setDueDate}
            content={content}
            setContent={setContent}
            onSave={handleSave}
            isPublishedInitial={isPublished}
          />
        </div>
      </div>
    </div>
  );
}
