// src/pages/ac-super-view/index.jsx
import React, { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";

const MOCK_TEACHERS = [
  { id: "t1", name: "María Paz Rojas", active: true, creditsAvailableCLP: 120000, creditsUsedThisMonthCLP: 45000 },
  { id: "t2", name: "Gonzalo Pérez", active: true, creditsAvailableCLP: 80000, creditsUsedThisMonthCLP: 12000 },
  { id: "t3", name: "Carolina Vega", active: false, creditsAvailableCLP: 0, creditsUsedThisMonthCLP: 0 },
  { id: "t4", name: "Francisco Salazar", active: true, creditsAvailableCLP: 250000, creditsUsedThisMonthCLP: 90000 },
  { id: "t5", name: "Valentina Mena", active: false, creditsAvailableCLP: 15000, creditsUsedThisMonthCLP: 0 },
  { id: "t6", name: "Javier Fuentes", active: false, creditsAvailableCLP: 0, creditsUsedThisMonthCLP: 32000 },
  { id: "t7", name: "Camila Soto", active: true, creditsAvailableCLP: 64000, creditsUsedThisMonthCLP: 22000 },
  { id: "t8", name: "Tomás Herrera", active: false, creditsAvailableCLP: 9000, creditsUsedThisMonthCLP: 0 },
  { id: "t9", name: "Daniela Araya", active: true, creditsAvailableCLP: 175000, creditsUsedThisMonthCLP: 60000 },
  { id: "t10", name: "Ignacio Morales", active: true, creditsAvailableCLP: 300000, creditsUsedThisMonthCLP: 110000 },
  { id: "t11", name: "Antonia Fernández", active: false, creditsAvailableCLP: 0, creditsUsedThisMonthCLP: 0 },
];

function formatCLP(n) {
  const value = Number(n ?? 0);
  return value.toLocaleString("es-CL");
}

function todayISO() {
  // YYYY-MM-DD
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function daysAgoISO(days) {
  const d = new Date();
  d.setDate(d.getDate() - Number(days || 0));
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function Badge({ active }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
        active
          ? "bg-[var(--color-success-bg)] text-[var(--color-success-text)]"
          : "bg-[var(--color-error-bg)] text-[var(--color-error-text)]",
      ].join(" ")}
    >
      <span
        className={[
          "h-2 w-2 rounded-full",
          active ? "bg-[var(--color-success-text)]" : "bg-[var(--color-error-text)]",
        ].join(" ")}
      />
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}

function SmallButton({ children, onClick, disabled, variant = "default", className = "" }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition border";
  const styles =
    variant === "primary"
      ? "bg-[var(--color-primary)] text-[var(--color-onprimary)] border-transparent hover:opacity-90 disabled:opacity-50"
      : "bg-[var(--color-elevated)] text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--color-hover)] disabled:opacity-50";

  return (
    <button type="button" className={`${base} ${styles} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={[
              "px-3 py-2 text-sm font-semibold rounded-lg transition",
              active
                ? "bg-[var(--color-hover-strong)] text-[var(--color-text)]"
                : "text-[var(--color-muted)] hover:bg-[var(--color-hover)]",
            ].join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Mock generator (sin backend)
 * Si hay "customFrom/customTo", ajusta el # de puntos para que se vea coherente.
 */
function generateSeries({ rangePreset, granularity, customFrom, customTo }) {
  // puntos base por preset
  const pointsByPreset = {
    "7d": { daily: 7, weekly: 7, monthly: 7, yearly: 7 },
    "30d": { daily: 30, weekly: 8, monthly: 10, yearly: 10 },
    "6m": { daily: 30, weekly: 12, monthly: 6, yearly: 6 },
    "12m": { daily: 30, weekly: 16, monthly: 12, yearly: 12 },
  };

  let n = pointsByPreset[rangePreset]?.[granularity] ?? 12;

  // si es personalizado, intentamos estimar puntos sin volverlo gigante
  if (rangePreset === "custom" && customFrom && customTo) {
    const from = new Date(customFrom);
    const to = new Date(customTo);
    const diffMs = to - from;
    const diffDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
    if (granularity === "daily") n = Math.min(45, diffDays);
    if (granularity === "weekly") n = Math.min(26, Math.max(6, Math.round(diffDays / 7)));
    if (granularity === "monthly") n = Math.min(18, Math.max(6, Math.round(diffDays / 30)));
    if (granularity === "yearly") n = Math.min(12, Math.max(6, Math.round(diffDays / 365)));
  }

  const labelers = {
    daily: (i) => `D${i + 1}`,
    weekly: (i) => `S${i + 1}`,
    monthly: (i) => ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][i % 12],
    yearly: (i) => `A${i + 1}`,
  };

  const scaleByPreset = { "7d": 12, "30d": 18, "6m": 26, "12m": 30, custom: 22 };
  const base = scaleByPreset[rangePreset] ?? 20;

  const series = [];
  for (let i = 0; i < n; i++) {
    const trend = base + i * (base / Math.max(n, 1)) * 0.7;
    const wiggle = Math.sin(i * 0.9) * 2.4 + Math.cos(i * 0.35) * 1.6;

    const ingresos = Math.max(1, Math.round((trend + wiggle) * 10));
    const costos = Math.max(1, Math.round((trend * 0.62 + wiggle * 0.7) * 10));

    series.push({
      label: labelers[granularity]?.(i) ?? `P${i + 1}`,
      ingresos,
      costos,
      utilidad: ingresos - costos,
    });
  }
  return series;
}

function buildPath(points, width, height, padding) {
  if (!points.length) return "";
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const scaleX = (x) => {
    if (maxX === minX) return padding;
    return padding + ((x - minX) / (maxX - minX)) * (width - padding * 2);
  };
  const scaleY = (y) => {
    if (maxY === minY) return height - padding;
    const t = (y - minY) / (maxY - minY);
    return height - padding - t * (height - padding * 2);
  };

  let d = "";
  points.forEach((p, i) => {
    const X = scaleX(p.x);
    const Y = scaleY(p.y);
    d += i === 0 ? `M ${X} ${Y}` : ` L ${X} ${Y}`;
  });
  return d;
}

function LineChart({ series, mode }) {
  const width = 860;
  const height = 260;
  const padding = 18;

  const pointsIngresos = series.map((d, i) => ({ x: i, y: d.ingresos }));
  const pointsCostos = series.map((d, i) => ({ x: i, y: d.costos }));
  const pointsUtilidad = series.map((d, i) => ({ x: i, y: d.utilidad }));

  const ingresosPath = buildPath(pointsIngresos, width, height, padding);
  const costosPath = buildPath(pointsCostos, width, height, padding);
  const utilidadPath = buildPath(pointsUtilidad, width, height, padding);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
      <div className="flex items-center gap-4 text-xs text-[var(--color-muted)]">
        {mode !== "profit" ? (
          <>
            <div className="flex items-center gap-2">
              <span className="h-2 w-6 rounded-full bg-[var(--color-primary)] opacity-90" />
              Ingresos
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-6 rounded-full bg-[var(--color-border)]" />
              Costos
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span className="h-2 w-6 rounded-full bg-[var(--color-primary)] opacity-90" />
            Utilidad
          </div>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <svg viewBox={`0 0 ${width} ${height}`} className="block h-[260px] w-full" preserveAspectRatio="none">
          {Array.from({ length: 5 }).map((_, i) => {
            const y = (height / 5) * i;
            return <line key={i} x1="0" y1={y} x2={width} y2={y} stroke="rgba(255,255,255,.06)" />;
          })}

          {mode !== "profit" ? (
            <>
              <path d={costosPath} fill="none" stroke="rgba(255,255,255,.20)" strokeWidth="4" />
              <path d={ingresosPath} fill="none" stroke="rgba(255,255,255,.78)" strokeWidth="4" />
            </>
          ) : (
            <path d={utilidadPath} fill="none" stroke="rgba(255,255,255,.78)" strokeWidth="4" />
          )}
        </svg>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-[var(--color-muted)]">
        <div className="truncate">{series[0]?.label ?? ""}</div>
        <div className="truncate">{series[Math.floor(series.length / 2)]?.label ?? ""}</div>
        <div className="truncate">{series.at(-1)?.label ?? ""}</div>
      </div>
    </div>
  );
}

function FinanceChartCard() {
  const [mode, setMode] = useState("lines"); // "lines" | "profit"
  const [granularity, setGranularity] = useState("monthly"); // daily|weekly|monthly|yearly
  const [rangePreset, setRangePreset] = useState("6m"); // 7d|30d|6m|12m|custom

  // rango custom (para el gráfico)
  const [customFrom, setCustomFrom] = useState(daysAgoISO(30));
  const [customTo, setCustomTo] = useState(todayISO());

  const showCustom = rangePreset === "custom";

  const series = useMemo(
    () => generateSeries({ rangePreset, granularity, customFrom: showCustom ? customFrom : null, customTo: showCustom ? customTo : null }),
    [rangePreset, granularity, customFrom, customTo, showCustom]
  );

  const totals = useMemo(() => {
    const ingresos = series.reduce((a, b) => a + b.ingresos, 0);
    const costos = series.reduce((a, b) => a + b.costos, 0);
    return { ingresos, costos, utilidad: ingresos - costos };
  }, [series]);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-base font-semibold">{mode === "profit" ? "Utilidad" : "Ingresos vs Costos"}</h2>
          <p className="text-sm text-[var(--color-muted)]">
            Monitoreo rápido (hardcode) — presets + rango personalizado.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
          <Segmented
            value={mode}
            onChange={setMode}
            options={[
              { value: "lines", label: "Ingresos vs Costos" },
              { value: "profit", label: "Utilidad" },
            ]}
          />

          <select
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm"
            value={granularity}
            onChange={(e) => setGranularity(e.target.value)}
          >
            <option value="daily">Diaria</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensual</option>
            <option value="yearly">Anual</option>
          </select>

          <select
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm"
            value={rangePreset}
            onChange={(e) => setRangePreset(e.target.value)}
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="6m">Últimos 6 meses</option>
            <option value="12m">Últimos 12 meses</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>
      </div>

      {/* rango custom inline (best practice: aparece solo si el usuario elige "Personalizado") */}
      {showCustom && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3">
            <div className="text-xs font-semibold text-[var(--color-muted)]">Desde</div>
            <input
              type="date"
              className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
              value={customFrom}
              max={customTo}
              onChange={(e) => setCustomFrom(e.target.value)}
            />
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3">
            <div className="text-xs font-semibold text-[var(--color-muted)]">Hasta</div>
            <input
              type="date"
              className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
              value={customTo}
              min={customFrom}
              max={todayISO()}
              onChange={(e) => setCustomTo(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="mt-5">
        <LineChart series={series} mode={mode} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {mode !== "profit" ? (
          <>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3">
              <div className="text-xs text-[var(--color-muted)]">Ingresos (Σ)</div>
              <div className="text-lg font-semibold">${formatCLP(totals.ingresos)}K</div>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3">
              <div className="text-xs text-[var(--color-muted)]">Costos (Σ)</div>
              <div className="text-lg font-semibold">${formatCLP(totals.costos)}K</div>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 sm:col-span-2">
            <div className="text-xs text-[var(--color-muted)]">Utilidad (Σ ingresos − Σ costos)</div>
            <div className="text-2xl font-semibold">${formatCLP(totals.utilidad)}K</div>
            <div className="mt-1 text-xs text-[var(--color-muted)]">
              Basado en el rango y granularidad seleccionados.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TeachersListCard() {
  const [teachers, setTeachers] = useState(MOCK_TEACHERS);
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [selectedId, setSelectedId] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? teachers.filter((t) => t.name.toLowerCase().includes(q)) : teachers;
  }, [teachers, query]);

  const pageTeachers = useMemo(() => filtered.slice(0, pageSize), [filtered, pageSize]);

  const selectedTeacher = useMemo(
    () => teachers.find((t) => t.id === selectedId) ?? null,
    [teachers, selectedId]
  );

  const toggleActive = () => {
    if (!selectedTeacher) return;
    setTeachers((prev) =>
      prev.map((t) => (t.id === selectedTeacher.id ? { ...t, active: !t.active } : t))
    );
  };

  const assignCredits = () => {
    if (!selectedTeacher) return;
    // placeholder
    // eslint-disable-next-line no-alert
    alert(`Asignar créditos a: ${selectedTeacher.name}`);
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold">Profesores</h2>
          <p className="text-sm text-[var(--color-muted)]">Busca por nombre y selecciona.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-[var(--color-muted)]">Mostrar</div>
          <select
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2">
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-muted)]"
            placeholder="Buscar por nombre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="text-xs text-[var(--color-muted)]">⌕</span>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]">
        <div className="max-h-[320px] overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-[var(--color-surface)]">
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-4 py-3 text-xs font-semibold text-[var(--color-muted)]">Nombre</th>
                <th className="px-4 py-3 text-xs font-semibold text-[var(--color-muted)]">Estado</th>
              </tr>
            </thead>

            <tbody>
              {pageTeachers.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-10 text-center text-sm text-[var(--color-muted)]">
                    No hay resultados.
                  </td>
                </tr>
              ) : (
                pageTeachers.map((t) => {
                  const isSelected = t.id === selectedId;
                  return (
                    <tr
                      key={t.id}
                      className={[
                        "cursor-pointer border-b border-[var(--color-border)] last:border-b-0",
                        isSelected ? "bg-[var(--color-hover-strong)]" : "hover:bg-[var(--color-hover)]",
                      ].join(" ")}
                      onClick={() => setSelectedId(t.id)}
                    >
                      <td className="px-4 py-3 font-medium">{t.name}</td>
                      <td className="px-4 py-3">
                        <Badge active={t.active} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTeacher ? (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3">
              <div className="text-xs text-[var(--color-muted)]">Créditos disponibles</div>
              <div className="text-base font-semibold">${formatCLP(selectedTeacher.creditsAvailableCLP)} CLP</div>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3">
              <div className="text-xs text-[var(--color-muted)]">Créditos usados este mes</div>
              <div className="text-base font-semibold">${formatCLP(selectedTeacher.creditsUsedThisMonthCLP)} CLP</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SmallButton onClick={toggleActive} variant="default">
              {selectedTeacher.active ? "Desactivar" : "Activar"}
            </SmallButton>
            <SmallButton onClick={assignCredits} variant="primary">
              Asignar Créditos
            </SmallButton>
          </div>

          <div className="mt-3 text-xs text-[var(--color-muted)]">
            Seleccionado: <span className="font-semibold text-[var(--color-text)]">{selectedTeacher.name}</span>
          </div>
        </>
      ) : (
        <div className="mt-4 text-xs text-[var(--color-muted)]">
          Selecciona un profesor para ver acciones y métricas.
        </div>
      )}
    </div>
  );
}

function DownloadFinancialReportCard() {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(daysAgoISO(30));
  const [to, setTo] = useState(todayISO());

  const handleAccept = () => {
    // placeholder: aquí después llamamos endpoint + descargamos archivo
    // eslint-disable-next-line no-alert
    alert(`Descargar informe financiero desde ${from} hasta ${to}`);
    setOpen(false);
  };

  return (
    <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold">Informe Financiero</h3>
          <p className="text-sm text-[var(--color-muted)]">
            Exporta un informe por intervalo de fechas.
          </p>
        </div>

        <SmallButton variant="primary" onClick={() => setOpen((v) => !v)}>
          Descargar Informe Financiero
        </SmallButton>
      </div>

      {open && (
        <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs font-semibold text-[var(--color-muted)]">Desde</div>
              <input
                type="date"
                className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                value={from}
                max={to}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-[var(--color-muted)]">Hasta</div>
              <input
                type="date"
                className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                value={to}
                min={from}
                max={todayISO()}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <SmallButton variant="default" onClick={() => setOpen(false)}>
              Cancelar
            </SmallButton>
            <SmallButton variant="primary" onClick={handleAccept} disabled={!from || !to}>
              Aceptar
            </SmallButton>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ACSuperView() {
  return (
    <>
      <PageHeader title="AC Super View" subtitle="Monitoreo y control general" />

      <div className="mt-6 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <FinanceChartCard />
            </div>
            <div className="lg:col-span-5">
              <TeachersListCard />
            </div>
          </div>

          {/* 👇 Nuevo: descarga informe financiero */}
          <DownloadFinancialReportCard />
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
            <div className="py-10 text-center text-sm text-[var(--color-muted)]">
              Próximo bloque: actividad / auditoría / eventos del sistema.
            </div>
          </div>
      </div>
    </>
  );
}
