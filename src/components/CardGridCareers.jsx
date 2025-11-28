import React from "react";
import { Link } from "react-router-dom";

export default function CardGridCareers({ data, basePath }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {/* 👉 Cards de facultades/carreras */}
      {data.map((item) => (
        <Link
          key={item.id || item.name}
          to={`${basePath}/${item.id || item.name.toLowerCase()}`}
          className="p-6 rounded-2xl border shadow-sm 
                     bg-[var(--color-surface)] text-[var(--color-text)]
                     border-[var(--color-border)] 
                     hover:bg-[var(--color-hover-strong)] 
                     hover:scale-[1.02] 
                     transition-all duration-200
                     flex flex-col items-center text-center"
        >
          {/* Nombre */}
          <h2 className="text-lg font-bold mb-1">{item.name}</h2>

          {/* Cantidad de cursos (solo si existe) */}
          {typeof item.courses !== "undefined" && (
            <p className="text-sm text-[var(--color-muted)]">
              {item.courses} cursos
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}
