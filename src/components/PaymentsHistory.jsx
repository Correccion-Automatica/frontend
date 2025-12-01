import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/axios";
import { useAuth } from "../context/AuthProvider";

const statusMap = {
  paid: { label: "Pagado", className: "bg-green-100 text-green-700" },
  pending: { label: "Pendiente", className: "bg-yellow-100 text-yellow-700" },
  failed: { label: "Rechazado", className: "bg-red-100 text-red-700" },
};

const formatCLP = (value) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value);

export default function PaymentsHistory() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Créditos disponibles</p>
          <p className="text-2xl font-semibold text-gray-900">{availableCredits.toLocaleString()} créditos</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total gastado</p>
            <p className="font-semibold">{formatCLP(stats.totalAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Créditos comprados</p>
            <p className="font-semibold">{stats.totalCredits.toLocaleString()} créditos</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Cargando historial...</div>
      ) : payments.length === 0 ? (
        <div className="text-sm text-gray-500">Aún no hay pagos registrados.</div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => {
            const credits = Number(payment.credits) || 0;
            const date = payment.createdAt
              ? new Date(payment.createdAt).toLocaleDateString("es-CL", { dateStyle: "medium" })
              : "";
            const status = statusMap[payment.status] || { label: payment.status || "Sin estado", className: "bg-slate-100 text-slate-700" };

            return (
              <div
                key={payment.id}
                className="border border-slate-100 rounded-xl p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-900">{payment.description || `Compra de ${credits} créditos`}</p>
                  <p className="text-xs text-gray-500">
                    Orden #{payment.id} · {date} · {credits} créditos
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <p className="font-semibold text-gray-900">
                    {payment.amount ? `${payment.amount} ${payment.currency || "CLP"}` : "-"}
                  </p>
                  <span className={`inline-flex items-center justify-center text-xs font-semibold px-3 py-1 rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
