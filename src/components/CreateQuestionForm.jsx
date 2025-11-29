import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TextAreaInput from "./TextAreaInput";
import PrimaryToggle from "./PrimaryToggle";
import ButtonPrimary from "./ButtonPrimary";

export default function CreateQuestionForm({
  title, setTitle,
  days, setDays,
  hours, setHours,
  minutes, setMinutes,
  dueDate, setDueDate,
  content, setContent,
  onSave,
  loading = false,
}) {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const handleCreate = async () => {
    const created = await onSave();
    if (!created?.id) return;

    // 🔄 Redirigir a la vista de pregunta
    navigate(`/teacher-profile/course-view/${courseId}/question/${created.id}`);
  };

  return (
    <div className="mt-6 px-4 space-y-8 relative">
      {/* CARD */}
      <div
        className="max-w-3xl mx-auto p-8 rounded-3xl 
                   bg-[var(--color-surface)] border border-[var(--color-border)] 
                   shadow-md space-y-8"
      >
        {/* TÍTULO */}
        <TextAreaInput
          label="Título de la pregunta"
          value={title}
          onChange={setTitle}
        />

        {/* DURACIÓN */}
        <div className="text-center">
          <h2 className="text-md font-semibold mb-4 text-[var(--color-text)]">
            Duración
          </h2>

          <div className="flex justify-center gap-6 flex-wrap">
            <PrimaryToggle
              label="Días"
              value={days}
              onChange={setDays}
              range={31}
            />
            <PrimaryToggle
              label="Horas"
              value={hours}
              onChange={setHours}
              range={23}
            />
            <PrimaryToggle
              label="Minutos"
              value={minutes}
              onChange={setMinutes}
              range={59}
            />
          </div>
        </div>

        {/* FECHA LIMITE */}
        <div className="text-center">
          <h2 className="text-md font-semibold mb-4 text-[var(--color-text)]">
            Fecha y hora de entrega
          </h2>

          <input
            type="datetime-local"
            value={dueDate || ""}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="p-2 rounded-md border bg-[var(--color-background)]"
          />
        </div>

        {/* CONTENIDO */}
        <TextAreaInput
          label="Contenido de la pregunta"
          value={content}
          onChange={setContent}
        />

        {/* BOTONES */}
        <div className="flex justify-end gap-4 pt-4">
          <Link to={`/teacher-profile/course-view/${courseId}`}>
            <ButtonPrimary>Cancelar</ButtonPrimary>
          </Link>

          <ButtonPrimary onClick={handleCreate} disabled={loading}>
            {loading ? "Creando..." : "Crear Pregunta"}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
