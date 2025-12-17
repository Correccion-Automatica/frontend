// src/components/TableSimpleInCardTeacher.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmPopUp from "./ConfirmPopUp";
import { api } from "../lib/axios";
import { gsap } from "gsap";

export default function TableSimpleInCardTeacher({
  columns,
  data,
  basePath,
  onDeleted,
  backTo,
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [query, setQuery] = useState("");
  const [sortDir, setSortDir] = useState("desc");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState("all"); // all | published | draft

  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-anim='toolbar']",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );

      gsap.fromTo(
        "[data-anim='header']",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, delay: 0.05, ease: "power2.out" }
      );

      gsap.fromTo(
        "[data-anim='row']",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.04,
          delay: 0.1,
          ease: "power2.out",
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [data]);

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setIsPopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRow) return;
    setLoadingDelete(true);

    try {
      await api.delete(`/questions/${selectedRow.id}`);
      if (onDeleted) onDeleted(selectedRow.id);
      setIsPopupOpen(false);
      setSelectedRow(null);
    } catch (err) {
      console.error("❌ Error deleting:", err);
      alert("No tienes permisos para eliminar esta pregunta.");
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleCancelDelete = () => {
    setIsPopupOpen(false);
    setSelectedRow(null);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return data.filter((row) => {
      const matchesTitle = !q
        ? true
        : String(row.title || "").toLowerCase().includes(q);

      const normalizedStatus =
        String(row.status || "").toUpperCase().trim() === "PUBLICADA"
          ? "published"
          : "draft";

      const matchesStatus =
        statusFilter === "all" ? true : normalizedStatus === statusFilter;

      return matchesTitle && matchesStatus;
    });
  }, [data, query, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];

    arr.sort((a, b) => {
      const aT = a.endDatetimeRaw ? new Date(a.endDatetimeRaw).getTime() : 0;
      const bT = b.endDatetimeRaw ? new Date(b.endDatetimeRaw).getTime() : 0;

      if (!aT && !bT) return 0;
      if (!aT) return 1;
      if (!bT) return -1;

      return sortDir === "asc" ? aT - bT : bT - aT;
    });

    return arr;
  }, [filtered, sortDir]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const startIdx = (pageSafe - 1) * pageSize;
  const pageItems = sorted.slice(startIdx, startIdx + pageSize);

  useEffect(() => {
    setPage(1);
  }, [query, pageSize, sortDir, statusFilter]);

  return (
    <div ref={rootRef} className="relative">
      <div
        data-anim="toolbar"
        className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="flex-1">
          <label className="block text-xs font-semibold text-(--color-muted) mb-1">
            Buscar por título
          </label>
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: Caso de estudio..."
              className="w-full rounded-2xl border border-(--color-border)
                bg-(--color-surface) px-4 py-2.5 text-sm text-(--color-text)
                outline-none focus:ring-2 focus:ring-indigo-400/70
                shadow-sm"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--color-muted) text-sm">
              ⌕
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:flex lg:items-end lg:gap-3">
          <div>
            <label className="block text-xs font-semibold text-(--color-muted) mb-1">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-2xl border border-(--color-border)
                bg-(--color-surface) px-4 py-2.5 text-sm shadow-sm"
            >
              <option value="all">Todas</option>
              <option value="published">Publicadas</option>
              <option value="draft">Sin publicar</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--color-muted) mb-1">
              Orden por fecha
            </label>
            <button
              type="button"
              onClick={() => setSortDir((p) => (p === "asc" ? "desc" : "asc"))}
              className="w-full rounded-2xl border border-(--color-border)
                bg-(--color-surface) px-4 py-2.5 text-sm
                hover:bg-(--color-hover-strong) transition-colors
                shadow-sm active:scale-[0.98]"
              title="Cambiar orden"
            >
              {sortDir === "asc" ? "⬆️ Ascendente" : "⬇️ Descendente"}
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--color-muted) mb-1">
              Mostrar
            </label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="w-full rounded-2xl border border-(--color-border)
                bg-(--color-surface) px-4 py-2.5 text-sm shadow-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
        </div>
      </div>

      <div
        data-anim="header"
        className="hidden md:grid mt-5
          grid-cols-[1fr_200px_140px_120px_190px_64px]
          items-center gap-3 p-4 rounded-3xl
          bg-(--color-primary) text-(--color-onprimary)
          shadow-md border border-(--color-border)"
      >
        <div className="text-sm font-semibold">{columns[0]?.header || "Título"}</div>
        <div className="text-sm font-semibold text-center">{columns[1]?.header || "Entrega"}</div>
        <div className="text-sm font-semibold text-center">{columns[2]?.header || "Estado"}</div>
        <div className="text-sm font-semibold text-center">{columns[3]?.header || "Respuestas"}</div>
        <div className="text-sm font-semibold text-center">{columns[4]?.header || "Recorrecciones"}</div>
        <div className="text-sm font-semibold text-center">🗑️</div>
      </div>

      <div className="mt-4 space-y-3">
        {pageItems.map((row) => (
          <div key={row.id} data-anim="row">
            <div
              className="hidden md:grid
                grid-cols-[1fr_200px_140px_120px_190px_64px]
                items-center gap-3 p-4 rounded-3xl
                bg-(--color-surface) text-(--color-text)
                border border-(--color-border)
                shadow-sm transition-all
                hover:shadow-lg hover:-translate-y-[1px]"
            >
              <Link
                to={`${basePath}/${row.id}`}
                state={backTo ? { backTo } : undefined}
                className="min-w-0"
              >
                <div className="font-semibold truncate hover:underline">
                  {row.title}
                </div>
              </Link>

              <Link
                to={`${basePath}/${row.id}`}
                state={backTo ? { backTo } : undefined}
                className="text-sm text-center text-(--color-muted) hover:underline"
              >
                {row.dueDate}
              </Link>

              <Link
                to={`${basePath}/${row.id}`}
                state={backTo ? { backTo } : undefined}
                className={`text-sm text-center font-semibold ${
                  String(row.status || "").toUpperCase() === "PUBLICADA"
                    ? "text-green-600"
                    : "text-amber-600"
                }`}
              >
                {row.status}
              </Link>

              <Link
                to={`${basePath}/${row.id}`}
                state={backTo ? { backTo } : undefined}
                className="text-sm text-center"
              >
                {row.answers}
              </Link>

              <Link
                to={`${basePath}/${row.id}`}
                state={backTo ? { backTo } : undefined}
                className="text-sm text-center"
              >
                {row.recorrectionsStatus}
              </Link>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => handleDeleteClick(row)}
                  className="h-11 w-11 rounded-2xl border border-red-200
                    bg-red-50 text-red-700 hover:bg-red-100
                    transition-colors shadow-sm active:scale-[0.97]"
                  title="Eliminar pregunta"
                >
                  {loadingDelete && selectedRow?.id === row.id ? "…" : "🗑️"}
                </button>
              </div>
            </div>

            <Link
              to={`${basePath}/${row.id}`}
              state={backTo ? { backTo } : undefined}
              className="md:hidden block"
            >
              <div
                className="rounded-3xl bg-(--color-surface) text-(--color-text)
                  border border-(--color-border) shadow-sm
                  p-4 transition-all hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-base truncate">
                      {row.title}
                    </div>
                    <div className="mt-1 text-xs text-(--color-muted)">
                      <span className="font-semibold">Entrega:</span>{" "}
                      {row.dueDate}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteClick(row);
                    }}
                    className="shrink-0 h-11 w-11 rounded-2xl border border-red-200
                      bg-red-50 text-red-700 hover:bg-red-100
                      transition-colors shadow-sm active:scale-[0.97]"
                    title="Eliminar pregunta"
                  >
                    {loadingDelete && selectedRow?.id === row.id ? "…" : "🗑️"}
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-(--color-background) border border-(--color-border) p-3">
                    <div className="text-[11px] text-(--color-muted) font-semibold">
                      Estado
                    </div>
                    <div
                      className={`mt-1 text-sm font-semibold ${
                        String(row.status || "").toUpperCase() === "PUBLICADA"
                          ? "text-green-600"
                          : "text-amber-600"
                      }`}
                    >
                      {row.status}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-(--color-background) border border-(--color-border) p-3">
                    <div className="text-[11px] text-(--color-muted) font-semibold">
                      Respuestas
                    </div>
                    <div className="mt-1 text-sm font-semibold">
                      {row.answers}
                    </div>
                  </div>

                  <div className="col-span-2 rounded-2xl bg-(--color-background) border border-(--color-border) p-3">
                    <div className="text-[11px] text-(--color-muted) font-semibold">
                      Recorrecciones
                    </div>
                    <div className="mt-1">{row.recorrectionsStatus}</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}

        {pageItems.length === 0 && (
          <div className="text-center text-(--color-muted) py-10">
            No hay resultados para tu búsqueda.
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-(--color-muted)">
          Mostrando{" "}
          <span className="font-semibold">{total === 0 ? 0 : startIdx + 1}</span>
          –
          <span className="font-semibold">
            {Math.min(total, startIdx + pageSize)}
          </span>{" "}
          de <span className="font-semibold">{total}</span>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageSafe <= 1}
            className="px-4 py-2 rounded-2xl border border-(--color-border)
              bg-(--color-surface) text-sm disabled:opacity-40
              hover:bg-(--color-hover-strong) transition-colors
              shadow-sm active:scale-[0.98]"
          >
            ◀
          </button>

          <div className="text-sm">
            Página <span className="font-semibold">{pageSafe}</span> /{" "}
            <span className="font-semibold">{totalPages}</span>
          </div>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={pageSafe >= totalPages}
            className="px-4 py-2 rounded-2xl border border-(--color-border)
              bg-(--color-surface) text-sm disabled:opacity-40
              hover:bg-(--color-hover-strong) transition-colors
              shadow-sm active:scale-[0.98]"
          >
            ▶
          </button>
        </div>
      </div>

      <ConfirmPopUp
        isOpen={isPopupOpen}
        title={`Eliminar "${selectedRow?.title}"`}
        message="¿Estás seguro de que deseas eliminar esta pregunta? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText={loadingDelete ? "Eliminando..." : "Eliminar"}
      />
    </div>
  );
}
