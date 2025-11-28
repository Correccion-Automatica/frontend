// src/components/TableSimpleInCardTeacher.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ButtonPrimary from "./ButtonPrimary";
import ConfirmPopUp from "./ConfirmPopUp";
import { api } from "../lib/axios";

export default function TableSimpleInCardTeacher({
  columns,
  data,
  basePath,
  onDeleted,
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

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

  return (
    <div className="sm:px-6 lg:px-8 relative">

      {/* Header */}
      <div className="flex items-center p-5 rounded-xl
                      bg-[var(--color-primary)] text-[var(--color-onprimary)]
                      shadow-md border border-[var(--color-border)]">
        {columns.map((col, i) => (
          <div key={i} className="text-sm font-semibold text-center flex-1">
            {col.header}
          </div>
        ))}
        <div className="text-sm font-semibold text-center flex-1">Acciones</div>
      </div>

      {/* Filas */}
      <div className="space-y-3 mt-4">
        {data.map((row) => (
          <Link
            key={row.id}
            to={`${basePath}/${row.id}`}
            className="flex items-center p-5 rounded-xl
                       bg-[var(--color-surface)] text-[var(--color-text)]
                       border border-[var(--color-border)]
                       shadow-sm hover:shadow-lg
                       transition-all hover:bg-[var(--color-hover-strong)]
                       hover:scale-[1.01]"
          >
            {columns.map((col, j) => (
              <div key={j} className="text-sm font-medium text-center flex-1">
                {row[col.accessor]}
              </div>
            ))}

            <div className="flex-1 text-center">
              <ButtonPrimary
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteClick(row);
                }}
              >
                {loadingDelete && selectedRow?.id === row.id ? "..." : "🗑️"}
              </ButtonPrimary>
            </div>
          </Link>
        ))}
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
