import React, { useState } from "react";
import { Link } from "react-router-dom";

const TableSimpleInCardAdmin = ({ data, basePath }) => {
  const [search, setSearch] = useState("");

  // Filtrar cursos por búsqueda
  const filteredData = data.filter(
    (row) =>
      row.title.toLowerCase().includes(search.toLowerCase()) ||
      row.professor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sm:px-6 lg:px-8 relative">
      {/* Input de búsqueda */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Buscar curso"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>

      {/* Filas */}
      <div className="space-y-4">
        {filteredData.map((row) => (
          <Link
            key={row.id}
            to={`${basePath}/${row.id}`}
            className="flex items-center justify-between px-4 py-3 rounded-md
                       bg-[var(--color-surface)] text-[var(--color-text)]
                       border border-[var(--color-border)] shadow-sm
                       transition-all duration-200
                       hover:bg-[var(--color-hover-strong)]
                       hover:shadow-md hover:scale-[1.01]"
          >
            <div className="font-semibold">{row.title}</div>
            <div className="text-[var(--color-muted)] text-sm">{row.professor}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TableSimpleInCardAdmin;
