import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const STATUS_STYLES = {
  Publicada: "bg-gray-100 text-gray-700 border border-gray-200",
  Respondida: "bg-blue-100 text-blue-800 border border-blue-200",
  Corregida: "bg-green-100 text-green-800 border border-green-200",
  "Esperando recorreción": "bg-amber-100 text-amber-800 border border-amber-200",
  Recorregida: "bg-purple-100 text-purple-800 border border-purple-200",
};

const STATUS_FILTERS = [
  { key: "ALL", label: "Todas" },
  { key: "Publicada", label: "Publicadas" },
  { key: "Respondida", label: "Respondidas" },
  { key: "Corregida", label: "Corregidas" },
  { key: "Esperando recorreción", label: "Esperando recorreción" },
  { key: "Recorregida", label: "Recorregidas" },
];

export default function TableSimpleInCardStudent({ columns, data, basePath, backTo }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortMode, setSortMode] = useState("DUE_ASC"); // DUE_ASC | DUE_DESC | TITLE_ASC

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let rows = [...(data || [])];

    // 1) Filter: status
    if (statusFilter !== "ALL") {
      rows = rows.filter((r) => (r.status || "") === statusFilter);
    }

    // 2) Filter: query (por título)
    if (q) {
      rows = rows.filter((r) => (r.title || "").toLowerCase().includes(q));
    }

    // 3) Sort
    const getTime = (r) => {
      if (!r?.endDatetimeRaw) return Number.POSITIVE_INFINITY;
      const t = new Date(r.endDatetimeRaw).getTime();
      return Number.isNaN(t) ? Number.POSITIVE_INFINITY : t;
    };

    if (sortMode === "DUE_ASC") {
      rows.sort((a, b) => getTime(a) - getTime(b));
    } else if (sortMode === "DUE_DESC") {
      rows.sort((a, b) => getTime(b) - getTime(a));
    } else if (sortMode === "TITLE_ASC") {
      rows.sort((a, b) => String(a.title || "").localeCompare(String(b.title || ""), "es"));
    }

    return rows;
  }, [data, query, statusFilter, sortMode]);

  const countLabel = `${filtered.length} / ${(data || []).length}`;

  return (
    <div className="sm:px-6 lg:px-8">
      {/* ===================== Filters Bar ===================== */}
      <div
        className="
          rounded-2xl
          bg-[var(--color-surface)]
          border border-[var(--color-border)]
          p-4
          shadow-sm
          space-y-3
        "
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="flex items-center gap-2 w-full md:max-w-md">
            <div className="w-full">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por título…"
                className="
                  w-full
                  rounded-xl
                  border border-[var(--color-border)]
                  bg-[var(--color-background)]
                  px-4 py-2
                  text-sm
                  outline-none
                  focus:ring-2 focus:ring-[var(--color-primary)]
                "
              />
            </div>
          </div>

          {/* Sort + counter */}
          <div className="flex items-center justify-between md:justify-end gap-3">
            <div className="text-xs text-[var(--color-muted)]">
              Mostrando <span className="font-semibold text-[var(--color-text)]">{countLabel}</span>
            </div>

            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
              className="
                rounded-xl
                border border-[var(--color-border)]
                bg-[var(--color-background)]
                px-3 py-2
                text-sm
                cursor-pointer
                outline-none
                focus:ring-2 focus:ring-[var(--color-primary)]
              "
            >
              <option value="DUE_ASC">Entrega: más próxima</option>
              <option value="DUE_DESC">Entrega: más lejana</option>
              <option value="TITLE_ASC">Título: A → Z</option>
            </select>
          </div>
        </div>

        {/* Status chips */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => {
            const active = statusFilter === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setStatusFilter(s.key)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-semibold
                  border
                  transition
                  cursor-pointer
                  ${active
                    ? "bg-[var(--color-primary)] text-[var(--color-onprimary)] border-[var(--color-primary)]"
                    : "bg-[var(--color-background)] text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--color-hover)]"}
                `}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================== Table Header (desktop) ===================== */}
      <div className="mt-4 space-y-4">
        <div
          className="
            hidden md:grid
            grid-cols-[1fr_120px_200px_180px]
            items-center
            p-6 rounded-2xl
            bg-[var(--color-primary)]
            text-[var(--color-onprimary)]
            shadow-md
          "
        >
          {columns.map((col, i) => (
            <div key={i} className="text-sm font-semibold text-center">
              {col.header}
            </div>
          ))}
        </div>

        {/* ===================== Rows ===================== */}
        {filtered.map((row) => {
          const statusClass =
            STATUS_STYLES[row.status] ?? "bg-gray-100 text-gray-700 border border-gray-200";

          return (
            <Link
              key={row.id}
              to={`${basePath}/${row.id}`}
              state={backTo ? { backTo } : undefined}
              className="
                block
                cursor-pointer
                rounded-2xl
                bg-[var(--color-surface)]
                text-[var(--color-text)]
                border border-[var(--color-border)]
                shadow-sm
                transition-all duration-200
                hover:bg-[var(--color-hover-strong)]
                hover:shadow-md
                hover:scale-[1.01]
                focus:outline-none
                focus:ring-2 focus:ring-[var(--color-primary)]
              "
            >
              {/* Desktop row */}
              <div className="hidden md:grid grid-cols-[1fr_120px_200px_180px] items-center p-6">
                <div className="text-sm font-medium text-center">
                  {row.title}
                </div>

                <div className="text-sm text-center text-[var(--color-muted)]">
                  {row.durationHours}
                </div>

                <div className="text-sm text-center text-[var(--color-muted)]">
                  {row.dueDate}
                </div>

                <div className="flex justify-center">
                  <span
                    className={`
                      inline-flex items-center px-3 py-1
                      rounded-full text-xs font-semibold
                      ${statusClass}
                    `}
                  >
                    {row.status}
                  </span>
                </div>
              </div>

              {/* Mobile card */}
              <div className="md:hidden p-4 space-y-3">
                <div className="text-sm font-semibold">{row.title}</div>

                <div className="flex flex-wrap gap-3 text-xs text-[var(--color-muted)]">
                  <span>⏱ {row.durationHours}</span>
                  <span>📅 {row.dueDate}</span>
                </div>

                <div>
                  <span
                    className={`
                      inline-flex items-center px-3 py-1
                      rounded-full text-xs font-semibold
                      ${statusClass}
                    `}
                  >
                    {row.status}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center text-[var(--color-muted)] py-10">
            No hay resultados para los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
}
