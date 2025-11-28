import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const AnimatedTitle = ({ title, containerClass }) => {
  const containerRef = useRef(null);
  const triggersRef = useRef([]); // guardamos solo los triggers locales

  useEffect(() => {
    if (!containerRef.current) return;

    const words = containerRef.current.querySelectorAll(".animated-word");

    gsap.set(words, {
      opacity: 0,
      transform: "translate3d(0,24px,0) rotateY(12deg) rotateX(6deg)",
      willChange: "opacity, transform",
      display: "inline-block",
    });

    // Creamos el timeline y guardamos el ScrollTrigger local
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        end: "top 40%",
        toggleActions: "play none none reverse",
        onRefreshInit: () => {}, // evita error si otros triggers refrescan
      },
    });

    tl.to(words, {
      opacity: 1,
      transform: "translate3d(0,0,0) rotateY(0deg) rotateX(0deg)",
      ease: "power2.out",
      stagger: 0.02,
      duration: 0.5,
    });

    // Guardar el trigger local
    triggersRef.current = tl.scrollTrigger ? [tl.scrollTrigger] : [];

    return () => {
      tl.kill();
      triggersRef.current.forEach((t) => t.kill()); // mata solo los suyos
    };
  }, []);

  return (
    <div ref={containerRef} className={clsx("animated-title", containerClass)}>
      {title.split("<br />").map((line, i) => (
        <div
          key={i}
          className="flex-center max-w-full flex-wrap gap-2 px-6 md:px-10 md:gap-3"
        >
          {line.split(" ").map((word, idx) => (
            <span
              key={idx}
              className="animated-word"
              dangerouslySetInnerHTML={{ __html: word }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default AnimatedTitle;
