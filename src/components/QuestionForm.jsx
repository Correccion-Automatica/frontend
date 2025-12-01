import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaClock, FaHourglassHalf, FaPlay } from "react-icons/fa";
import PageHeader from "./PageHeader";
import TextAreaInput from "./TextAreaInput";
import PrimaryToggle from "./PrimaryToggle";
import ButtonPrimary from "./ButtonPrimary";
import { api } from "../lib/axios";

/* --------------------------------------------------------
 * Función: calcular fecha de cierre automáticamente
 * -------------------------------------------------------- */
function getEndDateLabel(startDateIso, days, hours, minutes) {
  if (!startDateIso) return null;

  const start = new Date(startDateIso);
  if (Number.isNaN(start.getTime())) return null;

  const totalMinutes =
    (Number(days) || 0) * 24 * 60 +
    (Number(hours) || 0) * 60 +
    (Number(minutes) || 0);

  if (totalMinutes <= 0) return null;

  const end = new Date(start.getTime() + totalMinutes * 60 * 1000);

  return end.toLocaleString("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function QuestionForm({
  title,
  setTitle,
  days,
  setDays,
  hours,
  setHours,
  minutes,
  setMinutes,
  dueDate,
  setDueDate,
  content,
  setContent,
  mode = "view",
  pautaCost = 1000,
  userCredits = 1000000,
  isPublishedInitial = false,
}) {
  const { courseId, questionId } = useParams();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(mode === "create");
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [guidelineId, setGuidelineId] = useState(null);
  const [isPublished, setIsPublished] = useState(isPublishedInitial);
  const [publishMessage, setPublishMessage] = useState("");

  const readOnly = !isEditing;
  const endDateLabel = getEndDateLabel(dueDate, days, hours, minutes);

  /* --------------------------------------------------------
   * 1) Buscar guideline asociada a la pregunta
   * -------------------------------------------------------- */
  useEffect(() => {
    const fetchGuidelines = async () => {
      try {
        const res = await api.get("/guidelines");
        if (!Array.isArray(res.data)) return;

        const found = res.data.find(
          (g) => String(g.questionId) === String(questionId)
        );

        if (found) setGuidelineId(found.id);
      } catch (err) {
        console.error("❌ Error obteniendo guidelines:", err);
      }
    };

    fetchGuidelines();
  }, [questionId]);

  /* --------------------------------------------------------
   * 2) Descargar PDF de pauta
   * -------------------------------------------------------- */
  const handleDownloadPDF = async () => {
    if (!guidelineId) return;

    try {
      const res = await api.get(`/guidelines/generatePDF/${guidelineId}`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Pauta - ${title}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Error descargando PDF:", err);
    }
  };

  /* --------------------------------------------------------
   * 3) Publicar / Despublicar pregunta
   * -------------------------------------------------------- */
  const handleTogglePublish = async () => {
    try {
      const newStatus = !isPublished;

      await api.patch(`/questions/${questionId}`, {
        isPublished: newStatus,
      });

      setIsPublished(newStatus);
      setPublishMessage(
        newStatus
          ? "Pregunta publicada correctamente."
          : "Pregunta despublicada correctamente."
      );

      setTimeout(() => setPublishMessage(""), 4000);
    } catch (err) {
      console.error("❌ Error al publicar/despublicar:", err);
    }
  };

  /* --------------------------------------------------------
   * 4) PATCH guardar pregunta
   * -------------------------------------------------------- */
  const handleSave = async () => {
    try {
      const durationSeconds =
        (Number(days) || 0) * 24 * 3600 +
        (Number(hours) || 0) * 3600 +
        (Number(minutes) || 0) * 60;

      // Calculamos el endDatetime real
      let endDatetime = null;
      if (dueDate && durationSeconds > 0) {
        const start = new Date(dueDate);
        if (!Number.isNaN(start.getTime())) {
          const end = new Date(start.getTime() + durationSeconds * 1000);
          endDatetime = end.toISOString();
        }
      }

      let body = {
        duration: durationSeconds,
        endDatetime,
      };

      if (!guidelineId) {
        body.title = title;
        body.content = content;
      }

      await api.patch(`/questions/${questionId}`, body);

      setShowSuccessBanner(true);
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Error al actualizar pregunta:", err);
    }
  };

  return (
    <div className="mt-6 px-4 space-y-8 relative">

      {/* BOTONES SUPERIORES */}
      {mode === "view" && !isEditing && (
        <div className="absolute top-[-20px] right-[30px] flex flex-col gap-2 items-end">
          <ButtonPrimary onClick={() => setIsEditing(true)}>
            ✏️ Editar
          </ButtonPrimary>

          <Link to={`/teacher-profile/course-view/${courseId}/question/${questionId}/answers`}>
            <ButtonPrimary className="bg-gray-600 hover:bg-gray-700">
              🔍 Ver respuestas
            </ButtonPrimary>
          </Link>
        </div>
      )}

      {/* BANNER GUARDADO */}
      {showSuccessBanner && (
        <div className="max-w-3xl mx-auto mt-2 text-center p-3 rounded-xl bg-green-100 text-green-700 border border-green-300 font-medium">
          🎉 Pregunta guardada correctamente
        </div>
      )}

      {/* BANNER PUBLICAR */}
      {publishMessage && (
        <div className="max-w-3xl mx-auto mt-2 text-center p-3 rounded-xl bg-blue-100 text-blue-700 border border-blue-300 font-medium">
          {publishMessage}
        </div>
      )}

      {/* CARD PRINCIPAL */}
      <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md space-y-8">

        {/* TÍTULO */}
        <TextAreaInput
          label="Título de la pregunta"
          value={title}
          onChange={setTitle}
          readOnly={readOnly || guidelineId}
        />

        {/* DURACIÓN */}
        <div className="text-center">
          <h2 className="text-md font-semibold mb-4">Duración</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <PrimaryToggle label="Días" value={days} onChange={setDays} range={31} readOnly={readOnly} />
            <PrimaryToggle label="Horas" value={hours} onChange={setHours} range={23} readOnly={readOnly} />
            <PrimaryToggle label="Minutos" value={minutes} onChange={setMinutes} range={59} readOnly={readOnly} />
          </div>
        </div>

        {/* FECHA */}
        <div className="text-center">
          <h2 className="text-md font-semibold mb-4">Fecha y hora de inicio</h2>

          {readOnly ? (
            <p className="text-[var(--color-muted)]">
              {dueDate ? new Date(dueDate).toLocaleString("es-CL") : "No definida"}
            </p>
          ) : (
            <input
              type="datetime-local"
              value={dueDate || ""}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="p-2 rounded-md border bg-[var(--color-background)]"
            />
          )}
        </div>

        {/* FECHA DE CIERRE */}
        <div className="rounded-xl border bg-blue-50 px-4 py-3 shadow-sm flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
            <FaClock />
          </div>
          <div>
            <p className="text-xs font-semibold text-blue-700 uppercase">La actividad se cierra</p>
            <p className="text-sm font-bold text-blue-900">
              {endDateLabel || "Define inicio y duración para calcular el cierre"}
            </p>
          </div>
        </div>

        {/* 💬 CONTENIDO */}
        <TextAreaInput
          label="Contenido de la pregunta"
          value={content}
          onChange={setContent}
          readOnly={readOnly || guidelineId}
        />

        {/* PAUTA + PUBLICAR (igual que en código 1) */}
        <div className="flex justify-center gap-4 pt-4">
          {guidelineId ? (
            <ButtonPrimary onClick={handleDownloadPDF}>📄 Descargar pauta</ButtonPrimary>
          ) : (
            <Link
              to={`/teacher-profile/course-view/${courseId}/question/${questionId}/create-guideline`}
            >
              <ButtonPrimary>⚙️ Generar pauta</ButtonPrimary>
            </Link>
          )}

          <ButtonPrimary
            onClick={handleTogglePublish}
            className={`${isPublished ? "bg-red-600 hover:bg-red-700" : ""}`}
          >
            {isPublished ? "📤 Despublicar" : "📢 Publicar"}
          </ButtonPrimary>
        </div>

        {/* GUARDAR */}
        {!readOnly && (
          <div className="flex justify-end gap-4 pt-4">
            <Link to={`/teacher-profile/course-view/${courseId}`}>
              <ButtonPrimary>Cancelar</ButtonPrimary>
            </Link>

            <ButtonPrimary onClick={handleSave}>Guardar Pregunta</ButtonPrimary>
          </div>
        )}
      </div>
    </div>
  );
}
