export default function CookiesPolicy() {
  const sections = [
    { id: "que-son", title: "1. Qué son las Cookies" },
    { id: "tipos", title: "2. Tipos de Cookies que Utilizamos" },
    { id: "finalidad", title: "3. Finalidad" },
    { id: "gestion", title: "4. Gestión de Cookies" },
    { id: "consentimiento", title: "5. Consentimiento" },
    { id: "cambios", title: "6. Cambios en la Política" },
  ];

  const content = {
    "que-son": [
      "Las cookies son pequeños archivos de texto que se almacenan temporalmente en tu dispositivo al navegar por la plataforma.",
      "Nos ayudan a mantener tu sesión activa, recordar tus preferencias y mejorar el rendimiento general del sitio.",
    ],
    tipos: [
      "Usamos únicamente cookies esenciales y funcionales:",
      "<ul><li><strong>Cookies técnicas o necesarias:</strong> permiten el funcionamiento básico (inicio de sesión, navegación entre páginas, carga de formularios, etc.).</li><li><strong>Cookies de preferencia:</strong> guardan configuraciones de idioma, curso o vista actual.</li><li><strong>Cookies temporales o de sesión:</strong> se eliminan automáticamente al cerrar el navegador.</li></ul>",
      "No utilizamos cookies publicitarias ni de seguimiento de terceros.",
    ],
    finalidad: [
      "El único propósito de estas cookies es facilitar la experiencia del usuario y mantener la estabilidad de la sesión durante el uso de la plataforma.",
      "En ningún caso se usan para recopilar información personal con fines comerciales.",
    ],
    gestion: [
      "Puedes borrar, bloquear o limitar el uso de cookies desde la configuración de tu navegador.",
      "Sin embargo, al hacerlo algunas funciones del servicio pueden dejar de operar correctamente o requerir autenticación repetida.",
    ],
    consentimiento: [
      "Al utilizar la plataforma, aceptas el uso de cookies esenciales y funcionales conforme a esta política.",
      "Si no deseas que se almacenen, te recomendamos configurar tu navegador antes de continuar.",
    ],
    cambios: [
      "Podremos modificar esta Política de Cookies en cualquier momento para adaptarla a mejoras técnicas o normativas.",
      "La versión vigente estará siempre disponible en la plataforma.",
    ],
  };

  return (
    <main className="relative bg-app-gradient scroll-smooth">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/25 via-violet-500/15 to-blue-500/25 animate-pulse-slow blur-2xl" />
        <div className="container-app py-24 md:py-32 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--color-text)] drop-shadow-md">
            Política de Cookies
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
              Esta Política explica cómo utilizamos cookies y tecnologías similares para mejorar tu
              experiencia en la plataforma.
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
