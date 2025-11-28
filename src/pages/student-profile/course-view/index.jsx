import React, { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner";
import { useParams } from "react-router-dom";
import TableSimpleInCard from "../../../components/TableSimpleInCardStudent";
import PageHeader from "../../../components/PageHeader";
import { api } from "../../../lib/axios";
import { useAuth } from "../../../context/AuthProvider"; // 👈 importamos el contexto de auth

export default function CourseDetail() {
  const { courseId } = useParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth(); // 👈 leemos el user y estado
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Obtener las preguntas desde el backend solo si el usuario está autenticado
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchQuestions = async () => {
      try {
        // El backend ya devuelve las preguntas filtradas por courseId
        const res = await api.get(`/questions/${courseId}`);

        // Adaptar los datos al formato de la tabla
        const formatted = res.data.map((q) => ({
          id: q.id,
          pregunta: q.title,
          dificultad: "Media", // 🔹 temporal
          estado: "Pendiente", // 🔹 temporal
          fecha: new Date(q.endDatetime).toLocaleDateString("es-CL"),
        }));

        setQuestions(formatted);
      } catch (error) {
        console.error("❌ Error al obtener las preguntas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [courseId, isAuthenticated, user]);

  // 🔹 Temporal: info del curso (hasta que venga del backend)
  const courseInfo = {
    title: "Dios en las Culturas",
    code: "TTF201",
    professor: "Juan Espinosa",
  };

  const columns = [
    { header: "Pregunta", accessor: "pregunta" },
    { header: "Dificultad", accessor: "dificultad" },
    { header: "Estado", accessor: "estado" },
    { header: "Fecha", accessor: "fecha" },
  ];

  // --- ESTADOS DE CARGA / NO AUTENTICADO ---
  if (authLoading || loading) {
    return <p className="p-6 text-center">Cargando preguntas...</p>;
  }

  if (!isAuthenticated) {
    return (
      <p className="p-6 text-center text-[var(--color-muted)]">
        Debes iniciar sesión para ver el contenido de este curso.
      </p>
    );
  }

  // --- RENDER PRINCIPAL ---
  return (
    <div
      className="text-center mt-6 px-4"
      style={{
        color: "var(--color-text)",
        backgroundColor: "var(--color-background)",
      }}
    >
      {/* Header del curso */}
      <div className="mb-6">
        <PageHeader
          columns={[
            `${courseInfo.title} - ${courseInfo.code}`,
            courseInfo.professor,
          ]}
        />
      </div>

      <h1 className="text-2xl font-bold mb-8">
        📘 Detalle del Curso {courseId}
      </h1>

      {/* Tabla de preguntas */}
      {loading ? (
        <Spinner />
      ) : questions.length > 0 ? (
        <TableSimpleInCard
          basePath={`/student-profile/course-view/${courseId}/question`}
          columns={columns}
          data={questions}
        />
      ) : (
        <p className="text-[var(--color-muted)]">
          No hay preguntas disponibles para este curso.
        </p>
      )}
    </div>
  );
}
