import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import VideoPreview from "./VideoPreview";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);

  const totalVideos = 3;
  const LOADING_TARGET = 3;

  const nextVdRef = useRef(null);
  const miniBoxRef = useRef(null);
  const bgRef = useRef(null);

  const handleVideoLoad = () => setLoadedVideos((prev) => prev + 1);
  const handleAutoAdvance = () => {
    setHasClicked(true);
    setCurrentIndex((prev) => (prev % totalVideos) + 1);
  };

  useEffect(() => {
    if (loadedVideos >= LOADING_TARGET) setLoading(false);
  }, [loadedVideos]);

  useEffect(() => {
    const v = bgRef.current;
    if (!v) return;
    v.currentTime = 0;
    const p = v.play();
    if (p?.catch) p.catch(() => {});
  }, [currentIndex]);

  const handleMiniVdClick = () => {
    setHasClicked(true);
    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  };

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", { visibility: "visible" });
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => nextVdRef.current?.play(),
        });
        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    { dependencies: [currentIndex], revertOnUpdate: true }
  );

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  const getVideoSrc = (i) => `/hero-${i}.mp4`;

  return (
    <section className="relative h-dvh w-screen overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-[100]">
          <div className="absolute-center" style={{ width: 80, height: 80 }}>
            <div className="three-body">
              <div className="three-body__dot" />
              <div className="three-body__dot" />
              <div className="three-body__dot" />
            </div>
          </div>
        </div>
      )}

      {/* Marco poligonal animado */}
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg"
        style={{ background: "var(--color-surface)" }}
      >
        {/* Mini preview */}
        <div
          ref={miniBoxRef}
          className={
            "mask-clip-path absolute-center z-50 w-64 h-64 cursor-pointer overflow-hidden rounded-lg " +
            "opacity-0 scale-75 transition-all duration-300 ease-out " +
            "hover:opacity-100 hover:scale-100 active:opacity-100 active:scale-100 " +
            "hover:shadow-[0_4px_20px_rgba(0,0,0,.12)]"
          }
        >
          <VideoPreview>
            <div onClick={handleMiniVdClick}>
              <video
                src={getVideoSrc((currentIndex % totalVideos) + 1)}
                loop
                muted
                id="current-video"
                className="w-64 h-64 object-cover object-center"
                onLoadedData={handleVideoLoad}
              />
            </div>
          </VideoPreview>
        </div>

        {/* Capa superior que se expande al click */}
        <video
          ref={nextVdRef}
          src={getVideoSrc(currentIndex)}
          loop
          muted
          id="next-video"
          className="invisible absolute-center z-20 w-64 h-64 object-cover object-center"
          onLoadedData={handleVideoLoad}
        />

        {/* Video de fondo permanente */}
        <video
          ref={bgRef}
          src={getVideoSrc(currentIndex)}
          autoPlay
          playsInline
          onEnded={handleAutoAdvance}
          muted
          className="absolute left-0 top-0 h-full w-full object-cover object-center"
          onLoadedData={handleVideoLoad}
        />

        {/* Títulos */}
        <h1
          className="hero-heading stroke absolute bottom-5 right-5 z-40"
          style={{ color: "var(--color-text-on-dark)" }}
        >
          LA EDUC<b>A</b>CIÓN
        </h1>

        {/* Copy + CTA */}
        <div className="absolute left-0 top-0 z-40 h-full w-full">
          <div className="mt-12 px-5 sm:px-10 max-w-[38rem]">
            <h1
              className="hero-heading stroke mb-2"
              style={{ color: "var(--color-text-on-dark)" }}
            >
              reinve<b>n</b>ta
            </h1>

            <div className="hero-subplate">
              <p className="hero-sub" style={{ color: "var(--color-text-on-dark)" }}>
                Corrección automática con IA a preguntas abiertas
                <br />
                <br />
                Menos tiempo corrigiendo, más valor enseñando
              </p>
            </div>

            {/* Botón */}
            <div className="pointer-events-auto mt-4">
              <Link
                to="/howitworks"
                className="inline-block px-4 py-2 rounded-lg bg-white text-black hover:opacity-90 transition"
              >
                ¿Cómo funciona?
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Título espejo */}
      <h1
        className="hero-heading stroke absolute bottom-5 right-5"
        style={{ color: "var(--color-text)" }}
      >
       LA EDUC<b>A</b>CIÓN
      </h1>
    </section>
  );
};

export default Hero;
