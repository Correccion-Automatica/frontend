import React from "react";
import PaymentsHistory from "../../components/PaymentsHistory";
import { Link } from "react-router-dom";
import CreditOptionDisplay from "../../components/CreditOptionDisplay";
import { useAuth } from "../../context/AuthProvider";

export default function PaymentsHistoryPage() {
  const { user } = useAuth();
  const userName = user?.fullName || user?.name || user?.email || "Usuario";
  const credits = Number(user?.remaining_credits ?? user?.credits ?? 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d10] py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between text-slate-900 dark:text-slate-100">
          <div>
            <h1 className="text-2xl font-bold">Historial de pagos</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">Revisa tus compras y movimientos de créditos.</p>
          </div>
          <Link
            to="/teacher-profile"
            className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200 underline-offset-2 hover:underline"
          >
            Volver al perfil
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <aside className="w-full md:w-80 bg-white dark:bg-[#121218] shadow-xl rounded-3xl border border-slate-100 dark:border-[#1c1c20] p-4">
            <CreditOptionDisplay userName={userName} credits={credits} />
          </aside>

          <div className="flex-1 bg-white dark:bg-[#121218] shadow-2xl rounded-3xl border border-slate-100 dark:border-[#1c1c20] p-6">
            <PaymentsHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
