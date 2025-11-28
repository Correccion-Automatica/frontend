import React from "react";

export default function Groups() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Foros de grupos</h2>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <p className="mb-2 text-gray-700 dark:text-gray-200">Respuestas de la IA al feedback de cada alumno:</p>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          <li className="py-2">
            <span className="font-semibold">Juan Pérez:</span> "Tu respuesta sobre el tema 1 fue clara, pero puedes mejorar la argumentación."
          </li>
          <li className="py-2">
            <span className="font-semibold">María López:</span> "Excelente análisis en la pregunta 2. Sigue así."
          </li>
          <li className="py-2">
            <span className="font-semibold">Carlos Ruiz:</span> "Revisa la estructura de tu ensayo para mayor claridad."
          </li>
        </ul>
      </div>
    </div>
  );
}
