import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ButtonPrimary from "../../../components/ButtonPrimary";
import TableSimpleInCardAdmin from "../../../components/TableSimpleInCardAdmin";
import PageHeader from "../../../components/PageHeader"; 

export default function FacultyPage() {
  const { id } = useParams(); // id de la facultad en la ruta
  const navigate = useNavigate();

  // 🔹 Ejemplo de cursos de prueba (deberías traerlos del backend según el id)
  const courses = [
    { id: 1, title: "Marketing Estratégico", professor: "Carolina Martínez" },
    { id: 2, title: "Marketing", professor: "Carolina Martínez" },
    { id: 3, title: "Gestión de Operaciones", professor: "Alejandro McCawley" },
    { id: 4, title: "CCT", professor: "Francisco García <3" },
    { id: 5, title: "Desarrollo de Software", professor: "Gonzalo Martínez" },
    { id: 6, title: "Finanzas", professor: "Rodrigo González" },
    { id: 7, title: "Hormigón Armado", professor: "Rodrigo Jordan" },
    { id: 8, title: "Termodinámica", professor: "Sebastián Ormazábal" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Header principal */}

      <PageHeader columns={["Cursos"]} showBack={false} />

      {/* Tabla de cursos */}
      <div className="px-6 py-8">
        <TableSimpleInCardAdmin data={courses} basePath={`/admin-profile/faculty/${id}/course`} />
      </div>
    </div>
  );
}
