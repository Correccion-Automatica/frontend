import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const About = () => {
  useGSAP(() => {
    gsap.set(".note", { opacity: 0, scale: 0.95, y: 12, pointerEvents: "none" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    tl.to(".frame", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      ease: "power2.inOut",
    })
      .add("expanded")
      .to(".note-left", { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "power2.out" }, "expanded+=0.05")
      .to(".note-right", { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "power2.out" }, "expanded+=0.25")
      .add(() => gsap.set(".note", { pointerEvents: "auto" }), "expanded+=0.3")
      .fromTo(".note h3", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.1 }, "expanded+=0.3")
      .fromTo(".note p", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.1 }, "expanded+=0.38");
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-16 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[30px] text-[var(--color-muted)]">
          Corrección Automática
        </p>

        <AnimatedTitle
          title={"Evalúa mejor,<br /> Trasciende las fronteras"}
          containerClass="mt-5 text-center text-[var(--color-text)]"
        />

        <div className="about-subtext text-center text-[var(--color-text)] font-general sm:text-lg md:text-lg lg:text-xl">
          <p className="font-medium">
            Educación justa y consistente - Misma rúbrica para todos
          </p>
          <p className="text-[var(--color-muted)]">
            Ahorra horas de corrección manual, recursos, y transforma cada respuesta en una oportunidad de aprendizaje
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen" id="clip">
        <div className="frame relative mx-auto z-0 w-[60vmin] aspect-square rounded-[32px] overflow-hidden bg-black">
          <img src="/img-1.png" alt="Background" className="absolute inset-0 h-full w-full object-contain" />

          {/* === Notas === */}
          <div className="notes pointer-events-none absolute z-10 inset-x-3 bottom-4 flex flex-col items-center gap-3 md:inset-auto md:top-1/2 md:-translate-y-1/2 md:bottom-auto md:left-0 md:right-0 md:flex-row md:justify-between md:px-[6vw]">
            {/* Nota Izquierda */}
            <div className="note note-left max-w-[36ch] w-full md:w-auto text-center md:text-left pointer-events-auto">
              <div className="inline-block rounded-2xl backdrop-blur-sm border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/12 shadow-[0_10px_30px_rgba(0,0,0,.35)] px-4 py-3 sm:px-5 sm:py-4 hover:ring-1 hover:ring-white/15 transition text-[color:var(--color-text-on-dark)]">
                <h3 className="font-extrabold tracking-tight text-base sm:text-lg md:text-xl lg:text-2xl">
                  Corrección Automática
                </h3>
                <p className="mt-1 text-sm sm:text-[0.95rem] md:text-base lg:text-[1.0625rem] leading-tight opacity-90">
                  Evalúa respuestas de estudiantes con IA, aplicando la misma
                  rúbrica para todos y entregando resultados consistentes.{" "}
                  <a
                    href="https://doi.org/10.3390/educsci15080946"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline underline-offset-2 decoration-white/50 hover:decoration-white hover:text-white transition-colors"
                  >
                    Ver estudio
                  </a>
                </p>
              </div>
            </div>

            {/* Nota Derecha */}
            <div className="note note-right max-w-[36ch] w-full md:w-auto text-center md:text-right pointer-events-auto">
              <div className="inline-block rounded-2xl backdrop-blur-sm border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/12 shadow-[0_10px_30px_rgba(0,0,0,.35)] px-4 py-3 sm:px-5 sm:py-4 hover:ring-1 hover:ring-white/15 transition text-[color:var(--color-text-on-dark)]">
                <h3 className="font-extrabold tracking-tight text-base sm:text-lg md:text-xl lg:text-2xl">
                  Educación Transformada
                </h3>
                <p className="mt-1 text-sm sm:text-[0.95rem] md:text-base lg:text-[1.0625rem] leading-tight opacity-90">
                  Convierte cada respuesta en una oportunidad de aprendizaje,
                  usando tecnología para impulsar la motivación y el progreso de tus estudiantes.
                </p>
              </div>
            </div>
          </div>
          {/* === /Notas === */}
        </div>
      </div>
    </div>
  );
};

export default About;
