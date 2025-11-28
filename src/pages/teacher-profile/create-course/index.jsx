import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../../components/PageHeader";
import ButtonPrimary from "../../../components/ButtonPrimary";
import { api } from "../../../lib/axios";

export default function CreateCourse() {
  const [form, setForm] = useState({
    name: "",
    acronym: "",
    year: new Date().getFullYear(),
    semester: "1",
    periodType: "SEMESTER",
  });
  const [createdCourse, setCreatedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.acronym.trim()) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const period = `${form.year}-${form.semester}`;
      const payload = {
        name: form.name,
        acronym: form.acronym,
        period,
        periodType: form.periodType,
      };

      const response = await api.post("/courses", payload);
      console.log("✅ Curso creado (respuesta completa):", response.data);

      // 🔹 Tomamos el curso correctamente del backend
      const course = response.data.course;

      setCreatedCourse(course);

      // 🔸 Si quieres redirigir automáticamente al curso recién creado:
      // navigate(`/teacher-profile/course-view/${course.id}`);
    } catch (err) {
      console.error("❌ Error al crear curso:", err);
      setError("No se pudo crear el curso. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const yearOptions = Array.from({ length: 7 }, (_, i) => 2024 + i);

  return (
    <div className="mt-6 px-4 space-y-6">
      <PageHeader columns={["Crear Curso"]} />

      <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm p-8 max-w-lg mx-auto text-center">
        {!createdCourse ? (
          <>
            <h1 className="text-xl font-bold mb-6">Creación de nuevo curso</h1>

            <input
              type="text"
              name="name"
              placeholder="Nombre del curso"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 mb-4 rounded-lg border 
                         bg-[var(--color-background)] text-[var(--color-text)]
                         border-[var(--color-border)]
                         focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />

            <input
              type="text"
              name="acronym"
              placeholder="Código o acrónimo (ej: IIC2764)"
              value={form.acronym}
              onChange={handleChange}
              className="w-full p-3 mb-4 rounded-lg border 
                         bg-[var(--color-background)] text-[var(--color-text)]
                         border-[var(--color-border)]
                         focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />

            {/* Año y periodo */}
            <div className="flex gap-4 mb-6">
              {/* Selector de año */}
              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                className="w-1/2 p-3 rounded-lg border 
                          bg-[var(--color-background)] text-[var(--color-text)]
                          border-[var(--color-border)]
                          focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              {/* Mostrar semestre/bimestre solo si corresponde */}
              {form.periodType !== "ANNUAL" && (
                <select
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  className="w-1/2 p-3 rounded-lg border 
                            bg-[var(--color-background)] text-[var(--color-text)]
                            border-[var(--color-border)]
                            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  {form.periodType === "SEMESTER" && (
                    <>
                      <option value="1">1° Semestre</option>
                      <option value="2">2° Semestre</option>
                    </>
                  )}
                  {form.periodType === "BIMONTHLY" &&
                    Array.from({ length: 6 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}° Bimestre
                      </option>
                    ))}
                </select>
              )}
            </div>

            {/* Tipo de periodo */}
            <select
              name="periodType"
              value={form.periodType}
              onChange={handleChange}
              className="w-full p-3 mb-6 rounded-lg border 
                        bg-[var(--color-background)] text-[var(--color-text)]
                        border-[var(--color-border)]
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="ANNUAL">Anual</option>
              <option value="SEMESTER">Semestral</option>
              <option value="BIMONTHLY">Bimensual</option>
            </select>


            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <ButtonPrimary onClick={handleCreate} disabled={loading}>
              {loading ? "Creando curso..." : "Crear curso"}
            </ButtonPrimary>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold mb-6">
              Curso "{createdCourse.name}" creado con éxito 🎉
            </h1>

            <Link
              to="/teacher-profile"
              state={{
                successMessage: `Curso "${createdCourse.name}" creado con éxito`,
              }}
            >
              <ButtonPrimary>Volver a mis cursos</ButtonPrimary>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
