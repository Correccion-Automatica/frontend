import React from "react";

const principles = [
  { title: "Propósito antes que Producto", desc: "No construimos solo una API: trabajamos por un nuevo paradigma educativo. Cada decisión está guiada por la misión de democratizar la educación y generar impacto positivo." },
  { title: "Ética en el Centro", desc: "Creemos que la tecnología solo es valiosa si es justa y transparente. Nos comprometemos a diseñar sistemas que respeten la dignidad de las personas y expliquen sus decisiones." },
  { title: "Excelencia con Humildad", desc: "Apuntamos alto en calidad, pero reconocemos que siempre hay espacio para mejorar. Nos mueve la mejora continua y el aprendizaje colectivo." },
  { title: "Cultura de Confianza", desc: "Somos un equipo diverso que trabaja con apertura, respeto y colaboración. La confianza mutua es la base para innovar sin miedo a equivocarse." },
  { title: "Impacto Sostenible", desc: "Cada línea de código debe aportar valor real. Queremos que nuestro trabajo transforme la educación de forma sostenible y responsable." },
  { title: "Inspirar con el Ejemplo", desc: "No solo buscamos crear una herramienta útil, sino también ser un modelo: una organización que demuestra que se puede innovar con ética y transparencia." },
];

const team = [
  { name: "Trinidad", role: "Backend Developer", bio: "Dedicada a asegurar la satisfacción del cliente y el éxito, con un enfoque proactivo para brindar soporte y retención." },
  {
    name: "Francisco",
    role: "Product Manager",
    bio: 'Ingeniero PUC con Magister en Ciencias de la Ingenieria, docente universitario y director del proyecto, responsable de la vision estrategica, liderazgo de equipos y ejecucion de iniciativas de alto impacto. "Querer es poder"',
    linkedin: "https://www.linkedin.com/in/francisco-garc%C3%ADa-v/",
    image: "/images/team/francisco.jpeg",
  },
  { name: "Vicente", role: "Frontend Developer", bio: "Gerente de producto apasionado enfocado en entregar soluciones centradas en el usuario que satisfacen las necesidades del mercado." },
  { name: "Pía", role: "Frontend Developer", bio: "Gurú técnico con pasión por desarrollar aplicaciones escalables y seguras basadas en la nube." },
];

export default function AboutSimple() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05030a] via-[#0a0820] to-[#05030a] text-slate-100 relative overflow-hidden pb-32">
      <style>{`
        @keyframes orbit0 { from { transform: rotate(0deg) translateX(var(--radius)) rotate(0deg);} to { transform: rotate(360deg) translateX(var(--radius)) rotate(-360deg);} }
        @keyframes orbit1 { from { transform: rotate(0deg) translateX(var(--radius)) rotate(0deg);} to { transform: rotate(360deg) translateX(var(--radius)) rotate(-360deg);} }
        @keyframes orbit2 { from { transform: rotate(0deg) translateX(var(--radius)) rotate(0deg);} to { transform: rotate(360deg) translateX(var(--radius)) rotate(-360deg);} }
      `}</style>

      {/* Glows background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-10 top-20 w-96 h-96 bg-purple-700/30 blur-3xl" />
        <div className="absolute right-10 bottom-10 w-96 h-96 bg-fuchsia-500/25 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-purple-500/10 rounded-full blur-[180px]" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-[#05030a]/80 to-[#05030a]" />
      </div>

      {/* Hero full width */}
      <section className="relative z-10 w-full flex flex-col items-center px-4 pt-12 pb-8">
        <p className="text-sm tracking-[0.35em] uppercase text-slate-300 mb-6 text-center">NUESTRA RAZÓN DE SER</p>

        <div className="relative w-full max-w-6xl min-h-[75vh] flex items-center justify-center">
          {[720, 600, 480].map((size, idx) => (
            <div
              key={size}
              className={`absolute rounded-full border ${
                idx === 0 ? "border-purple-400/35" : idx === 1 ? "border-purple-400/25" : "border-purple-400/15"
              } ${idx === 0 ? "animate-[spin_38s_linear_infinite]" : idx === 1 ? "animate-[spin_28s_linear_infinite_reverse]" : "animate-[spin_24s_linear_infinite]"}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}

          <div className="relative z-10 flex flex-col items-center text-center gap-4 px-6 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">
              Democracia en la
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400"> corrección automática</span>
            </h1>
            <p className="text-slate-200 text-lg md:text-xl">
              Trabajamos por un nuevo paradigma educativo donde la corrección automática es justa, transparente y accesible para todos.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="px-5 py-3 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-purple-700/40 hover:shadow-purple-600/60 transition">
                Conócenos
              </button>
              <a
                href="/contact"
                className="px-5 py-3 rounded-full border border-purple-300/70 text-white hover:bg-white/10 transition"
              >
                Contáctanos
              </a>
            </div>
          </div>

          {[360, 300, 240].map((diameter, idx) => (
            <div
              key={diameter}
              className="absolute w-4 h-4 rounded-full bg-fuchsia-400 shadow-[0_0_25px_rgba(168,85,247,0.7)]"
              style={{
                top: "50%",
                left: "50%",
                marginTop: "-8px",
                marginLeft: "-8px",
                animation: `orbit${idx} ${18 + idx * 4}s linear infinite`,
                ["--radius"]: `${diameter / 2}px`,
              }}
            />
          ))}
        </div>
      </section>

      {/* Secciones inferiores */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-16 space-y-10">
        <section className="grid gap-6 md:grid-cols-2">
          {[{ title: "Misión", desc: "Democratizar la corrección automática: justa, explicable y accesible. Liberamos a docentes de tareas repetitivas para que se concentren en lo que más importa: enseñar, acompañar y formar." }, { title: "Visión", desc: "Ser el referente de un nuevo paradigma educativo donde la tecnología transforma la evaluación de forma sostenible, ética y transparente, rompiendo el paradigma del fine-tuning." }].map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30 transition transform hover:-translate-y-1 hover:shadow-purple-900/40 hover:bg-white/10">
              <h2 className="text-2xl font-semibold mb-3 text-white">{item.title}</h2>
              <p className="text-slate-200 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Principios del Equipo</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30 transition transform hover:-translate-y-1 hover:shadow-purple-900/40 hover:bg-white/10">
                <h3 className="text-xl font-semibold mb-2 text-white">{p.title}</h3>
                <p className="text-slate-200 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white text-center">Nuestro Equipo</h2>
          <p className="text-slate-200 text-center max-w-3xl mx-auto">
            Un grupo diverso de profesionales apasionados, cada uno aportando habilidades técnicas para impulsar la innovación y excelencia en cada proyecto.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, idx) => {
              const knobs = idx % 2 === 0
                ? [
                    { top: "-10px", left: "50%", translate: "-50%,0" },
                    { right: "-10px", top: "50%", translate: "0,-50%" },
                  ]
                : [
                    { left: "-10px", top: "50%", translate: "0,-50%" },
                    { bottom: "-10px", left: "50%", translate: "-50%,0" },
                  ];
              return (
                <div
                  key={m.name}
                  className="relative overflow-visible rounded-2xl border border-white/10 bg-white/5 p-5 text-center shadow-lg shadow-black/30 transition transform hover:-translate-y-1 hover:shadow-purple-900/40 hover:bg-white/10 space-y-2"
                >
                  {knobs.map((k, i) => (
                    <span
                      key={i}
                      className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 shadow-[0_8px_18px_rgba(99,102,241,0.35)]"
                      style={{
                        top: k.top,
                        bottom: k.bottom,
                        left: k.left,
                        right: k.right,
                        transform: `translate(${k.translate || "0,0"})`,
                        pointerEvents: "none",
                      }}
                    />
                  ))}
                  <div className="mx-auto mb-2 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center text-lg font-bold shadow-[0_10px_30px_rgba(99,102,241,0.35)] overflow-hidden">
                    {m.image ? (
                      <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      m.name.charAt(0)
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{m.name}</h3>
                  <p className="text-sm text-purple-300">{m.role}</p>
                  <p className="text-sm text-slate-200 mt-2 leading-relaxed">{m.bio}</p>
                  {m.linkedin && (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1 text-sm text-blue-300 hover:text-blue-200 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                        <path d="M3.65 6H1V15H3.65V6ZM2.33 1A1.56 1.56 0 1 0 2.33 4.11 1.56 1.56 0 1 0 2.33 1ZM15 10.22V15H12.35V10.55C12.35 9.5 11.94 8.79 11 8.79 10.28 8.79 9.85 9.27 9.65 9.73 9.57 9.93 9.55 10.22 9.55 10.51V15H6.9S6.93 6.77 6.9 6H9.55V7.15A2.65 2.65 0 0 1 11.91 6.1C13.67 6.1 15 7.26 15 10.22Z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="text-center rounded-3xl border border-white/10 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-700 p-10 shadow-2xl shadow-purple-900/40">
          <h3 className="text-2xl font-semibold text-white mb-3">¿Quieres saber más?</h3>
          <p className="text-slate-100 mb-6 max-w-2xl mx-auto">
            Únete a nosotros en la revolución de la evaluación educativa. Descubre cómo nuestra API puede transformar tu forma de corregir, con criterios justos y transparentes.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 rounded-full bg-white text-purple-700 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
          >
            Contáctanos
          </a>
        </section>
      </div>
    </div>
  );
}
