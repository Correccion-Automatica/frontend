import { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";


export const BentoCard = ({ src, title, description, isComingSoon, poster }) => {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [op, setOp] = useState(0);
  const hoverRef = useRef(null);

  const handleMove = (e) => {
    if (!hoverRef.current) return;
    const r = hoverRef.current.getBoundingClientRect();
    setCursor({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div className="relative size-full group">
      {src ? (
        <video
          src={src}
          loop
          muted
          autoPlay
          playsInline
          preload="metadata"
          poster={poster}
          className="absolute left-0 top-0 size-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 from-gray-900 to-gray-800 bg-gradient-to-br" />
      )}
      <div className="absolute inset-0 bg-black/15 group-hover:bg-black/60 transition-colors duration-300" />

      <div className="relative z-10 flex size-full flex-col justify-between p-6 md:p-8 text-blue-50">
        <div className="max-w-[26rem]">
          <h3
            className="bento-title special-font text-white drop-shadow-md  drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)][text-shadow:0_0_2px_#000,0_0_12px_rgba(0,0,0,.75)]"
            style={{ lineHeight: "0.95" }}
          >
            {title}
          </h3>
          {description && (
            <p className="mt-3 text-white leading-snug text-lg md:text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 [text-shadow:0_0_2px_#000,0_0_10px_rgba(0,0,0,.7)]">
              {description}
            </p>
          )}
        </div>

        {isComingSoon && (
          <div
            ref={hoverRef}
            onMouseMove={handleMove}
            onMouseEnter={() => setOp(1)}
            onMouseLeave={() => setOp(0)}
            className="border-hsla relative flex w-fit cursor-pointer items-center gap-3 overflow-hidden rounded-full bg-black/80 px-7 py-3 text-sm uppercase text-white/70 font-medium hover:bg-black/90 transition-colors"            role="button"
            tabIndex={0}
            aria-label="coming soon"
          >
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
              style={{
                opacity: op,
                background: `radial-gradient(120px circle at ${cursor.x}px ${cursor.y}px, #656fe288, #00000026)`,
              }}
            />
            <TiLocationArrow className="relative z-20" />
            <p className="relative z-20">Saber más (Próximamente)</p>
          </div>
        )}
      </div>
    </div>
  );
};