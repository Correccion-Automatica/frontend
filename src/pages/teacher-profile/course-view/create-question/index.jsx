import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionForm from "../../../../components/QuestionForm";
import CreditOptionDisplay from "../../../../components/CreditOptionDisplay";
import PageHeader from "../../../../components/PageHeader";
import { api } from "../../../../lib/axios";
import { useAuth } from "../../../../context/AuthProvider";
import PseudoGuidelineInfo from "../../../../components/PseudoGuidelineInfo";


export default function CreateQuestion() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const sidebarCredits = Number(user?.remaining_credits ?? user?.credits ?? 0);
  const sidebarName = user?.fullName || user?.name || "Usuario";

  const [pseudoGuideline, setPseudoGuideline] = useState("");


  const [title, setTitle] = useState("");
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧩 Lógica POST intacta
  const handleSave = async () => {
    try {
      setLoading(true);

      const totalDurationSeconds =
        days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60;

      if (!title.trim() || !content.trim()) {
        alert("Por favor completa el título y el contenido de la pregunta.");
        return null;
      }
      if (!dueDate) {
        alert("Debes definir una fecha y hora de inicio para la pregunta.");
        return null;
      }
      if (totalDurationSeconds <= 0) {
        alert("Debes definir una duración mayor a 0.");
        return null;
      }

      const body = {
        title,
        courseId: Number(courseId),
        content,
        duration: totalDurationSeconds || null,
        endDatetime: dueDate ? new Date(dueDate).toISOString() : null,
        pseudoGuideline: pseudoGuideline?.trim() ? pseudoGuideline.trim() : null,
      };

      const res = await api.post("/questions", body);
      return res.data;
    } catch (err) {
      console.error("❌ Error al crear la pregunta:", err);
      alert("Ocurrió un error al crear la pregunta. Revisa la consola.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    const created = await handleSave();
    if (!created?.id) return;
    navigate(`/teacher-profile/course-view/${courseId}/question/${created.id}`, { state: { backTo: `/teacher-profile/course-view/${courseId}` }, replace: true, });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="mt-6 px-4 space-y-6">
      <PageHeader columns={["Crear Pregunta"]} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24 self-start">
          <CreditOptionDisplay userName={sidebarName} credits={sidebarCredits} />

          <PseudoGuidelineInfo
            value={pseudoGuideline}
            onChange={setPseudoGuideline}
          />
        </div>

        <div className="lg:col-span-8">
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
            onSave={handleCreate}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
