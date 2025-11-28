import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ButtonPrimary from "./ButtonPrimary";


// Interactive credit block: shows user name, available credits and a small
// spending mini-chart when data is available. This component is presentational
// and deliberately avoids side-effects. It accepts a `user` object so it can
// be safely used where `user` comes from the Auth context.
export default function CreditOptionInteractive({ user }) {
  const [expanded, setExpanded] = useState(false);

  const userName = user?.fullName || user?.name || "Usuario";
  const credits = Number(user?.credits ?? 0);

  // Optional spend history: array of numbers (e.g. monthly spend).
  // If the backend provides `user.spendHistory` we'll render it.
  // In development, when there's no backend data, show example data so the
  // UI is visible and usable for design/testing.
  const isDev = Boolean(import.meta.env && import.meta.env.DEV);
  const spendHistoryFromUser = Array.isArray(user?.spendHistory) && user.spendHistory.length > 0
    ? user.spendHistory
    : null;

  const [devSpendData, setDevSpendData] = useState(null);

  useEffect(() => {
    // If in dev and there is no backend-provided spend history, try to fetch
    // the dev-only endpoint which returns sample data from the server side.
    if (!isDev) return;
    if (spendHistoryFromUser) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/users/me/spend-dev', { credentials: 'include' });
        if (!res.ok) return;
        const body = await res.json();
        if (cancelled) return;
        setDevSpendData(body);
      } catch (err) {
        // ignore network errors in dev
      }
    })();

    return () => { cancelled = true; };
  }, [isDev, spendHistoryFromUser]);

  const sampleSpend = [120, 90, 70, 40, 20, 10];
  const spendHistory = spendHistoryFromUser || devSpendData?.spendHistory || (isDev ? sampleSpend : null);
  const usingSampleDev = !spendHistoryFromUser && Boolean((devSpendData && devSpendData.spendHistory) || (isDev && spendHistory));
  // If the dev endpoint returned credits, prefer that value for display in dev.
  const creditsOverride = devSpendData?.credits;
  const creditsToShow = creditsOverride ?? credits;

  // Render a tiny sparkline-like bar chart using svg. Values array should be
  // small (<=12). This is purely presentational.
  const Sparkline = ({ values = [] }) => {
    if (!values || values.length === 0) return null;
    const max = Math.max(...values, 1);
    const barWidth = 12;
    const gap = 6;
    const width = values.length * (barWidth + gap);
    const height = 40;

    return (
      <svg width={width} height={height} role="img" aria-label="gasto reciente">
        {values.map((v, i) => {
          const h = Math.round((v / max) * (height - 8));
          const x = i * (barWidth + gap);
          const y = height - h;
          return (
            <rect key={i} x={x} y={y} width={barWidth} height={h} rx="3" fill="#60a5fa" />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="mt-6 w-full">
      <div className="bg-[var(--color-surface)] dark:bg-black border border-[var(--color-border)] dark:border-gray-800 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Créditos</div>
            <div className="text-lg font-bold mt-1 text-gray-900 dark:text-white">
              {creditsToShow?.toLocaleString ? creditsToShow.toLocaleString() : creditsToShow} créditos
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{userName}</div>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setExpanded((s) => !s)}
              className="text-sm px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {expanded ? "Cerrar" : "Detalles"}
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          {/* Redirect to the full Purchase page (responsive + selection) */}
          <button
            type="button"
            onClick={() => {
              // navigate to purchase page where user can pick quantity and see price
              // use location fallback if hook unavailable in this context
              try { window.location.href = '/payments/purchase'; } catch(e) { /* ignore */ }
            }}
            className={`inline-flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold`}
          >
            Comprar créditos
          </button>

          {user?.organizationId && (
            <Link to="/contact" className="inline-flex items-center justify-center px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
              Solicitar créditos a mi organización
            </Link>
          )}
        </div>

        {/* Expandable details */}
        <div className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-[400px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
          <div className="p-3 bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 mt-2">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Resumen de uso</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Últimos meses</div>
            </div>

            {spendHistory ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Sparkline values={spendHistory} />
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Total: <span className="font-medium">${spendHistory.reduce((a, b) => a + b, 0).toLocaleString()}</span>
                  </div>
                </div>
                {usingSampleDev && (
                  <div className="text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">Datos de ejemplo (dev)</div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">No hay datos de gasto disponibles.</div>
            )}

            <div className="mt-4">
              {/* Use same create-payment flow here so expanded CTA behaves like main CTA */}
              <ButtonPrimary onClick={() => { try { window.location.href = '/payments/purchase'; } catch(e){} }} className="w-full">Comprar más créditos</ButtonPrimary>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Precios de referencia: creación de pauta desde $1.000 + $250 por iteración; corrección a partir de $5 por 100 ítems.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CreditOptionInteractive.propTypes = {
  user: PropTypes.object,
};