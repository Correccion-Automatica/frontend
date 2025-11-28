import gsap from "gsap";
import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useLocation } from "react-router-dom";

// Defensive registration to avoid runtime crashes when GSAP/ScrollTrigger
// are unavailable or mismatched during HMR/dev. If registration fails,
// the component will skip ScrollTrigger-dependent animations.
let _gsapAvailableFooter = false;
try {
  if (typeof window !== "undefined" && gsap && ScrollTrigger && typeof gsap.registerPlugin === "function") {
    gsap.registerPlugin(ScrollTrigger);
    _gsapAvailableFooter = true;
    try {
      ScrollTrigger.defaults({ scroller: "#root" });
    } catch (e) {
      // ignore if defaults can't be set in this environment
    }
  }
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn("Footer: GSAP/ScrollTrigger registration failed:", e);
}

export default function Footer() {
  const footerRef = useRef(null);
  const glowRef = useRef(null);
  const scratchLeftRef = useRef(null);
  const scratchRightRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    try {
      if (_gsapAvailableFooter && typeof ScrollTrigger.refresh === "function") ScrollTrigger.refresh();
    } catch (e) {
      // ignore refresh failures
    }
    const footerEl = footerRef.current;
    console.log('Footer useEffect run, footerEl:', footerEl);
    if (footerEl) {
      const rect = footerEl.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        try {
          gsap.to([scratchLeftRef.current, scratchRightRef.current], {
            yPercent: -120,
            duration: 1.2,
            ease: "power2.inOut",
            stagger: 0.1,
          });
        } catch (e) {
          /* ignore animation error */
        }
        try {
          gsap.to(footerEl, {
            y: 0,
            x: 0,
            opacity: 1,
            duration: 1.4,
            ease: "power3.out",
          });
        } catch (e) {
          /* ignore animation error */
        }
      }
    }
  }, [location.pathname]);

  useGSAP(() => {
    const el = footerRef.current;
    const glow = glowRef.current;
    const scratchLeft = scratchLeftRef.current;
    const scratchRight = scratchRightRef.current;

    // Ensure footer is visible by default (don't hide it before GSAP runs)
    if (el) {
      try {
        el.style.opacity = el.style.opacity || "1";
        el.style.transform = el.style.transform || "none";
      } catch (e) {
        // ignore
      }
    }

    try {
      // If overlays exist, reveal and animate them using the app scroller (#root)
      if (scratchLeft && scratchRight) {
        try {
          gsap.set([scratchLeft, scratchRight], { display: "block", yPercent: 0 });
        } catch (e) {
          /* ignore set errors */
        }

        if (_gsapAvailableFooter) {
          try {
            gsap.to([scratchLeft, scratchRight], {
              yPercent: -120,
              duration: 1.3,
              ease: "power2.inOut",
              stagger: 0.1,
              scrollTrigger: {
                scroller: "#root",
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            });
          } catch (e) {
            console.warn("Footer: overlay scroll animation failed:", e);
          }
        }
      }
    } catch (e) {
      console.warn("Footer GSAP overlay init failed:", e?.message || e);
    }

    if (glow) {
      if (_gsapAvailableFooter) {
        try {
          gsap.to(glow, {
            opacity: 0.7,
            duration: 1.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            scrollTrigger: {
              scroller: "#root",
              trigger: el,
              start: "top 95%",
              end: "bottom bottom",
              toggleActions: "play pause resume reverse",
            },
          });
        } catch (e) {
          console.warn("Footer: glow animation failed:", e);
        }
      } else {
        // Fallback: simple non-scroll animation so glow still shows subtly
        try {
          gsap.to(glow, {
            opacity: 0.7,
            duration: 1.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        } catch (e) {
          /* ignore fallback error */
        }
      }
    }
  });

  const year = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden mt-16"
      style={{
        background: "var(--color-surface)",
        color: "var(--color-text)",
        borderTop: "1px solid var(--color-border)",
        zIndex: 50,
        minHeight: 120
      }}
    >
      {/* Scratch overlays */}
      <div
        ref={scratchLeftRef}
        className="absolute inset-0 bg-(--color-background) z-0 origin-bottom-left pointer-events-none"
        style={{ transform: "rotate(-3deg)", display: 'none' }}
      />
      <div
        ref={scratchRightRef}
        className="absolute inset-0 bg-(--color-background) z-0 origin-bottom-right pointer-events-none"
        style={{ transform: "rotate(3deg)", display: 'none' }}
      />

      {/* Línea glow */}
      <div ref={glowRef} className="footer-glow absolute top-0 left-0 w-full" />

      {/* Contenido */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Columna 1 */}
          <div>
            <div className="text-lg font-semibold tracking-tight">
              Automatic Correction
            </div>
            <p className="mt-3 text-sm" style={{ color: "var(--color-muted)" }}>
              Evaluación con IA, feedback claro y escalable para cursos.
            </p>
          </div>

          {/* Columna 2 - Producto */}
          <div>
            <h4 className="text-sm font-medium mb-3">Producto</h4>
            <ul className="space-y-2 text-sm">
              <li><a className="footer-link" href="/howitworks">Cómo funciona</a></li>
              <li><a className="footer-link" href="/faq">Preguntas Frecuentes</a></li>
              <li><a className="footer-link" href="/terms">Términos y Condiciones</a></li>
            </ul>
          </div>

          {/* Columna 3 - Contacto */}
          <div className="text-right md:text-left md:justify-self-end">
            <h4 className="text-sm font-medium mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li><a className="footer-link" href="/contact">Escríbenos</a></li>
              <li>
              <div className="flex justify-end md:justify-start items-center gap-3 mt-2">
                {/* X (Twitter) */}
                <a
                  className="footer-icon"
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2h3.274l-7.16 8.207L22 22h-6.307l-4.939-6.482L5.09 22H1.816l7.654-8.768L2 2h6.486l4.515 5.934L18.244 2zm-2.21 18h1.814L7.107 4h-1.9l10.826 16z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  className="footer-icon"
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zm-9.41 18H6.59V9h2.99v9zm-1.49-10.22c-.95 0-1.71-.77-1.71-1.73 0-.96.76-1.73 1.71-1.73s1.71.77 1.71 1.73c0 .96-.76 1.73-1.71 1.73zM20 18h-2.99v-4.58c0-1.09-.02-2.49-1.52-2.49-1.52 0-1.75 1.18-1.75 2.41V18h-2.99V9h2.87v1.23h.04c.4-.75 1.36-1.54 2.8-1.54 3 0 3.55 1.98 3.55 4.55V18z" />
                  </svg>
                </a>

                {/* Email */}
                <a
                  className="footer-icon"
                  href="mailto:hola@tuapp.com"
                  aria-label="Email"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5z" />
                  </svg>
                </a>
              </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea inferior */}
        <div
          className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between border-t"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p className="text-xs" style={{ color: "var(--color-muted)" }}>
            © {year} Automatic Correction — Todos los derechos reservados
          </p>
          <div className="mt-3 md:mt-0 flex items-center gap-4 text-xs">
            <a className="footer-link" href="/terms">Términos</a>
            <a className="footer-link" href="/privacy">Privacidad</a>
            <a className="footer-link" href="/cookies">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
