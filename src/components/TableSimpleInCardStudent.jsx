import React from "react";
import { Link } from "react-router-dom";

const TableSimpleInCard = ({ columns, data, basePath }) => {
  return (
    <div className="sm:px-6 lg:px-8">
      <div className="mt-8 space-y-4">
        {/* Tarjeta de headers */}
        <div
          className="flex items-center justify-between p-6 rounded-2xl
                     bg-[var(--color-primary)] text-[var(--color-onprimary)]
                     shadow-md"
        >
          {columns.map((col, i) => (
            <div
              key={i}
              className="text-sm font-semibold text-center flex-1"
            >
              {col.header}
            </div>
          ))}
        </div>

        {/* Tarjetas de datos */}
        {data.map((row) => (
          <Link
            key={row.id}
            to={`${basePath}/${row.id}`}
            className="flex items-center justify-between p-6 rounded-2xl 
                       bg-[var(--color-surface)] text-[var(--color-text)]
                       border border-[var(--color-border)] shadow-sm
                       transition-all duration-200 
                       hover:bg-[var(--color-hover-strong)] 
                       hover:shadow-md hover:scale-[1.01]"
          >
            {columns.map((col, j) => (
              <div
                key={j}
                className="text-sm font-medium text-center flex-1"
                style={{ color: "var(--color-text)" }}
              >
                {row[col.accessor]}
              </div>
            ))}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TableSimpleInCard;
