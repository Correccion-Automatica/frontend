import React from "react";
import { Link } from "react-router-dom";

export default function CardGrid({ data, basePath, isTeacher = false, showCreateCard = false }) {
  // Paleta cíclica inspirada en el primer código
  const colorClasses = [
    "bg-brand text-white",
    "bg-brand-strong text-white",
    "bg-[var(--color-primary)] text-[var(--color-onprimary)]",
    "bg-[var(--color-accent)] text-white",
    "bg-gray-700 text-white",
    "bg-gray-900 text-white"
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {/* 👉 Cards de cursos */}
      {data.map((item, idx) => {
        if (!item?.title && !item?.code) return null; // validación de contenido

        const colorClass = colorClasses[idx % colorClasses.length];

        return (
          <Link
            key={item.id}
            to={`${basePath}/${item.id}`}
            className="rounded-2xl border shadow-md
                       bg-[var(--color-surface)] text-[var(--color-text)]
                       border-[var(--color-border)] 
                       hover:bg-[var(--color-hover-strong)]
                       hover:scale-[1.02]
                       transition-all duration-200
                       flex flex-col overflow-hidden"
          >
            {/* Parte superior colorida (heredada del primer diseño) */}
            <div className={`w-full h-20 ${colorClass} flex items-center justify-end p-3`}>
              <span className="text-white text-2xl font-bold">&#8942;</span>
            </div>

            {/* Contenido principal */}
            <div className="flex flex-col items-center text-center p-6 flex-1">
              <h2 className="text-lg font-bold mb-1">
                {item.title} {item.code && <span className="text-[var(--color-muted)]">({item.code})</span>}
              </h2>

              {/* Mostrar según rol */}
              {!isTeacher && item.professor && (
                <p className="text-sm text-[var(--color-muted)]">{item.professor}</p>
              )}
              {isTeacher && item.studentsCount !== undefined && (
                <p className="text-sm text-[var(--color-muted)]">
                  {item.studentsCount} alumnos inscritos
                </p>
              )}

              {/* Extra opcional: semestre */}
              {item.semester && (
                <p className="text-xs text-[var(--color-muted)] mt-1">{item.semester}</p>
              )}
            </div>
          </Link>
        );
      })}

      {showCreateCard && (
        <Link
          to="/teacher-profile/create-course"
          className="rounded-2xl border shadow-md 
                     bg-brand-strong text-white
                     border-transparent
                     hover:scale-[1.03]
                     transition-all duration-200
                     flex flex-col items-center justify-center text-center overflow-hidden"
        >
          <div className="w-full h-20 bg-white/20 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/40 rounded-lg flex items-center justify-center text-2xl">
              ➕
            </div>
          </div>
          <div className="p-6 flex flex-col items-center">
            <h2 className="text-lg font-bold mb-1">Crear nuevo curso</h2>
            <p className="text-sm text-white/80">Haz click para agregar un curso</p>
          </div>
        </Link>
      )}
    </div>
  );
}
