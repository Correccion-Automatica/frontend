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
  const [answers, setAnswers] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [guidelineId, setGuidelineId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [correctingAll, setCorrectingAll] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------------------------------------------------
   * 1) Cargar pregunta + pauta + answers + usuarios
   * --------------------------------------------------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // ---- Preguntas ----
        const res = await api.get(`/questions/${courseId}`);
        const found = res.data.find((q) => q.id === Number(questionId));
        if (!found) {
          setError("No se encontró la pregunta solicitada.");
          return;
        }
        setQuestion(found);

        // ---- Guidelines ----
        const gl = await api.get("/guidelines");
        const gFound = gl.data.find(
          (g) => Number(g.questionId) === Number(questionId)
        );
        if (gFound) setGuidelineId(gFound.id);

        // ---- Answers ----
        const ans = await api.get(`/answers/${questionId}/teacher`);
        setAnswers(ans.data || []);

        // ---- Usuarios (para nombres) ----
        const users = await api.get("/users/all");
        const map = {};
        users.data.forEach((u) => {
          map[u.id] = u.fullName;
        });
        setUsersMap(map);

      } catch (err) {
        console.error("❌ Error:", err);
        setError("Error al cargar la información.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId, questionId]);

  /* ---------------------------------------------------------
   * 2) Descargar pauta
   * --------------------------------------------------------- */
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
      a.download = `Pauta - ${question.title}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Error al descargar pauta:", error);
    }
  };

  /* ---------------------------------------------------------
   * 3) Corregir TODAS las respuestas
   * --------------------------------------------------------- */
  const handleCorrectAll = async () => {
    try {
      setCorrectingAll(true);

      for (const ans of answers) {
        await api.patch("/answers/correction", {
          students_answer: ans.content,
          questionId: Number(questionId),
          answerId: ans.id,
        });
      }

      alert("✔ Todas las respuestas fueron corregidas.");
    } catch (err) {
      console.error("❌ Error corrigiendo:", err);
      alert("Hubo un error corrigiendo las respuestas.");
    } finally {
      setCorrectingAll(false);
    }
  };

  /* ---------------------------------------------------------
   * 4) Promedio de notas
   * --------------------------------------------------------- */
  const gradedAnswers = answers.filter((a) => a.grade !== null);
  const avgGrade =
    gradedAnswers.length > 0
      ? (gradedAnswers.reduce((sum, a) => sum + a.grade, 0) / gradedAnswers.length).toFixed(1)
      : "__";

  const allGraded = answers.length > 0 && gradedAnswers.length === answers.length;

  /* ---------------------------------------------------------
   * Render
   * --------------------------------------------------------- */
  if (loading)
    return <p className="text-center mt-10 text-[var(--color-muted)]">Cargando...</p>;

  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="mt-6 px-4 space-y-6">
      <PageHeader columns={[`Preguntas profesor curso ${courseId}`]} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <div className="lg:col-span-1">
          <CreditOptionDisplay userName="Carolina" credits={50} />
        </div>

        <div className="lg:col-span-3 space-y-4">

          {/* Header */}
          <div className="flex items-center justify-between bg-[var(--color-surface)] p-4 rounded-xl shadow-sm border border-[var(--color-border)]">
            <BackButton to={`/teacher-profile/course-view/${courseId}`} />
            <div className="text-center flex-1 font-semibold text-lg">
              {question?.courseTitle || "Curso"}
            </div>
            <div className="text-[var(--color-muted)] text-sm">
              {question?.teacher || "Profesor(a)"}
            </div>
          </div>

          {/* CARD PRINCIPAL */}
          <div className="max-w-2xl mx-auto p-8 rounded-3xl 
                          bg-[var(--color-surface)] border border-[var(--color-border)] 
                          shadow-md text-center"
          >
            <h2 className="text-xl font-bold mb-2">
              Pregunta {question?.title || "-"}
            </h2>

            {/* DATOS */}
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
                  ? `${Math.floor(question.duration / 60)} min`
                  : "—"}
              </span>

              <span className={`font-semibold ${
                question?.isPublished ? "text-green-600" : "text-red-500"
              }`}>
                {question?.isPublished ? "PUBLICADA" : "NO PUBLICADA"}
              </span>
            </div>

            {/* PAUTA */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {guidelineId ? (
                <ButtonPrimary onClick={handleDownloadPDF}>
                  📄 Descargar pauta
                </ButtonPrimary>
              ) : (
                <span className="text-[var(--color-muted)]">No hay pauta generada</span>
              )}
            </div>

            {/* PROGRESO */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <p>
                Calificación promedio: <strong>{avgGrade} /10</strong>
              </p>
              <p>
                Respuestas:{" "}
                <strong>{answers.length}/{question?.numStudents || 88}</strong>
              </p>
            </div>

            {/* BOTONES */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">

              {allGraded ? (
                <div className="px-4 py-2 bg-green-200 text-green-800 rounded-xl font-semibold">
                  ✓ Todas las respuestas fueron corregidas
                </div>
              ) : (
                <ButtonPrimary onClick={handleCorrectAll} disabled={correctingAll}>
                  {correctingAll ? "Corrigiendo..." : "Corregir todas las respuestas"}
                </ButtonPrimary>
              )}
            </div>
          </div>

    {/* LISTA DE RESPUESTAS */}
    <div className="max-w-2xl mx-auto space-y-4 mt-10">
      
      <h2 className="text-xl font-bold mb-2">
              Todas las respuestas
      </h2>
      {answers.map((ans) => {
        const name = usersMap[ans.userId] || `Alumno #${ans.userId}`;

        return (
          <details
            key={ans.id}
            className="border border-[var(--color-border)] rounded-xl p-4 bg-[var(--color-background)]"
          >
            <summary className="cursor-pointer font-semibold">

              {name}

              {ans.grade !== null && (
                <span className="ml-2 text-[var(--color-primary)]">
                  — Nota: <strong>{ans.grade.toFixed(1)}</strong>
                </span>
              )}
            </summary>

            {/* SUB-SECCIONES */}
            <div className="mt-4 space-y-4">

              {/* RESPUESTA */}
              <details className="border rounded-lg p-3 bg-[var(--color-surface)]">
                <summary className="cursor-pointer font-medium text-sm">
                  📘 Respuesta del estudiante
                </summary>

                <p className="mt-3 p-3 text-sm whitespace-pre-line bg-[var(--color-background)] border rounded-lg">
                  {ans.content}
                </p>
              </details>

              {/* FEEDBACK */}
              <details className="border rounded-lg p-3 bg-[var(--color-surface)]">
                <summary className="cursor-pointer font-medium text-sm">
                  📝 Feedback del profesor
                </summary>

                <p className="mt-3 p-3 text-sm whitespace-pre-line bg-[var(--color-background)] border rounded-lg">
                  {ans.assistantFeedback || "Sin feedback aún."}
                </p>
              </details>

            </div>
          </details>
        );
      })}

      {answers.length === 0 && (
        <p className="text-center text-[var(--color-muted)]">
          No hay respuestas aún.
        </p>
      )}
    </div>

        </div>
      </div>
    </div>
  );
}
