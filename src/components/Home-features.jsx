// components/Home_Features.jsx
import { BentoCard } from "./BentoCard";
import { BentoTilt } from "./BentoTilt";
import { TiLocationArrow } from "react-icons/ti";



const Home_Features = () => {
  const vids = {
    f1: "/feature-1.mp4",
    f2: "/feature-2.mp4",
    f3: "/feature-3.mp4",
    f4: "/hero-1.mp4", // fallback si no tienes feature-4.mp4
    f5: "/hero-2.mp4", // fallback si no tienes feature-5.mp4
  };

  return (
    <section id="features" className="bg-black pb-28 md:pb-56">
      <div className="container mx-auto px-3 md:px-10">
        {/* Header */}
      <div className="px-5 py-20 md:py-32 text-center md:text-left">
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white special-font">
          Corrección automática con propósito
        </h2>
        <p className="mt-4 text-lg md:text-xl text-blue-50/80 leading-relaxed max-w-2xl mx-auto md:mx-0">
          Evaluaciones justas, consistentes y explicables. <br />
          Reducimos la carga manual y democratizamos el acceso a una evaluación y corrección de calidad.
        </p>

        {/* Línea decorativa */}
        <div className="mt-6 h-1 w-1/2 bg-white/80 mx-auto md:mx-0 rounded-full" />
      </div>

        {/* Hero card grande */}
        <BentoTilt className="bento-tilt_1 mb-10 h-[70vh] w-full">
          <BentoCard
            src={vids.f1}
            title={<>Nuevas Miradas</>}
            description="Misma rúbrica para todos. Resultados estables y predecibles que eliminan arbitrariedades."
            isComingSoon
          />
        </BentoTilt>

        {/* Grid más grande/espaciado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 auto-rows-[minmax(320px,1fr)] md:auto-rows-[minmax(380px,1fr)]">
          {/* Columna alta */}
          <div className="md:row-span-2">
            <BentoTilt className="h-full">
              <BentoCard
                src={vids.f2}
                title={<>Democr<b>a</b>tiz<b>a</b></>}
                description="Bajamos costos y complejidad para que escuelas, universidades y personas independientes accedan a evaluación de calidad."
                isComingSoon
              />
            </BentoTilt>
          </div>

          <BentoTilt className="h-full">
            <BentoCard
              src={vids.f3}
              title={<>Transp<b>a</b>renc<b>i</b>a</>}
              description="Cada decisión es explicable: qué se valoró y por qué. Sin cajas negras, rompiendo paradigmas educativos que llevan siglos."
              isComingSoon
            />
          </BentoTilt>

          <BentoTilt className="h-full">
            <BentoCard
              src={vids.f4}
              title={<>Esc<b>a</b>la con S<b>u</b>pervisión</>}
              description="Evalúa miles de respuestas y conserva la opción de revisión humana cuando haga falta."
              isComingSoon
            />
          </BentoTilt>

          <BentoTilt className="h-full">
            <div className="flex h-full w-full flex-col justify-between bg-violet-300 p-6 md:p-8 rounded-2xl">
              <h4 className="bento-title special-font max-w-[26rem] text-black">
                Ef<b>i</b>ciencia 80/<b>2</b>0
              </h4>
              <p className="mt-4 max-w-[28rem] text-black/80 text-lg md:text-xl leading-relaxed">
                Sin entrenamientos costosos. Logramos una corrección pareto-óptima:
                la mayoría se resuelve automáticamente y el resto se revisa en minutos.
              </p>
              <TiLocationArrow className="self-end mr-2 md:mr-4 scale-[4] md:scale-[5] text-black/70" />
            </div>
          </BentoTilt>

          <BentoTilt className="h-full">
            <BentoCard
              src={vids.f5}
              title={<>Eq<b>u</b>idad y J<b>u</b>sticia</>}
              description="Corregimos con los mismos criterios sin importar el cansancio o el contexto. Tratamos a cada persona con el mismo estándar."
              isComingSoon
            />
          </BentoTilt>
        </div>
      </div>
    </section>
  );
};

export default Home_Features;
