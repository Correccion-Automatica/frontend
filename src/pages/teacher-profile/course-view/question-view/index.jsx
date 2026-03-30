// src/pages/teacher-profile/question-view/QuestionView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuestionForm from "../../../../components/QuestionForm";
import CreditOptionDisplay from "../../../../components/CreditOptionDisplay";
import PageHeader from "../../../../components/PageHeader";
import { api } from "../../../../lib/axios";
import { useAuth } from "../../../../context/AuthProvider";
import PseudoGuidelineInfo from "../../../../components/PseudoGuidelineInfo";

/**
 * ISO UTC (Z) -> "YYYY-MM-DDTHH:mm" en HORA LOCAL para input datetime-local
 * Ej: "2026-01-24T17:59:00.000Z" -> "2026-01-24T14:59" en Chile (UTC-3)
 */
function isoUtcToDatetimeLocal(isoUtc) {
  if (!isoUtc) return "";
  const d = new Date(isoUtc);
  if (Number.isNaN(d.getTime())) return "";
  const tzOffsetMs = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffsetMs).toISOString().slice(0, 16);
}

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
  const [dueDate, setDueDate] = useState(""); // ✅ En tu UI: INICIO de la actividad (datetime-local)
  const [content, setContent] = useState("");

  const [pseudoGuideline, setPseudoGuideline] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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

        const found = questions.find((q) => q.id === Number(questionId));
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

        setPseudoGuideline(found.pseudoGuideline || "");
        setIsPublished(Boolean(found.isPublished));

        // Duración → días / horas / minutos (duration está en SEGUNDOS en tu backend)
        const duration = Number(found.duration || 0);
        setDays(Math.floor(duration / (24 * 3600)));
        setHours(Math.floor((duration % (24 * 3600)) / 3600));
        setMinutes(Math.floor((duration % 3600) / 60));

        // ✅ IMPORTANTE:
        // Tu input dice "Inicio de la actividad", por lo tanto debe cargar startDatetime.
        // Y como es datetime-local, hay que convertir ISO UTC -> local string.
        setDueDate(isoUtcToDatetimeLocal(found.startDatetime));
      } catch (err) {
        console.error("❌ Error al obtener la pregunta:", err);
        setError("Error al cargar la pregunta.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [courseId, questionId]);

  // 🔹 Guardar cambios (en tu implementación real el PATCH lo hace QuestionForm)
  const handleSave = async () => {
    try {
        title,
        days,
        hours,
        minutes,
        dueDate,
        content,
      });
      // Aquí luego haces PATCH o PUT (pero ahora mismo QuestionForm ya hace el PATCH)
    } catch (error) {
      console.error("❌ Error al actualizar pregunta:", error);
    }
  };

  if (loading) return <p className="text-center p-6">Cargando pregunta...</p>;
  if (error) return <p className="text-center text-red-500 p-6">{error}</p>;

  return (
    <div className="mt-6 px-4 space-y-6">
      <PageHeader columns={[title || `Pregunta ${questionId}`]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24 self-start">
          <CreditOptionDisplay userName={sidebarName} credits={sidebarCredits} />

          <PseudoGuidelineInfo
            value={pseudoGuideline}
            onChange={setPseudoGuideline}
            disabled={!isEditing}
          />
        </div>

        <div className="lg:col-span-8">
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
            pseudoGuideline={pseudoGuideline}
            setPseudoGuideline={setPseudoGuideline}
            onEditingChange={setIsEditing}
          />
        </div>
      </div>
    </div>
  );
}
