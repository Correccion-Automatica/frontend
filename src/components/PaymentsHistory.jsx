import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/axios";
import { useAuth } from "../context/AuthProvider";

const statusMap = {
  paid: { label: "Pagado", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200" },
  pending: { label: "Pendiente", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200" },
  failed: { label: "Rechazado", className: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200" },
  rejected: { label: "Rechazado", className: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200" },
};

const formatCLP = (value) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function PaymentsHistory() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({
    totalSpent: 0,
    creditsPurchased: 0,
    creditsAvailable: 0,
    creditsUsed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // 1) Traer pagos
        const paymentsRes = await api.get("/payments", { withCredentials: true }).catch(() => null);
        const paymentsData = paymentsRes?.data || [];
        setPayments(paymentsData);

        // 2) Traer resumen; si falla, calcular a partir de pagos y créditos del usuario
        const summaryRes = await api.get("/payments/summary", { withCredentials: true }).catch(() => null);
        if (summaryRes?.data) {
          setSummary({
            totalSpent: Number(summaryRes.data.totalSpent) || 0,
            creditsPurchased: Number(summaryRes.data.creditsPurchased) || 0,
            creditsAvailable: Number(summaryRes.data.creditsAvailable) || 0,
            creditsUsed: Number(summaryRes.data.creditsUsed) || 0,
          });
        } else {
          const paidOnly = paymentsData.filter((p) => p.status === "paid");
          const totalSpent = paidOnly.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
          const creditsPurchased = paidOnly.reduce((sum, p) => sum + (Number(p.credits) || 0), 0);
          const creditsAvailable = Number(user?.remaining_credits ?? user?.remainingCredits ?? 0);
          const creditsUsed = Math.max(creditsPurchased - creditsAvailable, 0);
          setSummary({ totalSpent, creditsPurchased, creditsAvailable, creditsUsed });
        }
      } catch (err) {
        console.error("[PaymentsHistory] error", err);
        const creditsAvailable = Number(user?.remaining_credits ?? user?.remainingCredits ?? 0);
        setSummary({ totalSpent: 0, creditsPurchased: 0, creditsAvailable, creditsUsed: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.remaining_credits, user?.remainingCredits]);

  const availableCredits = Number(summary.creditsAvailable || 0);
  const usedCredits = Number(summary.creditsUsed || 0);
  const totalCreditsBar = availableCredits + usedCredits || 1;

  const filteredPayments = useMemo(() => {
    const searchLower = search.toLowerCase();
    return (payments || []).filter((payment) => {
      const desc = payment.description?.toLowerCase() || "";
      const status = payment.status?.toLowerCase() || "";
      const id = payment.id?.toString() || "";
      return desc.includes(searchLower) || status.includes(searchLower) || id.includes(searchLower);
    });
  }, [payments, search]);

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* Buscador y totales */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Buscar en historial"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-72 rounded-xl border border-slate-200 dark:border-[#1c1c20] bg-white dark:bg-[#0f1016] px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500"
        />
        <div className="flex items-center gap-4 text-sm text-slate-700 dark:text-slate-200">
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-[#0f1016] border border-slate-100 dark:border-[#1c1c20] shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Total pagado (CLP)</p>
            <p className="text-lg font-semibold">{formatCLP(summary.totalSpent)}</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-[#0f1016] border border-slate-100 dark:border-[#1c1c20] shadow-sm hidden sm:block">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Créditos comprados</p>
            <p className="text-lg font-semibold">{summary.creditsPurchased.toLocaleString()} créditos</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-[#0f1016] border border-slate-100 dark:border-[#1c1c20] shadow-sm hidden sm:block">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Créditos usados</p>
            <p className="text-lg font-semibold">{usedCredits.toLocaleString()} créditos</p>
          </div>
        </div>
      </div>

      {/* Vista de uso de créditos */}
      <div className="rounded-3xl border border-slate-100 dark:border-[#1c1c20] bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-[#0f1016] dark:via-[#0b0d13] dark:to-[#0f1016] shadow-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Uso de créditos</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">Disponible vs usado según compras</p>
          </div>
          <div className="flex gap-3 text-xs text-slate-700 dark:text-slate-200">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200">● Usados ({usedCredits.toLocaleString()})</span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200">● Disponibles ({availableCredits.toLocaleString()})</span>
          </div>
        </div>
        <div className="mt-4 h-28 rounded-2xl bg-white dark:bg-[#0f1016] border border-slate-100 dark:border-[#1c1c20] shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-blue-50 to-emerald-100 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-emerald-900/30 opacity-80" />
          <div className="relative h-full flex items-end gap-2 px-4 pb-3">
            <div className="flex-1 flex flex-col justify-end">
              <div
                className="w-full rounded-full bg-indigo-500"
                style={{ height: `${Math.min(100, (usedCredits / totalCreditsBar) * 100)}%` }}
              />
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 text-center">Usados</p>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <div
                className="w-full rounded-full bg-emerald-500"
                style={{ height: `${Math.min(100, (availableCredits / totalCreditsBar) * 100)}%` }}
              />
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 text-center">Disponibles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla / lista */}
      <div className="rounded-3xl bg-white dark:bg-[#0f1016] shadow-2xl border border-slate-100 dark:border-[#1c1c20] overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-5 py-4 bg-gradient-to-r from-slate-50 via-white to-white dark:from-[#0f1016] dark:via-[#0b0d13] dark:to-[#0f1016] border-b border-slate-100 dark:border-[#1c1c20]">
          <div>
            <p className="text-sm font-semibold">Movimientos recientes</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">Revisa tus compras y usos de créditos.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-200">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200 px-2 py-1">● Pagado</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200 px-2 py-1">● Pendiente</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200 px-2 py-1">● Rechazado</span>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-12 px-5 py-3 text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-300 bg-slate-50 dark:bg-[#0b0d13] border-b border-slate-100 dark:border-[#1c1c20]">
          <span className="col-span-2">Orden / Fecha</span>
          <span className="col-span-4">Descripción</span>
          <span className="col-span-2">Créditos</span>
          <span className="col-span-2">Monto</span>
          <span className="col-span-2 text-right">Estado</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-[#1c1c20]">
          {loading ? (
            <div className="px-5 py-6 text-sm text-slate-500 dark:text-slate-300">Cargando historial...</div>
          ) : filteredPayments.length === 0 ? (
            <div className="px-5 py-6 text-sm text-slate-500 dark:text-slate-300">No se encontraron pagos.</div>
          ) : (
            filteredPayments.map((payment) => {
              const credits = Number(payment.credits) || 0;
              const date = payment.createdAt
                ? new Date(payment.createdAt).toLocaleDateString("es-CL", { dateStyle: "medium" })
                : "";
              const status =
                statusMap[payment.status] || {
                  label: payment.status || "Sin estado",
                  className: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
                };

              return (
                <div
                  key={payment.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-[#111319] transition-colors"
                >
                  <div className="md:col-span-2">
                    <p className="font-semibold">Orden #{payment.id}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">{date}</p>
                  </div>

                  <div className="md:col-span-4">
                    <p className="font-semibold">
                      {payment.description || `Compra de ${credits} créditos`}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">ID transacción: {payment.id}</p>
                  </div>

                  <div className="md:col-span-2 text-slate-800 dark:text-slate-100">
                    <p className="text-xs text-slate-500 dark:text-slate-300">Créditos</p>
                    <p className="font-semibold">{credits.toLocaleString()}</p>
                  </div>

                  <div className="md:col-span-2 text-slate-800 dark:text-slate-100">
                    <p className="text-xs text-slate-500 dark:text-slate-300">Monto</p>
                    <p className="font-semibold">
                      {payment.amount ? `${payment.amount} ${payment.currency || "CLP"}` : "-"}
                    </p>
                  </div>

                  <div className="md:col-span-2 flex md:justify-end items-start">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-300">
        <span>Mostrando {filteredPayments.length || 0} pagos</span>
        <div className="flex gap-3">
          <button className="px-3 py-1 rounded-lg border border-slate-200 dark:border-[#1c1c20] bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-[#111319]">Anterior</button>
          <button className="px-3 py-1 rounded-lg border border-slate-200 dark:border-[#1c1c20] bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-[#111319]">Siguiente</button>
        </div>
      </div>
    </div>
  );
}
