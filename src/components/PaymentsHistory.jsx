import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/axios";
import { useAuth } from "../context/AuthProvider";

const statusMap = {
  paid: { label: "Pagado", className: "bg-emerald-100 text-emerald-700" },
  pending: { label: "Pendiente", className: "bg-amber-100 text-amber-700" },
  failed: { label: "Rechazado", className: "bg-rose-100 text-rose-700" },
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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/payments");
        setPayments(res.data || []);
      } catch (err) {
        console.error("[PaymentsHistory] error", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const totalAmount = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const totalCredits = payments.reduce((sum, p) => sum + (Number(p.credits) || 0), 0);
    return { totalAmount, totalCredits };
  }, [payments]);

  const availableCredits = Number(user?.remaining_credits ?? user?.credits ?? 0);
  const usedCredits = Math.max(stats.totalCredits - availableCredits, 0);

  const filteredPayments = useMemo(() => {
    const searchLower = search.toLowerCase();
    return payments.filter((payment) => {
      const desc = payment.description?.toLowerCase() || "";
      const status = payment.status?.toLowerCase() || "";
      const id = payment.id?.toString() || "";
      return desc.includes(searchLower) || status.includes(searchLower) || id.includes(searchLower);
    });
  }, [payments, search]);

  return (
    <div className="space-y-6">
      {/* Buscador y totales */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Buscar en historial"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-72 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        <div className="flex items-center gap-4 text-sm text-slate-700">
          <div className="px-4 py-2 rounded-xl bg-white border border-slate-100 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Total gastado</p>
            <p className="text-lg font-semibold text-slate-900">{formatCLP(stats.totalAmount)}</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white border border-slate-100 shadow-sm hidden sm:block">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Créditos comprados</p>
            <p className="text-lg font-semibold text-slate-900">{stats.totalCredits.toLocaleString()} créditos</p>
          </div>
        </div>
      </div>

      {/* Vista de uso de créditos (gráfica simple) */}
      <div className="rounded-3xl border border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 shadow-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Uso de créditos</p>
            <p className="text-xs text-slate-600">Disponible vs usado según compras</p>
          </div>
          <div className="flex gap-3 text-xs text-slate-700">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">● Usados ({usedCredits.toLocaleString()})</span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">● Disponibles ({availableCredits.toLocaleString()})</span>
          </div>
        </div>
        <div className="mt-4 h-28 rounded-2xl bg-white border border-slate-100 shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-blue-50 to-emerald-100 opacity-80" />
          <div className="relative h-full flex items-end gap-2 px-4 pb-3">
            <div className="flex-1 flex flex-col justify-end">
              <div
                className="w-full rounded-full bg-indigo-500"
                style={{ height: `${Math.min(100, usedCredits && stats.totalCredits ? (usedCredits / (stats.totalCredits || 1)) * 100 : 20)}%` }}
              />
              <p className="text-[11px] text-slate-600 mt-1 text-center">Usados</p>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <div
                className="w-full rounded-full bg-emerald-500"
                style={{ height: `${Math.min(100, availableCredits && (availableCredits + usedCredits) ? (availableCredits / (availableCredits + usedCredits || 1)) * 100 : 20)}%` }}
              />
              <p className="text-[11px] text-slate-600 mt-1 text-center">Disponibles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table / list */}
      <div className="rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-5 py-4 bg-gradient-to-r from-slate-50 via-white to-white border-b border-slate-100">
          <div>
            <p className="text-sm font-semibold text-slate-900">Movimientos recientes</p>
            <p className="text-xs text-slate-600">Revisa tus compras y usos de créditos.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-2 py-1">● Pagado</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 px-2 py-1">● Pendiente</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 text-rose-700 px-2 py-1">● Rechazado</span>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-12 px-5 py-3 text-[11px] uppercase tracking-wide text-slate-500 bg-slate-50 border-b border-slate-100">
          <span className="col-span-3">Orden / Fecha</span>
          <span className="col-span-4">Descripción</span>
          <span className="col-span-2">Créditos</span>
          <span className="col-span-2">Monto</span>
          <span className="col-span-1 text-right">Estado</span>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="px-5 py-6 text-sm text-slate-500">Cargando historial...</div>
          ) : filteredPayments.length === 0 ? (
            <div className="px-5 py-6 text-sm text-slate-500">No se encontraron pagos.</div>
          ) : (
            filteredPayments.map((payment) => {
              const credits = Number(payment.credits) || 0;
              const date = payment.createdAt
                ? new Date(payment.createdAt).toLocaleDateString("es-CL", { dateStyle: "medium" })
                : "";
              const status =
                statusMap[payment.status] || {
                  label: payment.status || "Sin estado",
                  className: "bg-slate-100 text-slate-700",
                };

              return (
                <div
                  key={payment.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="md:col-span-3">
                    <p className="font-semibold text-slate-900">Orden #{payment.id}</p>
                    <p className="text-xs text-slate-500">{date}</p>
                  </div>

                  <div className="md:col-span-4">
                    <p className="font-semibold text-slate-900">
                      {payment.description || `Compra de ${credits} créditos`}
                    </p>
                    <p className="text-xs text-slate-500">ID transacción: {payment.id}</p>
                  </div>

                  <div className="md:col-span-2 text-slate-800">
                    <p className="text-xs text-slate-500">Créditos</p>
                    <p className="font-semibold">{credits.toLocaleString()}</p>
                  </div>

                  <div className="md:col-span-2 text-slate-800">
                    <p className="text-xs text-slate-500">Monto</p>
                    <p className="font-semibold">
                      {payment.amount ? `${payment.amount} ${payment.currency || "CLP"}` : "-"}
                    </p>
                  </div>

                  <div className="md:col-span-1 flex md:justify-end items-start">
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

      <div className="flex justify-between items-center text-sm text-slate-600">
        <span>Mostrando {filteredPayments.length || 0} pagos</span>
        <div className="flex gap-3">
          <button className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">Anterior</button>
          <button className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
}
