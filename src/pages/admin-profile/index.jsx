import React from "react";
import { useNavigate } from "react-router-dom";
import CardGridCareers from "../../components/CardGridCareers";
import ButtonPrimary from "../../components/ButtonPrimary"; 
import PageHeader from "../../components/PageHeader"; 


export default function AdminProfile() {
  const navigate = useNavigate();

  const faculties = [
    { id: "ingenieria", name: "Ingeniería", courses: 250 },
    { id: "derecho", name: "Derecho", courses: 200 },
    { id: "medicina", name: "Medicina", courses: 300 },
    { id: "arquitectura", name: "Arquitectura", courses: 100 },
    { id: "psicologia", name: "Psicología", courses: 100 },
    { id: "diseno", name: "Diseño", courses: 200 },
    { id: "antropologia", name: "Antropología" },
    { id: "cienciapolitica", name: "Ciencia Política" },
    { id: "ingenieriacomercial", name: "Ingeniería Comercial" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <PageHeader columns={["Creación de pautas"]} showBack={false} />

      {/* Botón central */}
      <div className="flex justify-center py-8">
        <ButtonPrimary onClick={() => navigate("/admin-profile/general")}>
          Ver información general
        </ButtonPrimary>
      </div>

      {/* Grid de facultades */}
      <div className="px-6 pb-12">
        <CardGridCareers data={faculties} basePath="/admin-profile/faculty" />
      </div>
    </div>
  );
}
