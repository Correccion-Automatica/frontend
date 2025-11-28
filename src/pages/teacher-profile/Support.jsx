import React from "react";

export default function Support() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Ayuda y soporte</h2>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <p className="mb-2 text-gray-700 dark:text-gray-200">¿Necesitas ayuda? Aquí tienes recursos institucionales:</p>
        <ul className="list-disc pl-6">
          <li>Guía de uso de la plataforma</li>
          <li>Contacto de soporte técnico: soporte@institucion.edu</li>
          <li>Preguntas frecuentes</li>
          <li>Manual de buenas prácticas</li>
        </ul>
      </div>
    </div>
  );
}
