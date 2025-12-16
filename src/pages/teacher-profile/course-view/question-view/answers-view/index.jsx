// src/pages/teacher-profile/course-view/[...]/question/[...]/answers/index.jsx
import React, { useEffect, useMemo, useState } from "react";
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

  // ✅ Recorrections: map por answerId
  const [recorrectionByAnswerId, setRecorrectionByAnswerId] = useState({});

  // ✅ Form de recorrección por answerId
  const [recorrectionForm, setRecorrectionForm] = useState({}); // { [answerId]: { newGrade: "", teachersFeedback: "" } }
  const [savingRecorrection, setSavingRecorrection] = useState({}); // { [answerId]: boolean }
  const [recorrectionMsg, setRecorrectionMsg] = useState({}); // { [answerId]: string }

  const [loading, setLoading] = useState(true);
  const [correctingAll, setCorrectingAll] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------------------------------------------------
   * 1) Cargar pregunta + pauta + answers + usuarios + recorrections
   * --------------------------------------------------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // ---- Pregunta ----
        const res = await api.get(`/questions/${courseId}`);
        const found = (res.data || []).find((q) => q.id === Number(questionId));
        if (!found) {
          setError("No se encontró la pregunta solicitada.");
          return;
        }
        setQuestion(found);

        // ---- Guideline ----
        const gl = await api.get("/guidelines");
        const gFound = (gl.data || []).find(
          (g) => Number(g.questionId) === Number(questionId)
        );
        if (gFound) setGuidelineId(gFound.id);

        // ---- Answers (teacher) ----
        const ans = await api.get(`/answers/${questionId}/teacher`);
        const answersData = ans.data || [];
        setAnswers(answersData);

        // ---- Usuarios ----
        const users = await api.get("/users/all");
        const map = {};
        (users.data || []).forEach((u) => {
          map[u.id] = u.fullName;
        });
        setUsersMap(map);

        // ---- Recorrections ----
        // GET http://localhost:3002/api/recorrection
        const rec = await api.get("/recorrection");
        const recs = rec.data || [];

        // Mapear por answerId (si viene duplicado, tomamos el último por id)
        const recMap = {};
        for (const r of recs) {
          if (!r?.answerId) continue;
          const key = Number(r.answerId);
          if (!recMap[key] || Number(r.id) > Number(recMap[key].id)) {
            recMap[key] = r;
          }
        }
        setRecorrectionByAnswerId(recMap);

        // Inicializar formulario (solo para recorrecciones pendientes)
        const formInit = {};
        for (const a of answersData) {
          const r = recMap[Number(a.id)];
          if (r && r.newGrade === null) {
            formInit[Number(a.id)] = {
              newGrade: "",
              teachersFeedback: "",
            };
          }
        }
        setRecorrectionForm(formInit);
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
      a.download = `Pauta - ${question?.title || "Pregunta"}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Error al descargar pauta:", error);
    }
  };

  /* ---------------------------------------------------------
   * 3) Corregir TODAS las respuestas (auto)
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

      alert("✔ Todas las respuestas fueron enviadas a corrección.");
      // Nota: si quieres refrescar notas/feedback al terminar, puedes re-fetch de /answers/:questionId/teacher
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
  const gradedAnswers = useMemo(
    () => answers.filter((a) => a.grade !== null && a.grade !== undefined),
    [answers]
  );

  const avgGrade = useMemo(() => {
    if (gradedAnswers.length === 0) return "__";
    const sum = gradedAnswers.reduce((acc, a) => acc + Number(a.grade || 0), 0);
    return (sum / gradedAnswers.length).toFixed(1);
  }, [gradedAnswers]);

  const allGraded = useMemo(() => {
    if (answers.length === 0) return false;
    return gradedAnswers.length === answers.length;
  }, [answers.length, gradedAnswers.length]);

  /* ---------------------------------------------------------
   * 5) Recorrecciones pendientes
   * --------------------------------------------------------- */
  const isRecorrectionPending = (answerId) => {
    const r = recorrectionByAnswerId[Number(answerId)];
    return Boolean(r && r.answerId && r.newGrade === null);
  };

  const handleRecorrectionInput = (answerId, field, value) => {
    const key = Number(answerId);
    setRecorrectionForm((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || { newGrade: "", teachersFeedback: "" }),
        [field]: value,
      },
    }));
  };

  const handleSubmitRecorrection = async (answerId) => {
    const key = Number(answerId);
    const r = recorrectionByAnswerId[key];
    if (!r?.id) return;

    const payload = recorrectionForm[key] || {};
    const newGradeRaw = payload.newGrade;
    const teachersFeedback = (payload.teachersFeedback || "").trim();

    const newGradeNum = Number(newGradeRaw);

    // ✅ Validaciones obligatorias
    if (!Number.isFinite(newGradeNum)) {
      setRecorrectionMsg((prev) => ({
        ...prev,
        [key]: "Debes ingresar un nuevo puntaje válido.",
      }));
      return;
    }
    if (teachersFeedback.length === 0) {
      setRecorrectionMsg((prev) => ({
        ...prev,
        [key]: "Debes ingresar comentarios de recorrección.",
      }));
      return;
    }

    try {
      setSavingRecorrection((prev) => ({ ...prev, [key]: true }));
      setRecorrectionMsg((prev) => ({ ...prev, [key]: "" }));

      // PATCH http://localhost:3002/api/recorrection/recorrection_id
      await api.patch(`/recorrection/${r.id}`, {
        teachersFeedback,
        newGrade: newGradeNum,
      });

      // ✅ actualizar recorrection local
      setRecorrectionByAnswerId((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          teachersFeedback,
          newGrade: newGradeNum,
        },
      }));

      // ✅ (opcional pero útil) actualizar nota visible en la respuesta
      setAnswers((prev) =>
        prev.map((a) =>
          Number(a.id) === key ? { ...a, grade: newGradeNum } : a
        )
      );

      setRecorrectionMsg((prev) => ({
        ...prev,
        [key]: "✅ Recorrección realizada correctamente.",
      }));
    } catch (err) {
      console.error("❌ Error realizando recorrección:", err);
      setRecorrectionMsg((prev) => ({
        ...prev,
        [key]: "❌ Error al realizar la recorrección.",
      }));
    } finally {
      setSavingRecorrection((prev) => ({ ...prev, [key]: false }));
    }
  };

  /* ---------------------------------------------------------
   * Render
   * --------------------------------------------------------- */
  if (loading) {
    return (
      <p className="text-center mt-10 text-[var(--color-muted)]">Cargando...</p>
    );
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

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
          <div
            className="max-w-2xl mx-auto p-8 rounded-3xl 
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

              <span
                className={`font-semibold ${
                  question?.isPublished ? "text-green-600" : "text-red-500"
                }`}
              >
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
                <span className="text-[var(--color-muted)]">
                  No hay pauta generada
                </span>
              )}
            </div>

            {/* PROGRESO */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <p>
                Calificación promedio: <strong>{avgGrade} /10</strong>
              </p>
              <p>
                Respuestas:{" "}
                <strong>
                  {answers.length}/{question?.numStudents || 88}
                </strong>
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
            <h2 className="text-xl font-bold mb-2">Todas las respuestas</h2>

            {answers.map((ans) => {
              const name = usersMap[ans.userId] || `Alumno #${ans.userId}`;
              const pending = isRecorrectionPending(ans.id);
              const r = recorrectionByAnswerId[Number(ans.id)];
              const msg = recorrectionMsg[Number(ans.id)];
              const form = recorrectionForm[Number(ans.id)] || {
                newGrade: "",
                teachersFeedback: "",
              };
              const saving = Boolean(savingRecorrection[Number(ans.id)]);

              // ✅ ÚNICO CAMBIO: si hay recorrección con newGrade != null, mostrar ese valor como nota
              const gradeToShow =
                r && r.newGrade !== null && r.newGrade !== undefined
                  ? r.newGrade
                  : ans.grade;

              return (
                <details
                  key={ans.id}
                  className="border border-[var(--color-border)] rounded-xl p-4 bg-[var(--color-background)]"
                >
                  <summary className="cursor-pointer font-semibold">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span>{name}</span>

                        {gradeToShow !== null && gradeToShow !== undefined && (
                          <span className="text-[var(--color-primary)]">
                            — Nota: <strong>{Number(gradeToShow).toFixed(1)}</strong>
                          </span>
                        )}
                      </div>

                      {/* 🔴 Recorrección pendiente */}
                      {pending && (
                        <span className="inline-flex items-center gap-2 text-red-500 font-semibold text-sm">
                          <span className="text-lg">❗</span>
                          Recorrección pendiente
                        </span>
                      )}
                    </div>
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

                    {/* RECORRECCIÓN */}
                    <details className="border rounded-lg p-3 bg-[var(--color-surface)]">
                      <summary className="cursor-pointer font-medium text-sm">
                        🔁 Recorrección
                      </summary>

                      <div className="mt-3 space-y-3">
                        {/* Si NO hay recorrección asociada */}
                        {!r?.id || !r?.answerId ? (
                          <div className="p-3 text-sm bg-[var(--color-background)] border rounded-lg text-[var(--color-muted)]">
                            No hay recorrecciones pendientes
                          </div>
                        ) : (
                          <>
                            {/* Motivo/content del alumno */}
                            <div className="p-3 text-sm bg-[var(--color-background)] border rounded-lg">
                              <p className="font-semibold mb-1">Solicitud del estudiante:</p>
                              <p className="whitespace-pre-line">
                                {r.content || "(sin contenido)"}
                              </p>
                            </div>

                            {/* Si está pendiente (newGrade null) -> inputs obligatorios */}
                            {r.newGrade === null ? (
                              <>
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <div className="text-left">
                                    <label className="block text-sm font-semibold mb-1">
                                      Nuevo puntaje <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="number"
                                      step="0.1"
                                      value={form.newGrade}
                                      onChange={(e) =>
                                        handleRecorrectionInput(ans.id, "newGrade", e.target.value)
                                      }
                                      className="w-full p-2 rounded-lg border bg-[var(--color-background)]"
                                      placeholder="Ej: 8.0"
                                      required
                                    />
                                  </div>

                                  <div className="text-left">
                                    <label className="block text-sm font-semibold mb-1">
                                      Comentarios de recorrección <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                      value={form.teachersFeedback}
                                      onChange={(e) =>
                                        handleRecorrectionInput(
                                          ans.id,
                                          "teachersFeedback",
                                          e.target.value
                                        )
                                      }
                                      className="w-full p-2 rounded-lg border bg-[var(--color-background)] min-h-[80px]"
                                      placeholder="Explica la decisión..."
                                      required
                                    />
                                  </div>
                                </div>

                                {msg && (
                                  <div className="text-sm font-medium">
                                    {msg}
                                  </div>
                                )}

                                <div className="flex justify-end">
                                  <ButtonPrimary
                                    onClick={() => handleSubmitRecorrection(ans.id)}
                                    disabled={saving}
                                  >
                                    {saving ? "Guardando..." : "Realizar Recorrección"}
                                  </ButtonPrimary>
                                </div>
                              </>
                            ) : (
                              // Si ya fue resuelta (newGrade no null) -> mostrar resultado
                              <div className="p-3 text-sm bg-[var(--color-background)] border rounded-lg">
                                <p className="font-semibold mb-1">Resultado de recorrección:</p>
                                <p className="mb-2">
                                  <strong>Nuevo puntaje:</strong>{" "}
                                  {r.newGrade !== null ? Number(r.newGrade).toFixed(1) : "—"}
                                </p>
                                <p className="font-semibold mb-1">Comentarios:</p>
                                <p className="whitespace-pre-line">
                                  {r.teachersFeedback || "Esperando respuesta"}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
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
