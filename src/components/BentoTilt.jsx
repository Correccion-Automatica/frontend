import { useState, useRef, useMemo } from "react";

export const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const ref = useRef(null);
  const hasHover = useMemo(() => matchMedia("(hover: hover)").matches, []);

  const onMove = (e) => {
    if (!ref.current || !hasHover) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const rx = (e.clientX - left) / width;
    const ry = (e.clientY - top) / height;
    const tiltX = (ry - 0.5) * 5;
    const tiltY = (rx - 0.5) * -5;
    setTransformStyle(
      `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95,.95,.95)`
    );
  };
  const onLeave = () => hasHover && setTransformStyle("");

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transform: transformStyle, willChange: hasHover ? "transform" : "auto" }}
    >
      {children}
    </div>
  );
};