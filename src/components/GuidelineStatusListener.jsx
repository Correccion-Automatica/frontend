// src/components/GuidelineStatusListener.jsx
import { useEffect, useState, useRef } from "react";
import ConfirmPopup from "./ConfirmPopup";
import { api } from "../lib/axios";

/**
 * Componente global que escucha eventos de generación de pautas
 * y muestra alertas independientemente de la vista actual.
 */
export default function GuidelineStatusListener() {
  const [popup, setPopup] = useState({ open: false, title: "", message: "" });
  const trackedQuestionsRef = useRef(new Set());
  const intervalRef = useRef(null);

  const openPopup = (title, message) => {
    setPopup({ open: true, title, message });
  };

  const closePopup = () => {
    setPopup((p) => ({ ...p, open: false }));
  };

  // Función para verificar si una pauta que estaba generándose ya está lista
  const checkIfGuidelineReady = async (questionId) => {
    try {
      const res = await api.get("/guidelines");
      if (!Array.isArray(res.data)) return false;

      const found = res.data.find(
        (g) => String(g.questionId) === String(questionId)
      );

      if (found) {
        // La pauta está lista
        const key = `guideline_generating_${questionId}`;
        localStorage.removeItem(key);

        const generatingSeenKey = `guideline_popup_generating_seen_${questionId}`;
        localStorage.removeItem(generatingSeenKey);

        // Mostrar mensaje de pauta lista
        openPopup(
          "✅ Pauta lista",
          "La pauta ya está disponible. Ya puedes descargarla."
        );

        trackedQuestionsRef.current.delete(questionId);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error verificando si la pauta está lista:", err);
      return false;
    }
  };

  useEffect(() => {
    let bc;
    try {
      bc = new BroadcastChannel("guideline-status");

      bc.onmessage = (e) => {
        const data = e?.data;
        if (!data || !data.questionId) return;

        const questionId = String(data.questionId);

        // Cuando se inicia la generación de una pauta
        if (data.type === "guideline_generating") {
          const key = `guideline_generating_${questionId}`;
          localStorage.setItem(key, "1");

          // Marcar que estamos rastreando esta pregunta
          trackedQuestionsRef.current.add(questionId);

          // Mostrar mensaje de generación (solo una vez por sesión)
          const seenKey = `guideline_popup_generating_seen_${questionId}`;
          if (localStorage.getItem(seenKey) !== "1") {
            localStorage.setItem(seenKey, "1");
            openPopup(
              "⏳ Generando pauta",
              "Tu pauta se está generando. Te avisaremos cuando esté lista."
            );
          }
        }

        // Cuando la pauta está lista
        if (data.type === "guideline_created" && data.guidelineId) {
          const key = `guideline_generating_${questionId}`;
          localStorage.removeItem(key);

          // Limpiar el flag de "visto" para permitir mostrar el mensaje de "lista"
          const generatingSeenKey = `guideline_popup_generating_seen_${questionId}`;
          localStorage.removeItem(generatingSeenKey);

          // Siempre mostrar el mensaje cuando la pauta esté lista
          // Esto asegura que se muestre independientemente de la vista
          openPopup(
            "✅ Pauta lista",
            "La pauta ya está disponible. Ya puedes descargarla."
          );

          // Limpiar el tracking de esta pregunta
          trackedQuestionsRef.current.delete(questionId);
        }

        // Cuando hay un error
        if (data.type === "guideline_error") {
          const key = `guideline_generating_${questionId}`;
          localStorage.removeItem(key);

          const generatingSeenKey = `guideline_popup_generating_seen_${questionId}`;
          localStorage.removeItem(generatingSeenKey);

          openPopup(
            "❌ Error generando pauta",
            "Ocurrió un error al generar la pauta. Por favor, intenta nuevamente."
          );

          trackedQuestionsRef.current.delete(questionId);
        }
      };
    } catch (e) {
      console.error("Error configurando BroadcastChannel:", e);
    }

    // Verificar si hay pautas generándose al montar el componente
    const checkGeneratingGuidelines = async () => {
      try {
        const keys = Object.keys(localStorage);
        const generatingKeys = keys.filter((k) =>
          k.startsWith("guideline_generating_")
        );

        for (const key of generatingKeys) {
          const questionId = key.replace("guideline_generating_", "");
          if (localStorage.getItem(key) === "1") {
            trackedQuestionsRef.current.add(questionId);

            // Primero verificar si ya está lista
            const isReady = await checkIfGuidelineReady(questionId);
            if (!isReady) {
              // Si no está lista, mostrar mensaje de generación si no se ha visto antes
              const seenKey = `guideline_popup_generating_seen_${questionId}`;
              if (localStorage.getItem(seenKey) !== "1") {
                localStorage.setItem(seenKey, "1");
                openPopup(
                  "⏳ Generando pauta",
                  "Tu pauta se está generando. Te avisaremos cuando esté lista."
                );
              }
            }
          }
        }
      } catch (err) {
        console.error("Error verificando pautas en generación:", err);
      }
    };

    // Verificar al montar
    checkGeneratingGuidelines();

    // Verificar periódicamente si las pautas que están generándose ya están listas
    // Esto asegura que se detecte incluso si el usuario está en otra vista
    intervalRef.current = setInterval(async () => {
      if (trackedQuestionsRef.current.size > 0) {
        const questionIds = Array.from(trackedQuestionsRef.current);
        for (const questionId of questionIds) {
          await checkIfGuidelineReady(questionId);
        }
      }
    }, 10000); // Verificar cada 10 segundos

    return () => {
      try {
        if (bc) {
          bc.close();
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      } catch (e) {
        console.error("Error cerrando BroadcastChannel:", e);
      }
    };
  }, []); // Sin dependencias para evitar re-renders innecesarios

  return (
    <ConfirmPopup
      isOpen={popup.open}
      title={popup.title}
      message={popup.message}
      confirmText="Entendido"
      cancelText="Cerrar"
      onConfirm={closePopup}
      onCancel={closePopup}
    />
  );
}
