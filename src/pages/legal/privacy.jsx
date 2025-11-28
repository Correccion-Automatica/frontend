export default function PrivacyPolicy() {
  const sections = [
    { id: "informacion", title: "1. Qué información recopilamos" },
    { id: "uso", title: "2. Para qué usamos tus datos" },
    { id: "acceso", title: "3. Quién accede a tus datos" },
    { id: "conservacion", title: "4. Conservación y eliminación" },
    { id: "seguridad", title: "5. Seguridad y limitaciones" },
    { id: "cambios", title: "6. Cambios en la política" },
  ];

  const content = {
    informacion: [
      "Recopilamos solo lo necesario para que el servicio funcione correctamente:",
      "<ul><li>Datos de registro (nombre, correo institucional y rol).</li><li>Contenido académico (preguntas, respuestas, rúbricas, resultados).</li></ul>",
      "Podemos además generar métricas anónimas o estadísticas agregadas sobre el uso del sistema, con el fin de mejorar la experiencia, optimizar procesos o evaluar el desempeño general.",
    ],
    uso: [
      "Utilizamos la información para:",
      "<ul><li>Operar y mantener el servicio de corrección automática.</li><li>Mejorar la precisión y eficiencia del sistema.</li><li>Comunicarte información técnica, actualizaciones o soporte.</li><li>Analizar patrones de uso de manera anónima o institucional, sin identificar personas.</li></ul>",
      "Nunca compartimos información identificable con terceros no vinculados al servicio.",
      "Podemos usar datos anonimizados para estudios internos, reportes institucionales o desarrollo de nuevas funcionalidades.",
    ],
    acceso: [
      "Solo acceden:",
      "<ul><li>Tú y, si corresponde, tu profesor o institución.</li><li>Nuestro equipo técnico, exclusivamente para tareas de mantenimiento o soporte.</li></ul>",
      "Todo acceso se limita a lo estrictamente necesario y bajo confidencialidad.",
    ],
    conservacion: [
      "Guardamos los datos durante la vigencia del curso o del contrato con la institución.",
      "Podremos conservar registros estadísticos y datos anonimizados para fines de mejora o documentación del sistema, sin posibilidad de identificar a usuarios individuales.",
      "Puedes solicitar la eliminación de tu información personal escribiendo al canal de soporte indicado en la plataforma.",
    ],
    seguridad: [
      "Empleamos medidas de seguridad razonables (cifrado, servidores seguros y control de acceso).",
      "Sin embargo, no garantizamos protección absoluta frente a ataques externos o fallas en proveedores de infraestructura.",
      "El uso del servicio implica aceptar estos riesgos tecnológicos inherentes.",
    ],
    cambios: [
      "Podremos actualizar esta política en cualquier momento para adaptarla a nuevas funciones o requerimientos legales.",
      "La versión más reciente estará siempre disponible en la plataforma; el uso continuo del servicio implica su aceptación.",
    ],
  };

  return (
    <main className="relative bg-app-gradient scroll-smooth">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/25 via-violet-500/15 to-blue-500/25 animate-pulse-slow blur-2xl" />
        <div className="container-app py-24 md:py-32 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--color-text)] drop-shadow-md">
            Política de Privacidad
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted">
            Última actualización: octubre 2025
          </p>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="container-app mt-8 md:mt-12 py-10 md:py-16 grid lg:grid-cols-[280px_1fr] gap-10">
        {/* SIDEBAR */}
        <aside className="hidden lg:block sticky top-28 h-fit">
          <div className="card p-6 text-sm border border-[var(--color-border)] bg-surface/70 backdrop-blur-md">
            <h3 className="font-semibold mb-3 text-[var(--color-text)]">Contenido</h3>
            <ul className="space-y-2">
              {sections.map((sec) => (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    className="block text-muted transition-all duration-200 hover:text-[var(--color-text)] hover:translate-x-1 hover:drop-shadow-[0_0_6px_rgba(124,124,255,0.6)]"
                  >
                    {sec.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* TEXTO PRINCIPAL */}
        <div className="space-y-24 relative">
          <article className="card p-6 md:p-10 leading-relaxed text-base md:text-lg border border-[var(--color-border)] bg-surface/90 backdrop-blur-md shadow-[0_8px_40px_rgba(99,102,241,0.15)] transition-all duration-500">
            <p className="text-muted mb-10">
              Tu confianza es importante para nosotros. Esta política explica, de forma clara y breve,
              cómo tratamos la información que compartes al usar la plataforma de corrección automática
              (“el Servicio”).
            </p>

            {sections.map((sec, i) => (
              <section
                key={i}
                id={sec.id}
                className={`scroll-mt-32 group transition-all duration-500 ${
                  i > 0 ? "mt-8 md:mt-8" : ""
                }`}
              >
                <h2
                  className="text-2xl font-semibold mb-6 flex items-center gap-3 text-transparent bg-clip-text 
                             bg-gradient-to-r from-indigo-500 to-blue-500
                             before:content-[''] before:w-1 before:h-7 before:bg-gradient-to-b before:from-indigo-400 before:to-blue-400 before:rounded-md
                             group-hover:opacity-90 transition-all duration-300"
                >
                  {sec.title}
                </h2>
                <div className="space-y-3 text-muted text-[1.05rem] leading-relaxed">
                  {content[sec.id].map((p, j) => (
                    <p key={j} dangerouslySetInnerHTML={{ __html: p }} />
                  ))}
                </div>
              </section>
            ))}
          </article>


        </div>
      </section>
    </main>
  );
}
