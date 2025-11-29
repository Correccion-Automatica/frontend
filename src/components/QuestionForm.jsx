import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaClock, FaHourglassHalf, FaPlay } from "react-icons/fa";
import PageHeader from "./PageHeader";
import TextAreaInput from "./TextAreaInput";
import PrimaryToggle from "./PrimaryToggle";
import ButtonPrimary from "./ButtonPrimary";
import ConfirmPopup from "./ConfirmPopUp";
import { api } from "../lib/axios";

export default function QuestionForm({
  title, setTitle,
  days, setDays,
  hours, setHours,
  minutes, setMinutes,
  dueDate, setDueDate,
  content, setContent,
  mode = "view",
  userCredits = 1000000,
  pautaCost = 1000,
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

  /* --------------------------------------------------------
   * 1) Buscar guideline
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
   * 2) Descargar PDF
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
   * 3) Publicar / Despublicar
   * -------------------------------------------------------- */
  const handleTogglePublish = async () => {
    try {
      const newStatus = !isPublished;

      await api.patch(`/questions/${questionId}`, {
        isPublished: newStatus,
      });

      setIsPublished(newStatus);
      const msg = newStatus
        ? "Pregunta publicada correctamente."
        : "Pregunta despublicada correctamente.";
      setPublishMessage(msg);

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
        days * 24 * 3600 +
        hours * 3600 +
        minutes * 60;

      let body = {
        duration: durationSeconds,
        endDatetime: dueDate ? new Date(dueDate).toISOString() : null,
      };

      if (!guidelineId) {
        body.title = title;
        body.content = content;
      }

      const res = await api.patch(`/questions/${questionId}`, body);

      setIsEditing(false);
      setShowSuccessBanner(true);

      return res.data;
    } catch (error) {
      console.error("❌ Error al actualizar pregunta:", error);
    }
  };

  return (
    <div className="mt-6 px-4 space-y-8 relative">

      {/* ✏️ EDITAR + 🔍 VER RESPUESTAS */}
      {mode === "view" && !isEditing && (
        <div className="absolute top-[-20px] right-[30px] flex flex-col items-end gap-2">

          <ButtonPrimary onClick={() => setIsEditing(true)}>
            ✏️ Editar
          </ButtonPrimary>

          <Link
            to={`/teacher-profile/course-view/${courseId}/question/${questionId}/answers`}
          >
            <ButtonPrimary className="bg-gray-600 hover:bg-gray-700">
              🔍 Ver respuestas
            </ButtonPrimary>
          </Link>

        </div>
      )}

      {/* 🎉 Banner guardar */}
      {showSuccessBanner && (
        <div className="max-w-3xl mx-auto mt-2 text-center p-3 rounded-xl 
                        bg-green-100 text-green-700 border border-green-300 
                        font-medium animate-fade-in">
          🎉 Pregunta guardada correctamente
        </div>
      )}

      {/* 🔔 Banner publicar/despublicar */}
      {publishMessage && (
        <div className="max-w-3xl mx-auto mt-2 text-center p-3 rounded-xl 
                        bg-blue-100 text-blue-700 border border-blue-300 
                        font-medium animate-fade-in">
          {publishMessage}
        </div>
      )}

      {/* CARD */}
      <div className="max-w-3xl mx-auto p-8 rounded-3xl 
                      bg-[var(--color-surface)] border border-[var(--color-border)] 
                      shadow-md space-y-8">

        {/* TÍTULO */}
        <TextAreaInput
          label="Título de la pregunta"
          value={title}
          onChange={setTitle}
          readOnly={readOnly || guidelineId}
        />

        {/* DURACIÓN */}
        <div className="text-center">
          <h2 className="text-md font-semibold mb-4 text-[var(--color-text)]">
            Duración
          </h2>
          <div className="flex justify-center gap-6 flex-wrap">
            <PrimaryToggle label="Días" value={days} onChange={setDays} range={31} readOnly={readOnly} />
            <PrimaryToggle label="Horas" value={hours} onChange={setHours} range={23} readOnly={readOnly} />
            <PrimaryToggle label="Minutos" value={minutes} onChange={setMinutes} range={59} readOnly={readOnly} />
          </div>
        </div>

        {/* FECHA */}
        <div className="text-center">
          <h2 className="text-md font-semibold mb-4 text-[var(--color-text)]">
            Fecha y hora de entrega
          </h2>

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

        {/* CONTENIDO */}
        <TextAreaInput
          label="Contenido de la pregunta"
          value={content}
          onChange={setContent}
          readOnly={readOnly || guidelineId}
        />

        {/* PAUTA + PUBLICAR */}
        <div className="flex justify-center gap-4 pt-4">

          {guidelineId ? (
            <ButtonPrimary onClick={handleDownloadPDF}>
              📄 Descargar pauta
            </ButtonPrimary>
          ) : (
            <Link to={`/teacher-profile/course-view/${courseId}/question/${questionId}/create-guideline`}>
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

            <ButtonPrimary onClick={handleSave}>
              Guardar Pregunta
            </ButtonPrimary>
          </div>
        )}
      </div>
    </div>
  );
}
