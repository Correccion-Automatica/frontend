import React from "react";

export default function Inbox() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Bandeja de entrada</h2>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <p className="mb-2 text-gray-700 dark:text-gray-200">Simulación de correo institucional:</p>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          <li className="py-2 flex justify-between items-center">
            <span className="font-semibold">Asunto: Reunión de coordinación</span>
            <span className="text-xs text-gray-500">01/11/2025</span>
          </li>
          <li className="py-2 flex justify-between items-center">
            <span className="font-semibold">Asunto: Feedback IA entregado</span>
            <span className="text-xs text-gray-500">31/10/2025</span>
          </li>
          <li className="py-2 flex justify-between items-center">
            <span className="font-semibold">Asunto: Actualización de curso</span>
            <span className="text-xs text-gray-500">30/10/2025</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
