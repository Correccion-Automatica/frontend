// src/pages/teacher-profile/course-view/index.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import PageHeader from "../../../components/PageHeader";
import TableSimpleInCardTeacher from "../../../components/TableSimpleInCardTeacher";
import CreditOptionDisplay from "../../../components/CreditOptionDisplay";
import ButtonPrimary from "../../../components/ButtonPrimary";
import { api } from "../../../lib/axios";
import { useAuth } from "../../../context/AuthProvider";

export default function TeacherCourseView() {
  const { courseId } = useParams();
  const location = useLocation();
  const { courseName, courseCode, coursePeriod } = location.state || {};
  const { user } = useAuth();
  const sidebarCredits = Number(user?.remaining_credits ?? user?.credits ?? 0);
  const sidebarName = user?.fullName || user?.name || "Usuario";

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { header: "Título", accessor: "title" },
    { header: "Entrega", accessor: "dueDate" },
    { header: "Estado", accessor: "status" },
    { header: "Respuestas", accessor: "answers" },
    { header: "Recorrecciones", accessor: "recorrectionsStatus" },
  ];

  const handleQuestionDeleted = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Preguntas del curso
        const res = await api.get(`/questions/${courseId}`);
        const courseQuestions = res.data || [];

        // ✅ Si no hay preguntas, no llamamos answers ni recorrections
        if (courseQuestions.length === 0) {
          setQuestions([]);
          return;
        }

        // 2) answers/all para mapear answerId -> questionId
        const answersRes = await api.get("/answers/all");
        const allAnswers = answersRes.data || [];

        const answerIdToQuestionId = new Map();
        for (const a of allAnswers) {
          if (a?.id == null || a?.questionId == null) continue;
          answerIdToQuestionId.set(Number(a.id), Number(a.questionId));
        }

        // 3) recorrections pendientes (newGrade === null)
        let recs = [];
        try {
          const recRes = await api.get("/recorrection");
          recs = recRes.data || [];
        } catch (err) {
          const status = err?.response?.status;
          // ✅ 404 = no hay recorrecciones, lo tratamos como vacío
          if (status === 404) recs = [];
          else throw err;
        }

        const questionsWithPendingRecorrections = new Set();
        for (const r of recs) {
          if (!r?.answerId) continue;
          if (r.newGrade !== null && r.newGrade !== undefined) continue;

          const qId = answerIdToQuestionId.get(Number(r.answerId));
          if (qId != null) questionsWithPendingRecorrections.add(Number(qId));
        }

        // 4) Formateo final (✅ fecha + hora)
      const formatted = courseQuestions.map((q) => {
        const hasPending = questionsWithPendingRecorrections.has(Number(q.id));

        return {
          id: q.id,
          title: q.title || "Sin título",

          dueDate: q.endDatetime
            ? new Date(q.endDatetime).toLocaleString("es-CL", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "Sin fecha",

          endDatetimeRaw: q.endDatetime || null,

          status: q.isPublished ? "PUBLICADA" : "SIN PUBLICAR",
          answers: String(q.numAnswers ?? 0),

          // ✅ FLAG PARA LA TABLA
          hasPendingRecorrections: hasPending,

          recorrectionsStatus: hasPending ? (
            <span
              title="Tienes recorrecciones pendientes"
              className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2 py-1 text-[11px] font-semibold"
            >
              ❗ Pendiente
            </span>
          ) : (
            <span
              title="Sin recorrecciones pendientes"
              className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-800 px-2 py-1 text-[11px] font-semibold"
            >
              ✅ Ok
            </span>
          ),
        };
      });


        setQuestions(formatted);
      } catch (err) {
        console.error("❌ Error al obtener preguntas:", err);
        setError("No se pudieron cargar las preguntas.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [courseId]);

  return (
    <div className="mt-6 px-4 space-y-6">
      <PageHeader
        columns={[
          courseName
            ? `${courseName} (${courseCode}) - ${coursePeriod}`
            : `Curso ${courseId}`,
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <CreditOptionDisplay userName={sidebarName} credits={sidebarCredits} />

          {/* CTA recomendado en sidebar */}
          <Link to={`/teacher-profile/course-view/${courseId}/create-question`}>
            <ButtonPrimary className="w-full">➕ Crear nueva pregunta</ButtonPrimary>
          </Link>
        </div>

        {/* Main */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <p className="text-center text-(--color-muted)">Cargando preguntas...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : questions.length > 0 ? (
            <TableSimpleInCardTeacher
              columns={columns}
              data={questions}
              basePath={`/teacher-profile/course-view/${courseId}/question`}
              onDeleted={handleQuestionDeleted}
              backTo={`/teacher-profile/course-view/${courseId}`}
            />
          ) : (
            <p className="text-center text-(--color-muted)">
              No hay preguntas creadas para este curso aún.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
