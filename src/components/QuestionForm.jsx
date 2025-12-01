import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaClock, FaHourglassHalf, FaPlay } from "react-icons/fa";
import PageHeader from "./PageHeader";
import TextAreaInput from "./TextAreaInput";
import PrimaryToggle from "./PrimaryToggle";
import ButtonPrimary from "./ButtonPrimary";
import ConfirmPopup from "./ConfirmPopUp";
import { api } from "../lib/axios";

/**
 * Calcula la fecha/hora de finalización en base a:
 * - fecha de inicio (startDateIso)
 * - duración en días / horas / minutos
 * Devuelve un string listo para mostrar en es-CL o null si falta info.
 */
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
  dueDate, // ahora lo usamos como INICIO de la actividad
  setDueDate,
  content,
  setContent,
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
  const endDateLabel = getEndDateLabel(dueDate, days, hours, minutes);

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
   *    (solo cambiamos el cálculo del endDatetime)
   * -------------------------------------------------------- */
  const handleSave = async () => {
    try {
      const durationSeconds =
        (Number(days) || 0) * 24 * 3600 +
        (Number(hours) || 0) * 3600 +
        (Number(minutes) || 0) * 60;

      // Calculamos fecha de cierre como inicio + duración
      let endDatetime = null;
      if (dueDate && durationSeconds > 0) {
        const start = new Date(dueDate);
        if (!Number.isNaN(start.getTime())) {
          const end = new Date(start.getTime() + durationSeconds * 1000);
          endDatetime = end.toISOString();
        }
      }

      // Body base (lo que siempre se puede editar)
      let body = {
        duration: durationSeconds,
        endDatetime: endDatetime, // 👈 ahora es derivada, no el dueDate directo
      };

      // Si NO hay guideline → permitir editar todo (igual que antes)
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
      {/* ✏️ EDITAR */}
      {mode === "view" && !isEditing && (
        <div className="absolute top-[-20px] right-[30px]">
          <ButtonPrimary
            onClick={() => setIsEditing(true)}
            className="
              bg-gradient-to-r from-indigo-500 to-blue-500
              text-white
              hover:from-indigo-600 hover:to-blue-600
              transition-colors
            "
          >
            ✏️ Editar
          </ButtonPrimary>
        </div>
      )}

      {/* 🎉 Banner guardar pregunta */}
      {showSuccessBanner && (
        <div className="max-w-3xl mx-auto mt-2 text-center p-3 rounded-xl 
                        bg-green-100 text-green-700 border border-green-300 
                        font-medium animate-fade-in">
          🎉 Pregunta guardada correctamente
        </div>
      )}

      {/* 🔔 Banner publicar / despublicar */}
      {publishMessage && (
        <div className="max-w-3xl mx-auto mt-2 text-center p-3 rounded-xl 
                        bg-blue-100 text-blue-700 border border-blue-300 
                        font-medium animate-fade-in">
          {publishMessage}
        </div>
      )}

      {/* CARD */}
      <div
        className="max-w-3xl mx-auto p-8 rounded-3xl 
                   bg-[var(--color-surface)] border border-[var(--color-border)] 
                   shadow-md space-y-8"
      >
        {/* 📝 TÍTULO */}
        <TextAreaInput
          label="Título de la pregunta"
          value={title}
          onChange={setTitle}
          placeholder="Ej: Caso de estudio sobre posicionamiento de marca"
          readOnly={readOnly || guidelineId} // igual que en código 1
        />

        {/* 🕒 PLAZO DE LA ACTIVIDAD (tiempo + estilos del código 2) */}
        <section className="space-y-5">
          <header className="space-y-1 text-center md:text-left">
            <h2 className="text-base md:text-lg font-semibold text-[var(--color-text)]">
              Plazo de la actividad
            </h2>
            <p className="text-xs text-[var(--color-muted)]">
              Define desde cuándo estará disponible y cuánto tiempo podrán responder.
            </p>
          </header>

          <div className="grid gap-5 md:grid-cols-2">
            {/* 📅 Inicio de la actividad */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-text)]">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm">
                  <FaPlay />
                </span>
                <span>Inicio de la actividad</span>
              </div>

              {!readOnly ? (
                <input
                  type="datetime-local"
                  value={dueDate || ""}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full rounded-xl border border-[var(--color-border)] 
                             bg-[var(--color-background)] px-3 py-2 text-sm 
                             text-[var(--color-text)] outline-none 
                             hover:border-indigo-400 
                             focus:ring-2 focus:ring-indigo-400/80"
                />
              ) : (
                <p className="text-sm text-[var(--color-muted)]">
                  {dueDate
                    ? new Date(dueDate).toLocaleString("es-CL", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "No definido"}
                </p>
              )}
            </div>

            {/* ⏱ Tiempo disponible */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-text)]">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-sm">
                  <FaHourglassHalf />
                </span>
                <span>Tiempo disponible</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <PrimaryToggle
                  label="Días"
                  value={days}
                  onChange={setDays}
                  range={31}
                  readOnly={readOnly}
                />
                <PrimaryToggle
                  label="Horas"
                  value={hours}
                  onChange={setHours}
                  range={23}
                  readOnly={readOnly}
                />
                <PrimaryToggle
                  label="Minutos"
                  value={minutes}
                  onChange={setMinutes}
                  range={59}
                  readOnly={readOnly}
                />
              </div>
            </div>
          </div>

          {/* Tarjeta de finalización: "La actividad se cierra" */}
          <div className="mt-2 rounded-2xl border border-blue-200 bg-blue-50/90 px-4 py-3 shadow-sm flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                <FaClock className="text-lg" />
              </div>
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-blue-700">
                  La actividad se cierra
                </p>
                <p className="text-sm md:text-base font-bold text-blue-900">
                  {endDateLabel
                    ? endDateLabel
                    : "Completa el inicio y el tiempo para ver la hora de cierre"}
                </p>
              </div>
            </div>

            <p className="text-[0.7rem] sm:text-xs text-blue-800/80 max-w-sm">
              Consejo: suele ser útil para preguntas breves, dejar unos{" "}
              <span className="font-semibold">1–5 minutos de gracia</span> en la
              duración para que quienes tengan problemas de conexión alcancen a
              entrar sin estrés.
            </p>
          </div>
        </section>

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
            <ButtonPrimary onClick={handleDownloadPDF}>
              📄 Descargar pauta
            </ButtonPrimary>
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

            <ButtonPrimary
              onClick={handleSave}
              className="
                bg-gradient-to-r from-indigo-500 to-blue-500
                text-white
                hover:from-indigo-600 hover:to-blue-600
                px-4 py-2 rounded-xl text-sm shadow-md
                transition-colors
              "
            >
              Guardar Pregunta
            </ButtonPrimary>
          </div>
        )}
      </div>
    </div>
  );
}
