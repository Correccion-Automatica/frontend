import BackButton from "./BackButton";

export default function PageHeader({ columns = [] }) {
  return (
    <div
      className="
        w-full rounded-md bg-[var(--color-surface)] border-b border-[var(--color-border)]
        p-3 sm:p-4
        flex flex-col gap-3
        sm:flex-row sm:items-center sm:justify-between
      "
    >
      {/* Botón volver a la izquierda (arriba en móvil) */}
      <div>
        <BackButton label="Volver" />
      </div>

      {/* Columnas centradas */}
      <div className="flex-1 flex justify-center">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-center">
          {columns.map((col, index) => (
            <div
              key={index}
              className="text-base sm:text-lg font-bold text-[var(--color-text)]"
            >
              {col}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
