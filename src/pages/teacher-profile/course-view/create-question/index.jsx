// src/pages/teacher-profile/create-question/index.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import QuestionForm from "../../../../components/QuestionForm";
import CreditOptionDisplay from "../../../../components/CreditOptionDisplay";
import PageHeader from "../../../../components/PageHeader";
import { api } from "../../../../lib/axios";

export default function CreateQuestion() {
  const { courseId } = useParams();

  const [title, setTitle] = useState("");
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧩 Lógica para guardar (POST al backend) —> retorna el objeto creado (con id)
  const handleSave = async () => {
    try {
      setLoading(true);

      const totalDurationSeconds =
        days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60;

      if (!title.trim() || !content.trim()) {
        alert("Por favor completa el título y el contenido de la pregunta.");
        return null;
      }

      const body = {
        title,
        courseId: Number(courseId),
        content, // si tu backend espera objeto, pásalo como { text: content }
        duration: totalDurationSeconds || null,
        endDatetime: dueDate ? new Date(dueDate).toISOString() : null,
      };

      const res = await api.post("/questions", body);
      // 🔙 devolvemos TODO (incluye res.data.id)
      return res.data;
    } catch (err) {
      console.error("❌ Error al crear la pregunta:", err);
      alert("Ocurrió un error al crear la pregunta. Revisa la consola.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 px-4 space-y-6">
      <PageHeader columns={["Crear Pregunta"]} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel lateral */}
        <div className="lg:col-span-1">
          <CreditOptionDisplay userName="Carolina" credits={2500} />
        </div>

        {/* Formulario principal */}
        <div className="lg:col-span-3">
          <QuestionForm
            mode="create"
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
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
  