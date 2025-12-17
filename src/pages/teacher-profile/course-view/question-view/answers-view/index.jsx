// src/pages/teacher-profile/course-view/question-view/answers-view/index.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../../../../components/PageHeader";
import CreditOptionDisplay from "../../../../../components/CreditOptionDisplay";
import ButtonPrimary from "../../../../../components/ButtonPrimary";
import { api } from "../../../../../lib/axios";
import { useAuth } from "../../../../../context/AuthProvider";

export default function AnswersView() {
  const { courseId, questionId } = useParams();

  const { user } = useAuth();
  const sidebarCredits = Number(user?.remaining_credits ?? user?.credits ?? 0);
  const sidebarName = user?.fullName || user?.name || "Usuario";

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [guidelineId, setGuidelineId] = useState(null);

  // ✅ Recorrections: map por answerId
  const [recorrectionByAnswerId, setRecorrectionByAnswerId] = useState({});

  // ✅ Form de recorrección por answerId
  const [recorrectionForm, setRecorrectionForm] = useState({});
  const [savingRecorrection, setSavingRecorrection] = useState({});
  const [recorrectionMsg, setRecorrectionMsg] = useState({});

  const [loading, setLoading] = useState(true);
  const [correctingAll, setCorrectingAll] = useState(false);
  const [error, setError] = useState(null);

  // ✅ UI state (lista estudiantes)
  const [nameQuery, setNameQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);

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

        // Preselección: primera respuesta si existe
        if (answersData.length > 0) {
          setSelectedAnswerId(Number(answersData[0].id));
        } else {
          setSelectedAnswerId(null);
        }

        // ---- Usuarios ----
        const users = await api.get("/users/all");
        const map = {};
        (users.data || []).forEach((u) => {
          map[u.id] = u.fullName;
        });
        setUsersMap(map);

        // ---- Recorrections ----
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
    } catch (err) {
      console.error("❌ Error corrigiendo:", err);
      alert("Hubo un error corrigiendo las respuestas.");
    } finally {
      setCorrectingAll(false);
    }
  };

  /* ---------------------------------------------------------
   * 4) Promedio de notas + helpers
   * --------------------------------------------------------- */
  const gradedAnswers = useMemo(() => {
    return answers
      .map((a) => {
        const r = recorrectionByAnswerId[Number(a.id)];

        // Si hay recorrección resuelta, esa nota manda
        const g =
          r && r.newGrade !== null && r.newGrade !== undefined ? r.newGrade : a.grade;

        const n = Number(g);
        return Number.isFinite(n) ? n : null;
      })
      .filter((n) => n !== null);
  }, [answers, recorrectionByAnswerId]);

  const avgGrade = useMemo(() => {
    if (gradedAnswers.length === 0) return "__";
    const sum = gradedAnswers.reduce((acc, n) => acc + n, 0);
    return (sum / gradedAnswers.length).toFixed(2);
  }, [gradedAnswers]);

  const gradedCount = gradedAnswers.length;

  const allGraded = useMemo(() => {
    if (answers.length === 0) return false;
    return gradedCount === answers.length;
  }, [answers.length, gradedCount]);

  const isRecorrectionPending = (answerId) => {
    const r = recorrectionByAnswerId[Number(answerId)];
    return Boolean(r && r.answerId && r.newGrade === null);
  };


  /* ---------------------------------------------------------
   * 5) Recorrección handlers
   * --------------------------------------------------------- */
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

      // ✅ actualizar nota visible en la respuesta
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
   * 6) Lista estudiantes: filtrar (solo nombre) + paginar
   * --------------------------------------------------------- */
  const studentRows = useMemo(() => {
    const q = (nameQuery || "").trim().toLowerCase();

    return answers
      .map((ans) => {
        const name = usersMap[ans.userId] || `Alumno #${ans.userId}`;
        const r = recorrectionByAnswerId[Number(ans.id)];

        const pending = Boolean(r && r.answerId && r.newGrade === null);

        // Si hay recorrección resuelta, esa nota manda
        const gradeToShow =
          r && r.newGrade !== null && r.newGrade !== undefined
            ? r.newGrade
            : ans.grade;

        const gradeLabel =
          gradeToShow === null || gradeToShow === undefined
            ? "—"
            : Number(gradeToShow).toFixed(2);

        return {
          id: Number(ans.id),
          userId: ans.userId,
          name,
          pending,
          gradeLabel,
          hasGrade: gradeToShow !== null && gradeToShow !== undefined,
        };
      })
      .filter((row) => {
        if (!q) return true;
        return String(row.name || "").toLowerCase().includes(q);
      });
  }, [answers, usersMap, recorrectionByAnswerId, nameQuery]);

  const total = studentRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const startIdx = (pageSafe - 1) * pageSize;
  const pageItems = studentRows.slice(startIdx, startIdx + pageSize);

  useEffect(() => {
    setPage(1);
  }, [nameQuery, pageSize]);

  // Mantener selección “válida” cuando cambia el filtro
  useEffect(() => {
    if (!selectedAnswerId) {
      if (pageItems.length > 0) setSelectedAnswerId(pageItems[0].id);
      return;
    }
    const exists = answers.some((a) => Number(a.id) === Number(selectedAnswerId));
    if (!exists && pageItems.length > 0) setSelectedAnswerId(pageItems[0].id);
  }, [answers, selectedAnswerId, pageItems]);

  const selectedAnswer = useMemo(() => {
    if (!selectedAnswerId) return null;
    return answers.find((a) => Number(a.id) === Number(selectedAnswerId)) || null;
  }, [answers, selectedAnswerId]);

  const selectedRecorrection = useMemo(() => {
    if (!selectedAnswer) return null;
    return recorrectionByAnswerId[Number(selectedAnswer.id)] || null;
  }, [selectedAnswer, recorrectionByAnswerId]);

  const selectedName = useMemo(() => {
    if (!selectedAnswer) return "";
    return usersMap[selectedAnswer.userId] || `Alumno #${selectedAnswer.userId}`;
  }, [selectedAnswer, usersMap]);

  /* ---------------------------------------------------------
   * Render
   * --------------------------------------------------------- */
  if (loading) {
    return <p className="text-center mt-10 text-(--color-muted)">Cargando...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="mt-6 px-4 space-y-6">
      <PageHeader
        columns={[
          question?.title
            ? `Respuestas — ${question.title}`
            : `Respuestas — Pregunta ${questionId}`,
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* IZQUIERDA: sticky (acompaña) */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24 self-start">
          <CreditOptionDisplay userName={sidebarName} credits={sidebarCredits} />

          {/* Lista estudiantes */}
          <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-(--color-border)">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h3 className="font-semibold">Estudiantes</h3>
                  <p className="text-xs text-(--color-muted) mt-1">
                    Busca por nombre y selecciona.
                  </p>
                </div>

                <div className="text-right">
                  <label className="block text-[11px] font-semibold text-(--color-muted) mb-1">
                    Mostrar
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="rounded-xl border border-(--color-border) bg-(--color-background) px-3 py-2 text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                  </select>
                </div>
              </div>

              <div className="mt-3 relative">
                <input
                  value={nameQuery}
                  onChange={(e) => setNameQuery(e.target.value)}
                  className="w-full rounded-xl border border-(--color-border) bg-(--color-background) p-2 text-sm pr-9"
                  placeholder="Buscar por nombre…"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--color-muted) text-sm">
                  ⌕
                </span>
              </div>
            </div>

            {/* ✅ Altura dinámica según viewport */}
            <div className="max-h-[calc(100vh-260px)] overflow-auto">
              <table className="w-full text-sm table-fixed">
                <thead className="sticky top-0 bg-(--color-surface) border-b border-(--color-border)">
                  <tr className="text-left">
                    <th className="p-3 font-semibold w-[50%]">Nombre</th>
                    <th className="p-3 font-semibold w-[15%]">Nota</th>
                    <th className="p-3 font-semibold w-[35%] text-right">Estado</th>
                  </tr>

                </thead>

                <tbody>
                  {pageItems.map((r) => {
                    const isSelected = Number(selectedAnswerId) === Number(r.id);

                    return (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedAnswerId(Number(r.id))}
                        className={`cursor-pointer border-b border-(--color-border)
                          ${isSelected
                            ? "bg-green-50"
                            : "hover:bg-(--color-background)"
                          }`}
                      >
                        <td className="p-3 min-w-0">
                          <div className="font-semibold truncate">{r.name}</div>
                          <div className="text-[11px] text-(--color-muted)">
                            User #{r.userId}
                          </div>
                        </td>

                        <td className="p-3">
                          <span className="font-semibold">{r.gradeLabel}</span>
                        </td>

                        <td className="p-3 text-right">
                          {r.pending ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 border border-red-200 px-2 py-1 text-[11px] font-semibold">
                              ❗ Recorrección
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-2 py-1 text-[11px] font-semibold">
                              {r.hasGrade ? "✅ Corregida" : "⏳ Sin nota"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {pageItems.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-6 text-center text-(--color-muted)">
                        No hay resultados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="p-4 border-t border-(--color-border) flex flex-col gap-2">
              <div className="text-xs text-(--color-muted)">
                Mostrando{" "}
                <span className="font-semibold">{total === 0 ? 0 : startIdx + 1}</span>
                –
                <span className="font-semibold">
                  {Math.min(total, startIdx + pageSize)}
                </span>{" "}
                de <span className="font-semibold">{total}</span>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pageSafe <= 1}
                  className="px-3 py-2 rounded-xl border border-(--color-border)
                    bg-(--color-background) text-sm disabled:opacity-40
                    hover:bg-(--color-hover-strong) transition-colors"
                >
                  ◀
                </button>

                <div className="text-sm">
                  <span className="font-semibold">{pageSafe}</span> /{" "}
                  <span className="font-semibold">{totalPages}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={pageSafe >= totalPages}
                  className="px-3 py-2 rounded-xl border border-(--color-border)
                    bg-(--color-background) text-sm disabled:opacity-40
                    hover:bg-(--color-hover-strong) transition-colors"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DERECHA */}
        <div className="lg:col-span-8 space-y-4">
          {/* Resumen / acciones */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Resumen */}
            <div className="lg:col-span-2 bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold">Resumen</h2>
                  <p className="text-sm text-(--color-muted) mt-1">
                    Progreso y estado de correcciones.
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm text-(--color-muted)">Promedio</div>
                  <div className="text-2xl font-bold">
                    {avgGrade === "__" ? "—" : `${avgGrade}`}
                    <span className="text-sm font-semibold text-(--color-muted)">
                      {" "}
                      / 10
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-(--color-border) bg-(--color-background) p-4">
                  <div className="text-xs text-(--color-muted)">Respuestas</div>
                  <div className="text-lg font-semibold">
                    {answers.length}/{question?.numStudents || 88}
                  </div>
                </div>

                <div className="rounded-xl border border-(--color-border) bg-(--color-background) p-4">
                  <div className="text-xs text-(--color-muted)">Corregidas</div>
                  <div className="text-lg font-semibold">
                    {gradedAnswers.length}/{answers.length}
                  </div>
                </div>

                <div className="rounded-xl border border-(--color-border) bg-(--color-background) p-4">
                  <div className="text-xs text-(--color-muted)">Hora de finalización</div>
                  <div className="text-sm font-semibold">
                    {question?.endDatetime
                      ? new Date(question.endDatetime).toLocaleString("es-CL", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                      : "Sin fecha"}
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm p-6">
              <h2 className="text-base font-semibold">Acciones</h2>
              <p className="text-sm text-(--color-muted) mt-1">
                Pauta y corrección masiva.
              </p>

              <div className="mt-4 space-y-3">
                {guidelineId ? (
                  <ButtonPrimary onClick={handleDownloadPDF} className="w-full">
                    📄 Descargar pauta
                  </ButtonPrimary>
                ) : (
                  <div className="w-full rounded-xl border border-(--color-border) bg-(--color-background) p-3 text-sm text-(--color-muted)">
                    No hay pauta generada
                  </div>
                )}

                {allGraded ? (
                  <div className="w-full rounded-xl bg-green-50 text-green-800 border border-green-200 p-3 text-sm font-semibold text-center">
                    ✓ Todas corregidas
                  </div>
                ) : (
                  <ButtonPrimary
                    onClick={handleCorrectAll}
                    disabled={correctingAll}
                    className="w-full"
                  >
                    {correctingAll ? "Corrigiendo..." : "Corregir todas"}
                  </ButtonPrimary>
                )}
              </div>
            </div>
          </div>

          {/* Detalle */}
          <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm p-5">
            {!selectedAnswer ? (
              <div className="text-center text-(--color-muted) py-10">
                No hay respuestas para mostrar.
              </div>
            ) : (
              <>
                {/* Header detalle */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-b border-(--color-border) pb-4">
                  <div>
                    <div className="text-sm text-(--color-muted)">Estudiante</div>
                    <div className="text-lg font-semibold">{selectedName}</div>
                    <div className="text-xs text-(--color-muted) mt-1">
                      User #{selectedAnswer.userId} · Answer #{selectedAnswer.id}
                    </div>
                  </div>

                  {isRecorrectionPending(selectedAnswer.id) ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-50 text-red-700 border border-red-200 px-3 py-1 text-xs font-semibold">
                      ❗ Recorrección pendiente
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1 text-xs font-semibold">
                      Sin recorrecciones pendientes
                    </span>
                  )}
                </div>

                {/* ✅ Respuesta (1/3) + Feedback (2/3) */}
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Respuesta */}
                  <div className="lg:col-span-1 rounded-2xl border border-(--color-border) bg-(--color-background) p-4">
                    <h4 className="font-semibold">📘 Respuesta</h4>
                    <div className="mt-3 text-sm whitespace-pre-line max-h-[260px] overflow-auto">
                      {selectedAnswer.content || "(sin respuesta)"}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="lg:col-span-2 rounded-2xl border border-(--color-border) bg-(--color-background) p-4">
                    <h4 className="font-semibold">📝 Feedback</h4>
                    <div className="mt-3 text-sm whitespace-pre-line max-h-[420px] overflow-auto">
                      {selectedAnswer.assistantFeedback || "Sin feedback aún."}
                    </div>
                  </div>
                </div>

                {/* Recorrección */}
                <div className="mt-4 rounded-2xl border border-(--color-border) bg-(--color-background) p-4">
                  <h4 className="font-semibold">🔁 Recorrección</h4>

                  <div className="mt-3 space-y-3">
                    {!selectedRecorrection?.id || !selectedRecorrection?.answerId ? (
                      <div className="text-sm text-(--color-muted)">
                        No hay recorrecciones para esta respuesta.
                      </div>
                    ) : (
                      <>
                        <div className="rounded-xl border border-(--color-border) bg-(--color-surface) p-3">
                          <p className="font-semibold mb-1 text-sm">
                            Solicitud del estudiante:
                          </p>
                          <p className="text-sm whitespace-pre-line">
                            {selectedRecorrection.content || "(sin contenido)"}
                          </p>
                        </div>

                        {selectedRecorrection.newGrade === null ? (
                          <>
                            <div className="grid gap-3 lg:grid-cols-2">
                              <div>
                                <label className="block text-sm font-semibold mb-1">
                                  Nuevo puntaje <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={
                                    recorrectionForm[Number(selectedAnswer.id)]?.newGrade ?? ""
                                  }
                                  onChange={(e) =>
                                    handleRecorrectionInput(
                                      selectedAnswer.id,
                                      "newGrade",
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-2 rounded-xl border border-(--color-border) bg-(--color-surface)"
                                  placeholder="Ej: 8.0"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold mb-1">
                                  Comentarios <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                  value={
                                    recorrectionForm[Number(selectedAnswer.id)]?.teachersFeedback ??
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleRecorrectionInput(
                                      selectedAnswer.id,
                                      "teachersFeedback",
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-2 rounded-xl border border-(--color-border) bg-(--color-surface) min-h-[100px]"
                                  placeholder="Explica la decisión..."
                                />
                              </div>
                            </div>

                            {recorrectionMsg[Number(selectedAnswer.id)] && (
                              <div className="text-sm font-medium">
                                {recorrectionMsg[Number(selectedAnswer.id)]}
                              </div>
                            )}

                            <div className="flex justify-end">
                              <ButtonPrimary
                                onClick={() => handleSubmitRecorrection(selectedAnswer.id)}
                                disabled={Boolean(savingRecorrection[Number(selectedAnswer.id)])}
                              >
                                {savingRecorrection[Number(selectedAnswer.id)]
                                  ? "Guardando..."
                                  : "Realizar recorrección"}
                              </ButtonPrimary>
                            </div>
                          </>
                        ) : (
                          <div className="rounded-xl border border-(--color-border) bg-(--color-surface) p-3">
                            <p className="text-sm">
                              <strong>Nuevo puntaje:</strong>{" "}
                              {selectedRecorrection.newGrade !== null &&
                                selectedRecorrection.newGrade !== undefined
                                ? Number(selectedRecorrection.newGrade).toFixed(2)
                                : "—"}
                            </p>

                            <p className="font-semibold mt-2 text-sm">Comentarios:</p>
                            <p className="text-sm whitespace-pre-line">
                              {selectedRecorrection.teachersFeedback || "—"}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {answers.length === 0 && (
            <p className="text-center text-(--color-muted)">No hay respuestas aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}
