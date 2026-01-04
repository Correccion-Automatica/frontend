import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../../components/PageHeader";
import TableSimpleInCardStudent from "../../../components/TableSimpleInCardStudent";
import { api } from "../../../lib/axios";
import { useAuth } from "../../../context/AuthProvider";

/* ===============================
   Helpers
================================ */

function secondsToDHMS(seconds) {
  const s = Number(seconds);
  if (!s || Number.isNaN(s) || s <= 0) return "-";

  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(" ");
}

export default function CourseDetail() {
  const { courseId } = useParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [errorQuestions, setErrorQuestions] = useState(null);

  const [courseInfo, setCourseInfo] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(false);
  const [errorCourse, setErrorCourse] = useState(null);

  const columns = [
    { header: "Título", accessor: "title" },
    { header: "Duración", accessor: "durationHours" },
    { header: "Entrega", accessor: "dueDate" },
    { header: "Estado", accessor: "status" },
  ];

  /* ===============================
     Curso
  ================================ */
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchCourseInfo = async () => {
      try {
        setLoadingCourse(true);
        setErrorCourse(null);

        const res = await api.get("/courses/user/all");

        const courses = (res.data || []).map((e) => ({
          id: Number(e.course.id),
          title: e.course.name,
          code: e.course.acronym,
          period: e.course.period,
        }));

        const course = courses.find((c) => c.id === Number(courseId));

        if (!course) {
          setErrorCourse("No se encontró el curso.");
          return;
        }

        setCourseInfo(course);
      } catch {
        setErrorCourse("No se pudo cargar la información del curso.");
      } finally {
        setLoadingCourse(false);
      }
    };

    fetchCourseInfo();
  }, [courseId, isAuthenticated, user]);

  /* ===============================
     Preguntas + estados reales
  ================================ */
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchQuestions = async () => {
      try {
        setLoadingQuestions(true);
        setErrorQuestions(null);

        // 1) Preguntas del curso
        const qRes = await api.get(`/questions/${courseId}`);

        // ❌ No mostrar NO publicadas
        const courseQuestions = (qRes.data || []).filter(
          (q) => q.isPublished === true
        );

        if (courseQuestions.length === 0) {
          setQuestions([]);
          return;
        }

        // 2) Answers
        const aRes = await api.get("/answers/all");
        const allAnswers = aRes.data || [];

        // 3) Recorrecciones
        let allRecorrections = [];
        try {
          const rRes = await api.get("/recorrection");
          allRecorrections = rRes.data || [];
        } catch (err) {
          if (err?.response?.status !== 404) throw err;
        }

        const userId = Number(user.id);

        // Última answer por pregunta
        const lastAnswerByQuestionId = new Map();
        for (const a of allAnswers) {
          if (Number(a?.userId) !== userId) continue;
          const qid = Number(a?.questionId);
          if (!qid) continue;

          const prev = lastAnswerByQuestionId.get(qid);
          if (!prev || Number(a.id) > Number(prev.id)) {
            lastAnswerByQuestionId.set(qid, a);
          }
        }

        // Recorrección por answer
        const recByAnswerId = new Map();
        for (const r of allRecorrections) {
          const aid = Number(r?.answerId);
          if (!aid) continue;

          const prev = recByAnswerId.get(aid);
          if (!prev || Number(r.id) > Number(prev.id)) {
            recByAnswerId.set(aid, r);
          }
        }

        const now = Date.now();

        const formatted = courseQuestions.map((q) => {
          const lastAnswer = lastAnswerByQuestionId.get(Number(q.id)) || null;
          const rec = lastAnswer
            ? recByAnswerId.get(Number(lastAnswer.id)) || null
            : null;

          const endTime = q.endDatetime
            ? new Date(q.endDatetime).getTime()
            : null;

          let status = "Publicada";

          if (!lastAnswer && endTime && now > endTime) {
            status = "Expirada";
          } else if (lastAnswer) {
            if (rec) {
              status =
                rec.newGrade == null
                  ? "Esperando recorreción"
                  : "Recorregida";
            } else if (lastAnswer.grade == null) {
              status = "Respondida";
            } else {
              status = "Corregida";
            }
          }

          return {
            id: q.id,
            title: q.title || "Sin título",
            durationHours: secondsToDHMS(q.duration),
            dueDate: q.endDatetime
              ? new Date(q.endDatetime).toLocaleString("es-CL", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "Sin fecha",
            endDatetimeRaw: q.endDatetime || null,
            status,
          };
        });

        setQuestions(formatted);
      } catch {
        setErrorQuestions("No se pudieron cargar las preguntas.");
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [courseId, isAuthenticated, user]);

  /* ===============================
     Estados globales
  ================================ */
  if (authLoading || loadingQuestions) {
    return (
      <div className="mt-6 px-4">
        <p className="text-center text-(--color-muted)">Cargando…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mt-6 px-4">
        <p className="text-center text-(--color-muted)">
          Debes iniciar sesión para ver este curso.
        </p>
      </div>
    );
  }

  const headerTitle = courseInfo
    ? `${courseInfo.title} (${courseInfo.code}) - ${courseInfo.period}`
    : `Curso ${courseId}`;

  return (
    <div className="mt-6 px-4 space-y-6">
      <PageHeader columns={[headerTitle]} />

      {errorCourse && (
        <p className="text-center text-red-500">{errorCourse}</p>
      )}

      <div className="mx-auto w-full max-w-5xl">
        {errorQuestions ? (
          <p className="text-center text-red-500">{errorQuestions}</p>
        ) : (
          <TableSimpleInCardStudent
            columns={columns}
            data={questions}
            basePath={`/student-profile/course-view/${courseId}/question`}
            backTo={`/student-profile/course-view/${courseId}`}
          />
        )}
      </div>
    </div>
  );
}
