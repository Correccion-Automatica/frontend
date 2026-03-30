import React, { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { useAuth } from "../../context/AuthProvider";

const categories = [
  { value: "soporte-técnico", label: "Soporte técnico" },
  { value: "facturación", label: "Facturación y pagos" },
  { value: "producto", label: "Producto y funcionalidades" },
  { value: "otra-consulta", label: "Otra consulta" },
];

export default function Support() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    consultationType: "soporte-técnico",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // success | error
  const [ticketId, setTicketId] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName || user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message || !formData.consultationType) {
      setStatus("error");
      return;
    }
    setSubmitting(true);
    setStatus(null);
    setTicketId(null);
    try {
      const body = {
        ...formData,
        email: user?.email || formData.email,
        name: user?.fullName || user?.name || formData.name,
      };
      const res = await api.post("/contact", body);
      if (res.data?.success) {
        setStatus("success");
        setTicketId(res.data.ticketId || null);
        setFormData((prev) => ({
          ...prev,
          message: "",
        }));
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("[support] error enviando ticket", err);
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <p className="text-sm font-semibold text-[var(--color-muted)] uppercase tracking-wide">
            Ayuda y soporte
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
            Envíanos tu solicitud
          </h1>
          <p className="mt-2 text-[var(--color-muted)]">
          Usaremos tu correo registrado para darte seguimiento.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl bg-[var(--color-surface)] shadow p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">Crear ticket</h2>

            {status === "success" && (
              <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-800 px-4 py-3">
                Mensaje enviado correctamente.{" "}
                {ticketId ? ` Ticket: ${ticketId}` : ""} Revisa tu correo y el del proyecto para el comprobante.
              </div>
            )}
            {status === "error" && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3">
                No pudimos enviar tu ticket. Intenta nuevamente.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Tipo de consulta *
                </label>
                <select
                  name="consultationType"
                  value={formData.consultationType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled
                    className="w-full rounded-lg border border-[var(--color-border)] bg-gray-100 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    className="w-full rounded-lg border border-[var(--color-border)] bg-gray-100 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Mensaje *
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm"
                  placeholder="Describe tu problema o solicitud..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto inline-flex items-center justify-center px-5 py-3 rounded-lg bg-[var(--color-primary)] text-[var(--color-onprimary)] font-semibold disabled:opacity-60"
              >
                {submitting ? "Enviando..." : "Enviar ticket"}
              </button>
            </form>
          </div>

          <aside className="rounded-2xl bg-white dark:bg-gray-900 shadow p-6 sm:p-8 space-y-4">
            <div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">Tiempo de respuesta</div>
              <div className="text-sm text-gray-800 dark:text-gray-100">Menos de 24 horas hábiles.</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">Estado del ticket</div>
              <div className="text-sm text-gray-800 dark:text-gray-100">
                Recibirás el número de ticket en tu correo y en el correo del proyecto para seguimiento.
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Usa este canal solo para problemas técnicos o facturación. Para preguntas generales, revisa FAQ.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
