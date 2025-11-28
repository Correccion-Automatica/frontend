import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../../components/PageHeader";
import ButtonPrimary from "../../../components/ButtonPrimary";
import ChartSimpleLine from "../../../components/ChartSimpleLine";

export default function TeacherProfileAdmin() {
  const { professorId } = useParams();

  // Estado del profesor
  const [isActive, setIsActive] = useState(true);

  // Datos de ejemplo (reemplazar luego con backend)
  const teacherInfo = {
    name: "Carolina Martínez",
    memberSince: "20/07/2025",
    creditsRemaining: "10.350",
    description: "Lorem ipsum: dolor sit amet",
    courses: [
      { id: "1", name: "Marketing - ICS3311" },
      { id: "2", name: "Marketing Estratégico - ICS3313" },
    ],
  };

  const metrics = [
    { label: "Créditos usados este mes", value: "12.550" },
    { label: "Gastados el último mes", value: "$8.600 CLP" },
    { label: "Preguntas & pautas creadas", value: "23" },
    { label: "Respuestas corregidas automáticamente", value: "517" },
  ];

  const chartData = [
    { date: "01-09-25", value: 2000 },
    { date: "05-09-25", value: 2200 },
    { date: "09-09-25", value: 3000 },
    { date: "13-09-25", value: 800 },
    { date: "17-09-25", value: 1200 },
    { date: "21-09-25", value: 2400 },
    { date: "29-09-25", value: 2800 },
  ];

  // Handler para bloquear o activar docente
  const handleToggleStatus = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* ✅ Header global reutilizado */}
      <PageHeader columns={["Información del Docente"]} showBack={false} />

      {/* Sección superior con datos del docente */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Perfil docente */}
        <div className="col-span-2 flex flex-col md:flex-row items-center md:items-start gap-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/706/706830.png"
            alt="avatar docente"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold">{teacherInfo.name}</h3>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              Miembro desde: {teacherInfo.memberSince}
            </p>
            <p className="text-sm text-[var(--color-muted)]">
              Créditos restantes: {teacherInfo.creditsRemaining}
            </p>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              {teacherInfo.description}
            </p>
          </div>
        </div>

        {/* Cursos y estado */}
        <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 flex flex-col gap-3 justify-between">
          <div>
            <h4 className="text-sm font-semibold mb-2">Cursos:</h4>
            <div className="flex flex-col gap-2">
              {teacherInfo.courses.map((c) => (
                <Link
                  key={c.id}
                  to={`/admin-profile/faculty/${c.id}/course/${c.id}`}
                  className="rounded-md bg-black text-white text-sm px-3 py-2 text-center hover:bg-[var(--color-hover-strong)] transition-all"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center mt-4">
            <p
              className={`font-semibold mb-2 ${
                isActive
                  ? "text-green-600"
                  : "text-[var(--color-muted)] line-through"
              }`}
            >
              {isActive ? "ACTIVO" : "INACTIVO"}
            </p>
            <ButtonPrimary onClick={handleToggleStatus}>
              {isActive ? "Bloquear Docente" : "Activar Docente"}
            </ButtonPrimary>
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 text-center"
          >
            <div className="text-2xl font-semibold">{m.value}</div>
            <div className="mt-1 text-sm text-[var(--color-muted)]">
              {m.label}
            </div>
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
