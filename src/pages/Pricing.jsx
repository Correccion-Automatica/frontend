import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: 'Explorador',
    price: '$0',
    period: '/ mes. Uso único.',
    badge: 'Ideal para emprender',
    description: 'Empezar tu viaje con Automatic Correction',
    features: ['400 créditos'],
    buttonText: 'Comenzar gratis',
    buttonStyle: 'secondary',
    buttonAction: 'register',
  },
  {
    name: 'Impulsor',
    price: '$4.990',
    period: '/ mes',
    badge: 'Más popular',
    description: 'Docentes que innovan en preguntas y corrigen automáticamente',
    features: ['1 200 créditos'],
    buttonText: 'Suscribirme',
    buttonStyle: 'featured',
    buttonAction: 'register',
  },
  {
    name: 'Automatizador',
    price: '$3.990',
    period: ' x Docente o Curso',
    badge: 'Ideal para organizaciones',
    description: 'Organizaciones, colegios o universidades',
    features: ['1 330 créditos por Docente o Curso'],
    buttonText: 'Suscribirme',
    buttonStyle: 'featured',
    buttonAction: 'register',
  },
];

const creditPacks = [
  { name: "Mini Pack", credits: 500, price: 2900 },
  { name: "Medium Pack", credits: 1000, price: 4900 },
  { name: "Max Pack", credits: 1500, price: 6900 },
];

const formatCLP = (value) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value);

export default function Pricing() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("pricing-page-bg");
    return () => document.body.classList.remove("pricing-page-bg");
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#05030a] via-[#0a0820] to-[#05030a] text-slate-100 overflow-hidden pb-72">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-10 top-10 w-96 h-96 bg-purple-700/25 blur-3xl" />
        <div className="absolute right-0 bottom-0 w-[26rem] h-[26rem] bg-fuchsia-500/20 blur-[140px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] bg-purple-500/10 rounded-full blur-[180px]" />
        <div className="absolute inset-x-0 bottom-0 h-[55vh] bg-gradient-to-b from-transparent via-[#05030a]/80 to-[#05030a]" />
      </div>

      <div className="relative z-10 flex-1 max-w-6xl mx-auto px-4 py-12 space-y-12">
        <header className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            <span className="block">Desbloquea el poder de</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 drop-shadow">
              Automatic Correction
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto">Una suscripción, todas las plataformas</p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className="rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/30 p-6 flex flex-col transition hover:-translate-y-1 hover:shadow-purple-900/40"
            >
              {plan.badge && (
                <div className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold mb-3">
                  {plan.badge}
                </div>
              )}

              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                <p className="text-sm text-slate-200/90 mt-1">{plan.description}</p>
              </div>

              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-sm text-slate-300 ml-1">{plan.period}</span>
              </div>

              <ul className="space-y-2 text-sm text-slate-200 mb-5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 items-start">
                    <span className="text-emerald-400 mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`mt-auto w-full rounded-xl px-4 py-3 text-sm font-semibold text-center transition shadow-md shadow-black/20 hover:brightness-110 ${
                  plan.buttonStyle === "featured"
                    ? "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground"
                    : plan.buttonStyle === "secondary"
                    ? "bg-white/10 text-white"
                    : "bg-primary text-primary-foreground"
                }`}
                onClick={() => navigate("/register")}
              >
                {plan.buttonText}
              </button>
            </article>
          ))}
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl shadow-lg shadow-black/30 overflow-hidden">
          <div className="px-6 py-5 border-b border-white/10 flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-white">Paquetes de créditos</h2>
            <p className="text-sm text-slate-200/90">Puedes mezclarlos con cualquier plan para cubrir demanda puntual.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-slate-100">
              <thead className="bg-white/5 text-left text-slate-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Paquete</th>
                  <th className="px-6 py-3 font-medium">Créditos</th>
                  <th className="px-6 py-3 font-medium">Precio</th>
                  <th className="px-6 py-3 font-medium">CLP/crédito</th>
                  <th className="px-6 py-3 font-medium">Relación</th>
                </tr>
              </thead>
              <tbody>
                {creditPacks.map((pack, index) => (
                  <tr key={pack.name} className={index % 2 === 0 ? "bg-white/5" : "bg-white/10"}>
                    <td className="px-6 py-4 font-medium text-white">{pack.name}</td>
                    <td className="px-6 py-4">{pack.credits.toLocaleString("es-CL")}</td>
                    <td className="px-6 py-4">{formatCLP(pack.price)}</td>
                    <td className="px-6 py-4">{pack.pricePerCredit}</td>
                    <td className="px-6 py-4 text-slate-200/90">{pack.relation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
