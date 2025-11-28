import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const About2 = () => {
  useGSAP(() => {
    // Estado inicial de las notas
    gsap.set(".about2-note", {
      opacity: 0,
      scale: 0.95,
      y: 12,
      pointerEvents: "none",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#about2",
        start: "top 70%",
        end: "bottom 60%",
        toggleActions: "play none none reverse",
      },
    });

    tl.add("enter")
      .to(
        ".about2-note.first",
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "enter+=0.05"
      )
      .to(
        ".about2-note.second",
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "enter+=0.25"
      )
      .add(() => {
        gsap.set(".about2-note", { pointerEvents: "auto" });
      }, "enter+=0.3");

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.refresh());
    };
  });

  return (
    <section id="about2" className="min-h-screen w-screen">
      {/* Header */}
      <div className="relative mb-8 mt-16 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[30px] text-[var(--color-muted)]">
          Evalúa Diferente
        </p>

        <AnimatedTitle
          title={"Tecnología con propósito"}
          containerClass="mt-5 text-center text-[var(--color-text)]"
        />

        {/* Subtexto */}
        <div className="about-subtext about2-subtext text-center text-[var(--color-text)] font-general sm:text-lg md:text-lg lg:text-xl">
          <p className="about2-note first font-medium">
            Corrección automática con criterios claros y consistentes. Ahorra horas de trabajo
            y mantiene la justicia en cada evaluación.
          </p>
          <p className="about2-note second text-[var(--color-muted)]">
            Nuestra API explica qué se valoró y por qué, escala con supervisión humana
            y evita entrenamientos costosos: resultados confiables en minutos.
          </p>
        </div>

        {/* CTA — “Probar ahora” */}
        <div className="about2-cta pointer-events-auto">
          <div className="mt-6 text-center text-[var(--color-muted)] font-general">
            <span>¿Te sumas? Pruébalo ahora.</span>
          </div>
          <div className="mt-3">
            <Link
              to="/login"
              className="inline-block rounded-lg px-5 py-3 bg-[var(--color-text)] text-[var(--color-surface)] hover:opacity-90 active:opacity-95 transition-transform hover:-translate-y-0.5 active:translate-y-0"
              aria-label="Probar ahora — ir a iniciar sesión"
            >
              Probar ahora — corrige en minutos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About2;
