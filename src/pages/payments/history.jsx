import React from "react";
import PaymentsHistory from "../../components/PaymentsHistory";
import { Link } from "react-router-dom";

export default function PaymentsHistoryPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Historial de pagos</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Revisa tus compras y movimientos de créditos.
            </p>
          </div>
          <Link
            to="/teacher-profile"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Volver al perfil
          </Link>
        </div>
        <PaymentsHistory />
      </div>
    </div>
  );
}
