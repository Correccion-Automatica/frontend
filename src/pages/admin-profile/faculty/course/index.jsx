import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ButtonPrimary from "../../../../components/ButtonPrimary";
import ChartSimpleLine from "../../../../components/ChartSimpleLine";

export default function AdminCourse() {
  const navigate = useNavigate();
  const { id, courseId } = useParams();

  // 🔹 Datos de ejemplo (puedes traerlos del backend según el id)
  const courseInfo = {
    title: "Marketing Estratégico",
    professor: "Carolina Martínez",
    professorId: "carolina-martinez", // ruta del profesor
    metrics: [
      { label: "Créditos usados este mes", value: "5.900" },
      { label: "Gastados el último mes", value: "$4.000 CLP" },
      { label: "Preguntas & pautas creadas", value: "12" },
      { label: "Respuestas corregidas automáticamente", value: "250" },
    ],
  };

 const courses = [
    { id: 1, title: "Marketing Estratégico", professor: "Carolina Martínez" },
    { id: 2, title: "Marketing", professor: "Carolina Martínez" },
    { id: 3, title: "Gestión de Operaciones", professor: "Alejandro McCawley" },
    { id: 4, title: "CCT", professor: "Francisco García <3" },
    { id: 5, title: "Desarrollo de Software", professor: "Gonzalo Martínez" },
    { id: 6, title: "Finanzas", professor: "Rodrigo González" },
    { id: 7, title: "Hormigón Armado", professor: "Rodrigo Jordan" },
    { id: 8, title: "Termodinámica", professor: "Sebastián Ormazábal" },
  ];

  // 🔹 Datos para el gráfico (puedes reemplazarlos por los reales)
  const chartData = [
    { date: "01-09-25", value: 500 },
    { date: "05-09-25", value: 1000 },
    { date: "09-09-25", value: 0 },
    { date: "13-09-25", value: 200 },
    { date: "21-09-25", value: 800 },
    { date: "25-09-25", value: 1500 },
    { date: "29-09-25", value: 1300 },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Header principal */}
      <header className="flex items-center justify-between px-6 py-4 
                          bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2 font-medium">
          <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
            AC
          </div>
          <span>Automatic Correction</span>
        </div>
        <h1 className="text-lg font-semibold">Dashboard PUC</h1>
        <ButtonPrimary onClick={() => console.log("Cerrar sesión")}>
          Cerrar Sesión
        </ButtonPrimary>
      </header>

      {/* Subheader */}
      <div className="flex items-center justify-between px-6 py-3 bg-[var(--color-hover)] border-b border-[var(--color-border)]">
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-medium hover:underline flex items-center gap-1"
        >
          ← Volver
        </button>

        <h2 className="text-md font-semibold flex items-center gap-2">
          {courseInfo.title}{" -"}
          {/* 👉 Profesor clickeable */}
          <Link
            to={`/admin-profile/teacher/${courseInfo.professorId}`}
            className="font-normal text-[var(--color-muted)] hover:underline hover:text-[var(--color-primary)]"
          >
            {courseInfo.professor}
          </Link>
        </h2>

        <div /> {/* para balancear el flex */}
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {courseInfo.metrics.map((m, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 text-center"
          >
            <div className="text-2xl font-semibold">{m.value}</div>
            <div className="mt-1 text-sm text-[var(--color-muted)]">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <div className="px-6 pb-12">
        <ChartSimpleLine data={chartData} />
      </div>
    </div>
  );
}
