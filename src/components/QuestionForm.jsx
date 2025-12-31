import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FaClock, FaHourglassHalf, FaPlay } from "react-icons/fa";
import TextAreaInput from "./TextAreaInput";
import ConfirmPopup from "./ConfirmPopup";
import PrimaryToggle from "./PrimaryToggle";
import ButtonPrimary from "./ButtonPrimary";
import { api } from "../lib/axios";

/* --------------------------------------------------------
 * Calcula fecha/hora de cierre según inicio + duración
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
  pseudoGuideline = "",
  setPseudoGuideline = () => {},
  onEditingChange = () => {},

  mode = "view", // "view" | "create"

  // ✅ Solo usados en create
  onSave,
  onCancel,
  loading = false,

  // ✅ Solo usado en view
  isPublishedInitial = false,
}) {
  const { courseId, questionId } = useParams();

  const isCreate = mode === "create";

  const [isEditing, setIsEditing] = useState(isCreate);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [guidelineId, setGuidelineId] = useState(null);
  const [isPublished, setIsPublished] = useState(isPublishedInitial);
  const [publishMessage, setPublishMessage] = useState("");

  const [originalValues, setOriginalValues] = useState(null);

  const [isGuidelineGenerating, setIsGuidelineGenerating] = useState(false);
  const [numStudents, setNumStudents] = useState(null);

  const [popup, setPopup] = useState({ open: false, title: "", message: "" });
  const openPopup = (t, m) => setPopup({ open: true, title: t, message: m });
  const closePopup = () => setPopup((p) => ({ ...p, open: false }));

  // ✅ En create siempre se puede editar. En view se bloquea si hay pauta o se está generando.
  const canEditQuestion = isCreate || (!guidelineId && !isGuidelineGenerating);

  // ✅ ReadOnly: si no estás editando, o si (en view) no se puede editar
  const readOnly = !isEditing || !canEditQuestion;

  const endDateLabel = getEndDateLabel(dueDate, days, hours, minutes);

  useEffect(() => {
    setIsPublished(isPublishedInitial);
  }, [isPublishedInitial]);

  useEffect(() => {
    if (isCreate) return;
    const key = `guideline_generating_${String(questionId)}`;
    const isGen = localStorage.getItem(key) === "1";
    setIsGuidelineGenerating(isGen);

    if (isGen) {
      const onceKey = `guideline_popup_generating_seen_${String(questionId)}`;
      if (localStorage.getItem(onceKey) !== "1") {
        localStorage.setItem(onceKey, "1");
        openPopup(
          "⏳ Generando pauta",
          "Tu pauta se está generando. Te avisaremos aquí cuando esté lista."
        );
      }
    }
  }, [isCreate, questionId]);

  // Obtener numStudents una sola vez cuando se monta (solo en modo view)
  useEffect(() => {
    if (isCreate || !courseId || numStudents !== null) return;

    const fetchNumStudents = async () => {
      try {
        const response = await api.get("/courses/user/all");
        const courseFound = (response.data || []).find(
          (item) => Number(item.course?.id) === Number(courseId)
        );
        if (courseFound?.course?.numStudents !== undefined) {
          setNumStudents(courseFound.course.numStudents);
        }
      } catch (err) {
        console.error("Error obteniendo numStudents:", err);
      }
    };

    fetchNumStudents();
  }, [isCreate, courseId, numStudents]);

  useEffect(() => {
    if (isCreate) return;

    let bc;
    try {
      bc = new BroadcastChannel("guideline-status");
      bc.onmessage = (e) => {
        const data = e?.data;
        if (!data) return;
        if (String(data.questionId) !== String(questionId)) return;

        if (data.type === "guideline_created" && data.guidelineId) {
          setGuidelineId(data.guidelineId);
          const key = `guideline_generating_${String(questionId)}`;
          localStorage.removeItem(key);
          setIsGuidelineGenerating(false);

          const onceKey = `guideline_popup_ready_seen_${String(questionId)}`;
          if (localStorage.getItem(onceKey) !== "1") {
            localStorage.setItem(onceKey, "1");
            openPopup(
              "✅ Pauta lista",
              "La pauta ya está disponible. Ya puedes descargarla."
            );
          }
        }

        if (data.type === "guideline_generating") {
          const key = `guideline_generating_${String(questionId)}`;
          localStorage.setItem(key, "1");
          setIsGuidelineGenerating(true);
        }
      };
    } catch (e) {
      console.error("Error configurando BroadcastChannel:", e);
    }

    return () => {
      try {
        bc && bc.close();
      } catch (e) {
        console.error("Error cerrando BroadcastChannel:", e);
      }
    };
  }, [isCreate, questionId]);

  useEffect(() => {
  if (!showSuccessBanner) return;

  const t = setTimeout(() => {
    setShowSuccessBanner(false);
  }, 6000);

  return () => clearTimeout(t);
}, [showSuccessBanner]);

  // ✅ Si estás en view editando y de repente aparece pauta / generating, te saca de edición
  useEffect(() => {
    if (isCreate) return;
    if (!isEditing) return;

    if (!canEditQuestion) {
      setIsEditing(false);
      onEditingChange(false);
    }
  }, [canEditQuestion, isCreate, isEditing, onEditingChange]);

  useEffect(() => {
    if (isCreate) return;

    if (!isEditing) return;
    if (!dueDate) return;

    const parsed = new Date(dueDate);
    if (Number.isNaN(parsed.getTime())) return;

    if (parsed.getTime() < Date.now()) {
      setDueDate("");
    }
  }, [isEditing, isCreate, dueDate, setDueDate]);

  /* --------------------------------------------------------
   * Buscar guideline de la pregunta (solo VIEW)
   * -------------------------------------------------------- */
  useEffect(() => {
    if (isCreate) return;

    const fetchGuidelines = async () => {
      try {
        const res = await api.get("/guidelines");
        if (!Array.isArray(res.data)) return;

        const found = res.data.find(
          (g) => String(g.questionId) === String(questionId)
        );

        if (found) {
          setGuidelineId(found.id);
          const key = `guideline_generating_${String(questionId)}`;
          localStorage.removeItem(key);
          setIsGuidelineGenerating(false);

          const onceKey = `guideline_popup_ready_seen_${String(questionId)}`;
          if (localStorage.getItem(onceKey) !== "1") {
            localStorage.setItem(onceKey, "1");
            openPopup(
              "✅ Pauta lista",
              "La pauta ya está disponible. Ya puedes descargarla desde este botón."
            );
          }
        }
      } catch (err) {
        console.error("❌ Error obteniendo guidelines:", err);
      }
    };

    fetchGuidelines();
  }, [questionId, isCreate]);

  /* --------------------------------------------------------
   * Descargar PDF de pauta (solo VIEW)
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
   * Publicar / Despublicar (solo VIEW)
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
   * Entrar en modo edición (solo VIEW)
   * -------------------------------------------------------- */
  const handleStartEditing = () => {
    if (!canEditQuestion) return;

    setOriginalValues({
      title,
      days,
      hours,
      minutes,
      dueDate,
      content,
      pseudoGuideline,
    });
    setIsEditing(true);
    onEditingChange(true);
  };

  /* --------------------------------------------------------
   * Cancelar edición (solo VIEW)
   * -------------------------------------------------------- */
  const handleCancelEdit = () => {
    if (originalValues) {
      setTitle(originalValues.title);
      setDays(originalValues.days);
      setHours(originalValues.hours);
      setMinutes(originalValues.minutes);
      setDueDate(originalValues.dueDate);
      setContent(originalValues.content);
      setPseudoGuideline(originalValues.pseudoGuideline ?? "");
    }
    setIsEditing(false);
    onEditingChange(false);
  };

  /* --------------------------------------------------------
   * Guardar pregunta (PATCH) (solo VIEW)
   * -------------------------------------------------------- */
  const handleSaveEdit = async () => {
    if (!canEditQuestion) return;

    try {
      if (!dueDate) {
        alert("Debes definir una fecha y hora de inicio válidas.");
        return;
      }
      const chosen = new Date(dueDate);
      if (Number.isNaN(chosen.getTime())) {
        alert("La fecha ingresada no es válida.");
        return;
      }
      if (chosen.getTime() < Date.now()) {
        alert("No puedes configurar una fecha de inicio en el pasado.");
        return;
      }
      const durationSeconds =
        (Number(days) || 0) * 24 * 3600 +
        (Number(hours) || 0) * 3600 +
        (Number(minutes) || 0) * 60;

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
      body.pseudoGuideline = pseudoGuideline?.trim()
        ? pseudoGuideline.trim()
        : null;

      await api.patch(`/questions/${questionId}`, body);

      setShowSuccessBanner(true);
      setIsEditing(false);
      onEditingChange(false);
    } catch (err) {
      console.error("❌ Error al actualizar pregunta:", err);
    }
  };

  return (
    <div className="mt-6 px-4 space-y-8">
      {!isCreate && showSuccessBanner && (
        <div className="max-w-5xl mx-auto mt-2 text-center p-3 rounded-xl bg-green-100 text-green-700 border border-green-300 font-medium">
          🎉 Pregunta guardada correctamente
        </div>
      )}

      {!isCreate && publishMessage && (
        <div className="max-w-5xl mx-auto mt-2 text-center p-3 rounded-xl bg-blue-100 text-blue-700 border border-blue-300 font-medium">
          {publishMessage}
        </div>
      )}

      <div className="max-w-5xl mx-auto p-6 md:p-8 pt-8 md:pt-12 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md space-y-8 relative">
        <div
          className="
            flex justify-end gap-2 sm:gap-3 mb-4
            md:mb-0 md:absolute md:top-4 md:right-4
          "
        >
          {isCreate ? (
            <>
              <ButtonPrimary
                type="button"
                onClick={onCancel}
                className="bg-gray-200 text-[var(--color-text)] hover:bg-gray-300"
                disabled={loading}
              >
                Cancelar
              </ButtonPrimary>

              <ButtonPrimary
                type="button"
                onClick={onSave}
                disabled={loading}
                className="
                  bg-gradient-to-r from-indigo-500 to-blue-500
                  text-white
                  hover:from-indigo-600 hover:to-blue-600
                  px-4 py-2 rounded-xl text-sm shadow-md
                  transition-colors
                "
              >
                {loading ? "Creando..." : "Crear pregunta"}
              </ButtonPrimary>
            </>
          ) : (
            <>
              {mode === "view" && !isEditing && (
                <>
                  {canEditQuestion && (
                    <ButtonPrimary
                      onClick={handleStartEditing}
                      className="
                        bg-gradient-to-r from-indigo-500 to-blue-500
                        text-white
                        hover:from-indigo-600 hover:to-blue-600
                        transition-colors
                      "
                    >
                      ✏️ Editar
                    </ButtonPrimary>
                  )}

                  <Link
                    to={`/teacher-profile/course-view/${courseId}/question/${questionId}/answers`}
                    state={{ numStudents }}
                  >
                    <ButtonPrimary className="bg-slate-600 hover:bg-slate-700">
                      🔍 Ver respuestas
                    </ButtonPrimary>
                  </Link>
                </>
              )}

              {isEditing && (
                <>
                  <ButtonPrimary
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-200 text-[var(--color-text)] hover:bg-gray-300"
                  >
                    Cancelar
                  </ButtonPrimary>

                  <ButtonPrimary
                    type="button"
                    onClick={handleSaveEdit}
                    className="
                      bg-gradient-to-r from-indigo-500 to-blue-500
                      text-white
                      hover:from-indigo-600 hover:to-blue-600
                      px-4 py-2 rounded-xl text-sm shadow-md
                      transition-colors
                    "
                  >
                    Guardar pregunta
                  </ButtonPrimary>
                </>
              )}
            </>
          )}
        </div>

        <TextAreaInput
          label="Título de la pregunta"
          value={title}
          onChange={setTitle}
          readOnly={readOnly || (!!guidelineId && !isCreate)}
          placeholder="Ej: Caso de estudio sobre posicionamiento de marca"
        />

        <section className="space-y-5">
          <header className="space-y-1 text-center md:text-left">
            <h2 className="text-base md:text-lg font-semibold text-[var(--color-text)]">
              Plazo de la actividad
            </h2>
            <p className="text-xs text-[var(--color-muted)]">
              Define desde cuándo estará disponible y cuánto tiempo podrán
              responder.
            </p>
          </header>

          <div className="grid gap-5 md:grid-cols-2">
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
                  min={new Date(
                    Date.now() - new Date().getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .slice(0, 16)}
                  required={isEditing}
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
                  {endDateLabel ||
                    "Completa el inicio y el tiempo para ver la hora de cierre"}
                </p>
              </div>
            </div>

            <p className="text-[0.7rem] sm:text-xs text-blue-800/80 max-w-sm">
              Consejo: suele ser útil dejar unos{" "}
              <span className="font-semibold">1–5 minutos de gracia</span> para
              evitar problemas de conexión.
            </p>
          </div>
        </section>

        <TextAreaInput
          label="Contenido de la pregunta"
          value={content}
          onChange={setContent}
          readOnly={readOnly || (!!guidelineId && !isCreate)}
        />

        {!isCreate && (
          <div className="flex justify-center gap-4 pt-4">
            {guidelineId ? (
              <ButtonPrimary
                onClick={handleDownloadPDF}
                className="bg-slate-600 hover:bg-slate-700"
              >
                📄 Descargar pauta
              </ButtonPrimary>
            ) : isGuidelineGenerating ? (
              <ButtonPrimary
                disabled
                className="bg-slate-300 text-slate-700 cursor-not-allowed"
              >
                ⏳ Generando pauta…
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
              className={isPublished ? "bg-red-600 hover:bg-red-700" : undefined}
            >
              {isPublished ? "📤 Despublicar" : "📢 Publicar"}
            </ButtonPrimary>
          </div>
        )}
      </div>

      <ConfirmPopup
        isOpen={popup.open}
        title={popup.title}
        message={popup.message}
        confirmText="Entendido"
        cancelText="Cerrar"
        onConfirm={closePopup}
        onCancel={closePopup}
      />
    </div>
  );
}
