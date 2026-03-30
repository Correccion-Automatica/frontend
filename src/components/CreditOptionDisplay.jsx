// CreditOptionDisplay.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import ButtonPrimary from "./ButtonPrimary";
import { useNavigate } from "react-router-dom";
import { useCredits } from "../context/CreditsContext";
import { api } from "../lib/axios";
import gsap from "gsap";

export default function CreditOptionDisplay({ userName, isCreditsPending = false }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const { credits, loading, isCreditsPending: pendingFromContext } = useCredits();
  const [costs, setCosts] = useState(null);

  const dotsRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/guidelines/calculate");
        const pre = res.data?.pre;
        if (mounted && pre) {
          setCosts({
            fase1: pre.fase1Cost ?? pre.fase1 ?? 0,
            edit: pre.editCost ?? pre.fase1_5 ?? 0,
            finish: pre.finishCost ?? pre.finish ?? 0,
          });
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const pending = isCreditsPending || pendingFromContext;

  useEffect(() => {
    if (!pending) return;
    if (!dotsRef.current) return;

    const ctx = gsap.context(() => {
      const dots = gsap.utils.toArray(".credit-dot", dotsRef.current);
      const tl = gsap.timeline({ repeat: -1 });

      tl.to(dots, { y: -3, opacity: 1, stagger: 0.12, duration: 0.25 })
        .to(dots, { y: 0, opacity: 0.5, stagger: 0.12, duration: 0.25 }, "+=0.08");

      return () => tl.kill();
    }, dotsRef);

    return () => ctx.revert && ctx.revert();
  }, [pending]);

  const creditsLabel = useMemo(() => {
    const n = Number(credits ?? 0);
    return Number.isFinite(n) ? n.toLocaleString() : "0";
  }, [credits]);

  if (loading) return null;

  const fase1 = costs ? Number(costs.fase1 || 0) : 50;
  const finish = costs ? Number(costs.finish || 0) : 280;
  const totalCreate = fase1 + finish;

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer
                   text-(--color-text) px-2 py-1 select-none"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <p className="text-sm flex items-center gap-2">
          <span>
            {userName}, tienes{" "}
            {pending ? (
              <>
                <span
                  ref={dotsRef}
                  className="inline-flex items-center gap-1 align-middle"
                  aria-label="Actualizando créditos"
                  title="Actualizando créditos"
                >
                  <span className="credit-dot inline-block h-1.5 w-1.5 rounded-full bg-(--color-muted) opacity-60" />
                  <span className="credit-dot inline-block h-1.5 w-1.5 rounded-full bg-(--color-muted) opacity-60" />
                  <span className="credit-dot inline-block h-1.5 w-1.5 rounded-full bg-(--color-muted) opacity-60" />
                </span>
                <span className="ml-2 text-[11px] text-(--color-muted)">
                  actualizando créditos
                </span>
              </>
            ) : (
              <>
                <span className="font-bold">{creditsLabel}</span> créditos
              </>
            )}
          </span>
        </p>

        <span
          className={`transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          ⌄
        </span>
      </div>

      {/* Expandible */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out
          ${expanded ? "max-h-[520px] opacity-100 mt-3" : "max-h-0 opacity-0"}`}
      >
        <div className="p-4 bg-(--color-surface) rounded-2xl shadow-sm border border-(--color-border) space-y-4">
          {/* CTA */}
          <ButtonPrimary
            onClick={() => navigate("/payments/purchase")}
            className="
              w-full
              bg-gradient-to-r from-indigo-500 to-blue-500
              hover:from-indigo-600 hover:to-blue-600
              text-white
              px-4 py-2 rounded-xl text-sm
              shadow-md transition-colors
            "
          >
            Obtener más créditos
          </ButtonPrimary>

          {/* Tabla de costos */}
          <div className="rounded-xl border border-(--color-border) bg-(--color-background) overflow-hidden">
            <div className="grid grid-cols-[1fr_auto] px-3 py-2 text-[11px] font-semibold text-(--color-muted) border-b border-(--color-border)">
              <div>Acción</div>
              <div className="text-right">Créditos</div>
            </div>

            <div className="divide-y divide-(--color-border) text-sm">
              {/* Crear pauta */}
              <div className="grid grid-cols-[1fr_auto] px-3 py-2">
                <div>
                  <div>Crear pauta</div>

                  <div className="text-[11px] text-(--color-muted) whitespace-nowrap">
                    Incluye generación inicial de criterios + pauta final
                  </div>

                  <div className="text-[11px] text-(--color-muted)">
                    Incluye: <strong>{fase1}</strong> generación inicial +{" "}
                    <strong>{finish}</strong> finalización ={" "}
                    <strong>{totalCreate}</strong>
                  </div>
                </div>

                <div className="text-right font-semibold">
                  {costs ? costs.fase1 + costs.finish : 330}
                </div>
              </div>

              {/* Editar pauta */}
              <div className="grid grid-cols-[1fr_auto] px-3 py-2">
                <div>
                  <div>Editar criterios pauta</div>
                  <div className="text-[11px] text-(--color-muted) whitespace-nowrap">
                    Iteración adicional sobre crear pauta
                  </div>
                </div>
                <div className="text-right font-semibold">
                  {costs ? costs.edit : 35}
                </div>
              </div>

              {/* Corrección automática */}
              <div className="grid grid-cols-[1fr_auto] px-3 py-2">
                <div>
                  <div>Corrección automática</div>
                  <div className="text-[11px] text-(--color-muted) whitespace-nowrap">
                    Por respuesta de estudiante
                  </div>
                </div>
                <div className="text-right font-semibold">3</div>
              </div>
            </div>
          </div>

          {/* Microcopy */}
          <div className="mx-auto max-w-[240px] text-xs text-(--color-muted) text-center leading-snug opacity-90">
            "Cuando los criterios son claros, las decisiones son justas."
          </div>
        </div>
      </div>
    </div>
  );
}
