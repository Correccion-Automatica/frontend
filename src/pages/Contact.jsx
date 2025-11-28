import React, { useState } from "react";
import { api } from '../lib/axios.js';

const faqs = [
  {
    question: "¿Cómo funciona la corrección automática?",
    answer: "La plataforma utiliza algoritmos avanzados para comparar las respuestas con los criterios definidos en la rúbrica y asignar puntajes automáticamente."
  },
  {
    question: "¿Qué tipos de evaluaciones pueden corregirse?",
    answer: "Ensayos, entrevistas, análisis de caso y cualquier respuesta abierta que pueda ser evaluada con una rúbrica."
  },
  {
    question: "¿Cuánto cuesta utilizar la plataforma?",
    answer: "Ofrecemos diferentes planes según el volumen de correcciones y las funcionalidades requeridas. Solicita una demo para cotización personalizada."
  },
  {
    question: "¿Qué tan precisa es la corrección automática?",
    answer: "La precisión depende de la calidad de la rúbrica y los criterios definidos. Nuestro sistema está diseñado para maximizar la objetividad y consistencia."
  }
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    consultationType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await api.post('/contact', formData);
      
      if (response.data.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          message: '',
          consultationType: ''
        });
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-screen bg-[var(--color-background)] pb-12 md:pb-16 lg:pb-20"
      style={{ fontFamily: "Inter, Arial, sans-serif" }}
    >
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-12 lg:px-8 lg:pt-16">
        
        <div className="mb-8 md:mb-12">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-[var(--color-muted)] md:text-base">
            SOPORTE
          </p>
          <h1 className="mb-3 text-3xl font-extrabold text-[var(--color-text)] sm:text-4xl md:text-5xl lg:text-6xl">
            Contáctanos
          </h1>
          <p className="max-w-2xl text-base text-[var(--color-muted)] sm:text-lg md:text-xl">
            ¿Tienes preguntas sobre nuestra plataforma? Estamos aquí para ayudarte a democratizar la evaluación educativa.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-6 lg:col-span-2 lg:space-y-8">
            <div className="rounded-3xl bg-[var(--color-surface)] p-6 shadow-lg transition-all sm:p-8 lg:p-10">
              <h2 className="mb-4 text-lg font-bold text-[var(--color-primary)] sm:mb-6 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                Envíanos un mensaje
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {submitStatus === 'success' && (
                  <div className="rounded-xl bg-[var(--color-success-bg)] px-4 py-3 font-semibold text-[var(--color-success-text)]">
                     Mensaje enviado correctamente. Te responderemos pronto.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="rounded-xl bg-[var(--color-error-bg)] px-4 py-3 font-semibold text-[var(--color-error-text)]">
                     Error al enviar el mensaje. Verifica que todos los campos estén completos.
                  </div>
                )}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text)] sm:text-base">
                    Tipo de consulta
                  </label>
                  <select 
                    name="consultationType"
                    value={formData.consultationType}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm text-[var(--color-text)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] sm:text-base"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="soporte-tecnico">Soporte técnico</option>
                    <option value="demo">Demo</option>
                    <option value="precios">Precios</option>
                    <option value="otra-consulta">Otra consulta</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[var(--color-text)] sm:text-base">Nombre completo *</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm text-[var(--color-text)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[var(--color-text)] sm:text-base">Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm text-[var(--color-text)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] sm:text-base"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text)] sm:text-base">Mensaje *</label>
                  <textarea 
                    rows={4} 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Describe tu consulta o necesidad..."
                    className="w-full resize-y rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm text-[var(--color-text)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] sm:text-base"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full rounded-3xl bg-[var(--color-primary)] py-3 text-base font-bold text-[var(--color-onprimary)] transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:py-4 sm:text-lg lg:text-xl"
                >
                  {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                </button>
              </form>
            </div>
            <div className="rounded-3xl bg-[var(--color-surface)] p-6 shadow-lg transition-all sm:p-8 lg:p-10">
              <h2 className="mb-5 text-xl font-bold text-[var(--color-text)] sm:mb-6 sm:text-2xl lg:text-3xl">
                Preguntas frecuentes
              </h2>
              <div className="space-y-1">
                {faqs.map((faq, idx) => (
                  <div 
                    key={idx}
                    style={{ borderBottom: idx < faqs.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-primary)] sm:py-5 sm:text-base lg:text-lg"
                    >
                      <span>{faq.question}</span>
                      <span 
                        className="ml-4 text-2xl transition-transform duration-200"
                        style={{ transform: openFaq === idx ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        ⌄
                      </span>
                    </button>
                    {openFaq === idx && (
                      <div className="pb-4 pl-1 pr-8 text-sm text-[var(--color-muted)] sm:text-base">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6 lg:space-y-8">
            <div className="flex flex-col items-start rounded-3xl bg-[var(--color-primary)] p-6 text-[var(--color-onprimary)] sm:p-8 lg:p-10">
              <h3 className="mb-4 text-xl font-bold sm:text-2xl lg:text-3xl">
                ¿Listo para revolucionar tu forma de evaluar?
              </h3>
              <p className="mb-6 text-sm sm:text-base lg:text-lg">
                Agenda una demo personalizada y descubre cómo nuestra plataforma puede transformar tu proceso.
              </p>
              <button className="rounded-3xl bg-[var(--color-onprimary)] px-6 py-3 text-sm font-medium text-[var(--color-primary)] transition-all hover:scale-105 sm:px-8 sm:py-4 sm:text-base lg:text-lg">
                Solicitar demo gratuita
              </button>
            </div>
            <div className="rounded-3xl bg-[var(--color-background)] p-6 shadow-lg sm:p-8 lg:p-10">
              <h3 className="mb-5 text-xl font-bold text-[var(--color-text)] sm:mb-6 sm:text-2xl lg:text-3xl">
                Información de contacto
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-[var(--color-onprimary)]" aria-hidden="true">
                    {/* Email icon */}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="opacity-95">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"/>
                    </svg>
                  </span>
                  <div className="flex-1">
                    <div className="mb-2 text-sm font-semibold text-[var(--color-text)] sm:text-base">Email</div>
                    <div className="rounded-xl bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text)] sm:px-4 sm:py-3 sm:text-sm">
                      hola@automaticcorrection.com<br />
                      soporte@automaticcorrection.com
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-[var(--color-onprimary)]" aria-hidden="true">
                    {/* Phone icon */}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="opacity-95">
                      <path d="M6.62 10.79a15.464 15.464 0 006.59 6.59l2.2-2.2a1 1 0 01.98-.26c1.07.27 2.21.41 3.38.41a1 1 0 011 1V20a1 1 0 01-1 1C10.85 21 3 13.15 3 3a1 1 0 011-1h3.67a1 1 0 011 1c0 1.17.14 2.31.41 3.38a1 1 0 01-.26.98l-2.2 2.2z"/>
                    </svg>
                  </span>
                  <div className="flex-1">
                    <div className="mb-2 text-sm font-semibold text-[var(--color-text)] sm:text-base">Teléfono</div>
                    <div className="rounded-xl bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text)] sm:px-4 sm:py-3 sm:text-sm">
                      +56 2 2345 6789<br />
                      Lun–Vie: 9:00–18:00
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-[var(--color-onprimary)]" aria-hidden="true">
                    {/* Location icon */}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="opacity-95">
                      <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7Zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5Z"/>
                    </svg>
                  </span>
                  <div className="flex-1">
                    <div className="mb-2 text-sm font-semibold text-[var(--color-text)] sm:text-base">Ubicación</div>
                    <div className="rounded-xl bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text)] sm:px-4 sm:py-3 sm:text-sm">
                      Santiago, Chile<br />
                      Región Metropolitana
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-[var(--color-onprimary)]" aria-hidden="true">
                    {/* Clock icon */}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="opacity-95">
                      <path d="M12 1a11 11 0 100 22 11 11 0 000-22Zm1 12h5v-2h-4V6h-2v7Z"/>
                    </svg>
                  </span>
                  <div className="flex-1">
                    <div className="mb-2 text-sm font-semibold text-[var(--color-text)] sm:text-base">Tiempo de respuesta</div>
                    <div className="rounded-xl bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text)] sm:px-4 sm:py-3 sm:text-sm">
                      &lt; 24 horas<br />
                      Demos: 2–3 días hábiles
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
