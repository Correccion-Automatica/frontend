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
    { header: "Fecha de entrega", accessor: "dueDate" },
    { header: "Estado", accessor: "status" },
    { header: "Respuestas", accessor: "answers" },
    // ✅ NUEVA COLUMNA
    { header: "Estado recorrecciones", accessor: "recorrectionsStatus" },
  ];

  const handleQuestionDeleted = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);

        // 1) Traer preguntas del curso
        const res = await api.get(`/questions/${courseId}`);
        const courseQuestions = res.data || [];

        // 2) Traer answers/all para mapear answerId -> questionId
        const answersRes = await api.get("/answers/all");
        const allAnswers = answersRes.data || [];

        const answerIdToQuestionId = new Map();
        for (const a of allAnswers) {
          if (a?.id == null || a?.questionId == null) continue;
          answerIdToQuestionId.set(Number(a.id), Number(a.questionId));
        }

        // 3) Traer recorrections y detectar cuáles están pendientes (newGrade === null)
        const recRes = await api.get("/recorrection");
        const recs = recRes.data || [];

        const questionsWithPendingRecorrections = new Set();
        for (const r of recs) {
          // Pendiente = tiene answerId y newGrade null
          if (!r?.answerId) continue;
          if (r.newGrade !== null && r.newGrade !== undefined) continue;

          const qId = answerIdToQuestionId.get(Number(r.answerId));
          if (qId != null) {
            questionsWithPendingRecorrections.add(Number(qId));
          }
        }

        // 4) Formatear preguntas + estado recorrecciones con tooltip
        const formatted = courseQuestions.map((q) => {
          const hasPending = questionsWithPendingRecorrections.has(Number(q.id));

          return {
            id: q.id,
            title: q.title || "Sin título",
            dueDate: q.endDatetime
              ? new Date(q.endDatetime).toLocaleDateString("es-CL")
              : "Sin fecha",
            status: q.isPublished ? "PUBLICADA" : "BORRADOR",
            answers: `${q.numAnswers || 0}/${q.numStudents || 0}`,

            // ✅ NUEVO CAMPO: ícono + tooltip (title)
            recorrectionsStatus: hasPending ? (
              <span title="Tienes recorrecciones pendientes">❗</span>
            ) : (
              <span title="Sin recorrecciones pendientes">✅</span>
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
        <div className="lg:col-span-1">
          <CreditOptionDisplay userName={sidebarName} credits={sidebarCredits} />
        </div>

        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <p className="text-center text-[var(--color-muted)]">
              Cargando preguntas...
            </p>
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
            <p className="text-center text-[var(--color-muted)]">
              No hay preguntas creadas para este curso aún.
            </p>
          )}

          <div className="flex justify-center mt-4">
            <Link to={`/teacher-profile/course-view/${courseId}/create-question`}>
              <ButtonPrimary>➕ Crear nueva pregunta</ButtonPrimary>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
