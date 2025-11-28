export default function TermsAndConditions() {
  const sections = [
    { id: "objeto", title: "1. Objeto del Servicio" },
    { id: "usuarios", title: "2. Usuarios y Roles" },
    { id: "funcionamiento", title: "3. Funcionamiento General" },
    { id: "uso", title: "4. Uso Aceptable" },
    { id: "propiedad", title: "5. Propiedad Intelectual" },
    { id: "pagos", title: "6. Pagos y Créditos" },
    { id: "disponibilidad", title: "7. Disponibilidad y Limitaciones" },
    { id: "responsabilidad", title: "8. Responsabilidad y Exenciones" },
    { id: "modificaciones", title: "9. Modificaciones y Vigencia" },
    { id: "ley", title: "10. Legislación Aplicable" },
  ];

  const content = {
    objeto: [
      "El servicio permite a docentes y estudiantes utilizar herramientas de inteligencia artificial para evaluar respuestas escritas en un ordenador o dispositivo móvil, de acuerdo con rúbricas predefinidas por el profesor.",
      "El sistema asigna puntajes, genera retroalimentación y facilita la gestión de evaluaciones de manera rápida, objetiva y justa, aplicando los mismos criterios entre estudiantes y manteniendo consistencia Pareto Óptima.",
      "La plataforma no sustituye el juicio académico humano. El profesor o la institución son responsables de validar los resultados antes de emitir calificaciones oficiales.",
    ],
    usuarios: [
      "Existen cuatro tipos de usuarios:",
      "<ul><li><strong>Administrador:</strong> gestiona diferentes cuentas y accede a métricas macro.</li><li><strong>Profesor/a:</strong> crea cursos, define pautas y puede editar correcciones.</li><li><strong>Auxiliar:</strong> colabora en la revisión o edición de correcciones.</li><li><strong>Estudiante:</strong> sube sus respuestas y recibe evaluación con comentarios.</li></ul>",
    ],
    funcionamiento: [
      "La plataforma corrige respuestas a partir de pautas configuradas por el profesor o generadas con IA.",
      "Las decisiones automáticas se basan en criterios objetivos definidos por la rúbrica, pero pueden presentar márgenes de error inherentes a los sistemas de lenguaje natural.",
    ],
    uso: [
      "El usuario se compromete a:",
      "<ul><li>Usar la plataforma únicamente con fines educativos y legítimos.</li><li>No subir contenido ofensivo, ilegal o que infrinja derechos de autor.</li><li>No interferir con la seguridad o el funcionamiento del sistema.</li></ul>",
    ],
    propiedad: [
      "Todos los derechos de propiedad intelectual sobre el software, código fuente, diseño e interfaz pertenecen exclusivamente a la empresa desarrolladora.",
    ],
    pagos: [
      "El uso del servicio requiere créditos que se consumen al crear pautas o procesar correcciones.",
      "Los créditos pueden variar según el plan contratado.",
    ],
    disponibilidad: [
      "El servicio se ofrece “tal cual” y “según disponibilidad”, sin garantías de funcionamiento continuo o libre de errores.",
    ],
    responsabilidad: [
      "La empresa no será responsable por errores derivados de pautas incorrectas o resultados inexactos.",
    ],
    modificaciones: [
      "La empresa podrá actualizar estos términos en cualquier momento.",
      "El uso continuado implica la aceptación de los cambios.",
    ],
    ley: [
      "Estos términos se regirán por las leyes del país de domicilio de la empresa.",
    ],
  };

  return (
    <main className="relative bg-app-gradient scroll-smooth">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/25 via-violet-500/15 to-blue-500/25 animate-pulse-slow blur-2xl" />
        <div className="container-app py-24 md:py-32 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--color-text)] drop-shadow-md">
            Términos y Condiciones
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
              Bienvenido/a a nuestra plataforma de corrección automática. Al acceder o utilizar este
              servicio, aceptas íntegramente estos términos y condiciones. Si no estás de acuerdo con
              alguna parte, te recomendamos no utilizar la plataforma.
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