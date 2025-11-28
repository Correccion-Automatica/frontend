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
  ];

  const handleQuestionDeleted = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/questions/${courseId}`);

        const formatted = res.data.map((q) => ({
          id: q.id,
          title: q.title || "Sin título",
          dueDate: q.endDatetime
            ? new Date(q.endDatetime).toLocaleDateString("es-CL")
            : "Sin fecha",
          status: q.isPublished ? "PUBLICADA" : "BORRADOR",
          answers: `${q.numAnswers || 0}/${q.numStudents || 0}`,
        }));

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
