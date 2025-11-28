import React, { useState, useEffect } from "react";

const flowSteps = [
  {
    id: 1,
    title: "Profesor crea la pregunta",
    subtitle: "Configuración inicial",
    description: "El profesor ingresa la pregunta y define los criterios de evaluación mediante una rúbrica lógica.",
    role: "Profesor",
    color: "#6366F1",
    features: [
      "Define la pregunta abierta",
      "La IA establece criterios específicos de evaluación", 
      "Acepta o modifica los criterios específicos de evaluación", 
      "La IA configura puntajes para cada criterio",
      "La IA genera automáticamente reglas de decisión lógicas a seguir"
    ],
    example: {
      type: "pauta",
      title: "Ejemplo de Pauta de Corrección",
      content: {
        pregunta: "Explique el concepto de 'valor para el cliente' según las teorías de marketing.",
        criterios: [
          {
            criterio: "Definición del concepto",
            descripcion: "¿Menciona explícitamente la definición de valor percibido?",
            puntajes: [
              { puntos: 2, descripcion: "Definición clara y completa del concepto" },
              { puntos: 1, descripcion: "Definición incompleta o poco clara" },
              { puntos: 0, descripcion: "No menciona la definición o es incorrecta" }
            ]
          },
          {
            criterio: "Beneficios vs Costos",
            descripcion: "¿Explica la relación entre beneficios percibidos y costos?",
            puntajes: [
              { puntos: 2, descripcion: "Explica claramente la relación beneficio-costo" },
              { puntos: 1, descripcion: "Menciona la relación pero sin profundizar" },
              { puntos: 0, descripcion: "No menciona esta relación" }
            ]
          },
          {
            criterio: "Ejemplos aplicados",
            descripcion: "¿Proporciona ejemplos concretos del concepto?",
            puntajes: [
              { puntos: 1, descripcion: "Incluye al menos un ejemplo relevante" },
              { puntos: 0, descripcion: "No incluye ejemplos o son irrelevantes" }
            ]
          }
        ]
      }
    }
  },
  {
    id: 2,
    title: "Estudiante accede al curso",
    subtitle: "Respuesta del alumno", 
    description: "El estudiante ve la pregunta asignada y puede responder de forma libre y detallada.",
    role: "Estudiante",
    color: "#10B981",
    features: [
      "Accede a través de su perfil estudiantil",
      "Entra al curso correspondiente",
      "Ve la pregunta claramente formulada",
      "Responde con texto libre",
      "Puede revisar su respuesta antes de enviar"
    ],
    example: {
      type: "respuesta",
      title: "Ejemplo de Respuesta de Estudiante",
      content: {
        pregunta: "Explique el concepto de 'valor para el cliente' según las teorías de marketing.",
        respuesta: "El valor para el cliente es lo que percibe el consumidor cuando evalúa un producto o servicio. Se basa en la comparación entre los beneficios que recibe (calidad, funcionalidad, experiencia) versus los costos que debe asumir (precio, tiempo, esfuerzo). Por ejemplo, cuando compramos un smartphone caro, el valor percibido incluye no solo las características técnicas, sino también el prestigio de la marca y la facilidad de uso, comparado con el precio pagado."
      }
    }
  },
  {
    id: 3,
    title: "Evaluación automática",
    subtitle: "Inteligencia artificial en acción",
    description: "El sistema analiza la respuesta usando la rúbrica predefinida y asigna puntajes objetivos.",
    role: "Sistema",
    color: "#F59E0B",
    features: [
      "La IA evalúa cada criterio específico de la rúbrica",
      "Identifica conceptos clave en la respuesta",
      "Asigna puntajes según tabla de decisión",
      "Genera justificaciones para cada punto otorgado"
      
    ],
    example: {
      type: "evaluacion",
      title: "Proceso de Evaluación Automática",
      content: {
        analisis: [
          {
            criterio: "Definición del concepto",
            encontrado: "✓ 'valor para el cliente es lo que percibe el consumidor'",
            puntos: 2,
            justificacion: "Definición clara y precisa del concepto"
          },
          {
            criterio: "Beneficios vs Costos",
            encontrado: "✓ 'beneficios que recibe versus los costos que debe asumir'",
            puntos: 2,
            justificacion: "Explica correctamente la relación beneficio-costo"
          },
          {
            criterio: "Ejemplos aplicados",
            encontrado: "✓ 'smartphone caro, valor percibido incluye...'",
            puntos: 1,
            justificacion: "Incluye ejemplo relevante y aplicado"
          }
        ],
        puntajeTotal: "5/5 puntos"
      }
    }
  },
  {
    id: 4,
    title: "Retroalimentación detallada",
    subtitle: "Resultados y mejoras",
    description: "Tanto estudiante como profesor reciben un informe completo con puntajes y observaciones.",
    role: "Ambos",
    color: "#8B5CF6",
    features: [
      "Puntaje total y parcial por criterio",
      "Observaciones específicas de mejora", 
      "Justificación de cada punto asignado",
      "Recomendaciones para futuras respuestas",
      "Permite incorporar edición y ajustes manuales por parte del docente y/o su equipo"
    ],
    example: {
      type: "retroalimentacion",
      title: "Informe de Retroalimentación",
      content: {
        resumen: {
          puntajeTotal: "5/5",
          porcentaje: "100%",
          calificacion: "Excelente"
        },
        detallesPorCriterio: [
          {
            criterio: "Definición del concepto",
            puntos: "2/2",
            comentario: "Excelente definición. Captura la esencia del concepto de valor percibido.",
            fortaleza: true
          },
          {
            criterio: "Beneficios vs Costos",
            puntos: "2/2", 
            comentario: "Explica muy bien la dualidad beneficio-costo que es fundamental.",
            fortaleza: true
          },
          {
            criterio: "Ejemplos aplicados",
            puntos: "1/1",
            comentario: "El ejemplo del smartphone es muy apropiado y demuestra comprensión.",
            fortaleza: true
          }
        ],
        recomendaciones: [
          "Mantén este nivel de claridad conceptual",
          "Considera agregar más ejemplos de diferentes industrias",
          "Excelente trabajo conectando teoría con aplicación práctica"
        ]
      }
    }
  }
];

export default function Howitworks() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % flowSteps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + flowSteps.length) % flowSteps.length);
  };

  const goToStep = (index) => {
    setCurrentStep(index);
  };

  const current = flowSteps[currentStep];

  return (
    <div style={{
      background: "#F7F8FA",
      minHeight: "100vh",
      fontFamily: "Inter, Arial, sans-serif",
      paddingTop: "80px"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 24px"
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "48px"
        }}>
          <h1 style={{
            fontWeight: 700,
            fontSize: "3rem",
            color: "#181A2A",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px"
          }}>
            <span style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem"
            }}>
              ⟲
            </span>
            ¿Cómo funciona?
          </h1>
          <p style={{
            color: "#6B7280",
            fontSize: "1.2rem",
            maxWidth: "600px",
            margin: "0 auto",
            marginBottom: "24px"
          }}>
            Descubre el flujo completo desde la creación de preguntas hasta la retroalimentación automática
          </p>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "32px",
          gap: "8px"
        }}>
          <div style={{
            display: "flex",
            gap: "8px",
            padding: "12px 20px",
            background: "rgba(255,255,255,0.9)",
            borderRadius: "24px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
          }}>
          {flowSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                border: "2px solid",
                borderColor: index === currentStep ? current.color : "#E5E7EB",
                background: index === currentStep ? current.color : "transparent",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: index === currentStep ? "scale(1.2)" : "scale(1)",
                position: "relative"
              }}
            />
          ))}
          </div>
        </div>

        <div style={{
          background: "#fff",
          borderRadius: "24px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          overflow: "hidden",
          marginBottom: "32px"
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${current.color}15 0%, ${current.color}25 100%)`,
            padding: "32px",
            borderBottom: "1px solid #F3F4F6"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: current.color,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "1.2rem"
                }}>
                  {current.id}
                </div>
                <div>
                  <div style={{
                    color: current.color,
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    {current.role}
                  </div>
                  <div style={{
                    color: "#6B7280",
                    fontSize: "0.9rem"
                  }}>
                    {current.subtitle}
                  </div>
                </div>
              </div>
              
              <div style={{
                display: "flex",
                gap: "8px"
              }}>
                <button
                  onClick={prevStep}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    background: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    fontSize: "1rem",
                    color: "#6B7280"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = current.color;
                    e.target.style.color = "#fff";
                    e.target.style.borderColor = current.color;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#fff";
                    e.target.style.color = "#6B7280";
                    e.target.style.borderColor = "#E5E7EB";
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={nextStep}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    background: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    fontSize: "1rem",
                    color: "#6B7280"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = current.color;
                    e.target.style.color = "#fff";
                    e.target.style.borderColor = current.color;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#fff";
                    e.target.style.color = "#6B7280";
                    e.target.style.borderColor = "#E5E7EB";
                  }}
                >
                  ›
                </button>
              </div>
            </div>
            
            <h2 style={{
              fontWeight: "700",
              fontSize: "2rem",
              color: "#181A2A",
              marginBottom: "8px"
            }}>
              {current.title}
            </h2>
            <p style={{
              color: "#4B5563",
              fontSize: "1.1rem",
              lineHeight: "1.6"
            }}>
              {current.description}
            </p>
          </div>

          <div style={{
            padding: "32px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
            alignItems: "flex-start"
          }}>
            {/* Details list */}
            <div>
              <h3 style={{
                fontWeight: "600",
                fontSize: "1.2rem",
                color: "#181A2A",
                marginBottom: "16px"
              }}>
                Proceso detallado:
              </h3>
              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: 0
              }}>
                {current.features.map((feature, index) => (
                  <li key={index} style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    marginBottom: "12px",
                    padding: "12px",
                    background: "#F9FAFB",
                    borderRadius: "8px",
                    borderLeft: `3px solid ${current.color}`
                  }}>
                    <div style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: current.color,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: "600",
                      flexShrink: 0,
                      marginTop: "2px"
                    }}>
                      {index + 1}
                    </div>
                    <span style={{
                      color: "#374151",
                      lineHeight: "1.5"
                    }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Example content */}
            <div style={{
              background: "#F8FAFC",
              borderRadius: "12px",
              padding: "24px",
              border: "2px solid #E5E7EB"
            }}>
              <h3 style={{
                fontWeight: "600",
                fontSize: "1.1rem",
                color: "#181A2A",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                borderBottom: `2px solid ${current.color}`,
                paddingBottom: "8px"
              }}>
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: `${current.color}15`,
                  color: current.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  fontWeight: "600"
                }}>
                  {current.id === 1 && "⚙"}
                  {current.id === 2 && "✎"}
                  {current.id === 3 && "◉"}
                  {current.id === 4 && "◈"}
                </div>
                {current.example.title}
              </h3>
              
              {/* Ejemplo de Pauta */}
              {current.example.type === "pauta" && (
                <div style={{ fontSize: "0.9rem" }}>
                  <div style={{
                    background: "#fff",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    border: "1px solid #E5E7EB"
                  }}>
                    <p style={{ fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                      Pregunta:
                    </p>
                    <p style={{ color: "#6B7280", fontStyle: "italic" }}>
                      "{current.example.content.pregunta}"
                    </p>
                  </div>
                  
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {current.example.content.criterios.map((criterio, index) => (
                      <div key={index} style={{
                        background: "#fff",
                        padding: "12px",
                        borderRadius: "6px",
                        marginBottom: "8px",
                        border: "1px solid #E5E7EB"
                      }}>
                        <p style={{ fontWeight: "600", fontSize: "0.85rem", color: "#374151", marginBottom: "4px" }}>
                          {criterio.criterio}
                        </p>
                        <p style={{ fontSize: "0.8rem", color: "#6B7280", marginBottom: "6px" }}>
                          {criterio.descripcion}
                        </p>
                        {criterio.puntajes.map((puntaje, pIndex) => (
                          <div key={pIndex} style={{
                            fontSize: "0.75rem",
                            padding: "2px 8px",
                            background: puntaje.puntos === 2 ? "#DEF7EC" : puntaje.puntos === 1 ? "#FEF3C7" : "#FEE2E2",
                            color: puntaje.puntos === 2 ? "#047857" : puntaje.puntos === 1 ? "#92400E" : "#DC2626",
                            borderRadius: "4px",
                            marginBottom: "2px",
                            display: "block"
                          }}>
                            {puntaje.puntos}pts: {puntaje.descripcion}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ejemplo de Respuesta */}
              {current.example.type === "respuesta" && (
                <div style={{ fontSize: "0.9rem" }}>
                  <div style={{
                    background: "#fff",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "12px",
                    border: "1px solid #E5E7EB"
                  }}>
                    <p style={{ fontWeight: "600", color: "#374151", fontSize: "0.85rem", marginBottom: "8px" }}>
                      Pregunta:
                    </p>
                    <p style={{ color: "#6B7280", fontStyle: "italic", fontSize: "0.8rem", marginBottom: "12px" }}>
                      "{current.example.content.pregunta}"
                    </p>
                    <p style={{ fontWeight: "600", color: "#374151", fontSize: "0.85rem", marginBottom: "8px" }}>
                      Respuesta del estudiante:
                    </p>
                    <div style={{
                      background: "#F9FAFB",
                      padding: "12px",
                      borderRadius: "6px",
                      borderLeft: "3px solid #10B981"
                    }}>
                      <p style={{ color: "#374151", lineHeight: "1.5", fontSize: "0.8rem" }}>
                        {current.example.content.respuesta}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ejemplo de Evaluación */}
              {current.example.type === "evaluacion" && (
                <div style={{ fontSize: "0.9rem" }}>
                  <div style={{
                    background: "#fff",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "12px",
                    border: "1px solid #E5E7EB"
                  }}>
                    <p style={{ fontWeight: "600", color: "#374151", fontSize: "0.9rem", marginBottom: "12px" }}>
                      Análisis automático de la IA:
                    </p>
                    {current.example.content.analisis.map((item, index) => (
                      <div key={index} style={{
                        padding: "10px",
                        background: "#F9FAFB",
                        borderRadius: "6px",
                        marginBottom: "8px",
                        borderLeft: "3px solid #F59E0B"
                      }}>
                        <p style={{ fontWeight: "600", fontSize: "0.8rem", color: "#374151", marginBottom: "4px" }}>
                          {item.criterio} ({item.puntos} pts)
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "#059669", marginBottom: "2px" }}>
                          {item.encontrado}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                          {item.justificacion}
                        </p>
                      </div>
                    ))}
                    <div style={{
                      background: "#DEF7EC",
                      color: "#047857",
                      padding: "8px",
                      borderRadius: "6px",
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: "0.9rem"
                    }}>
                      Puntaje Total: {current.example.content.puntajeTotal}
                    </div>
                  </div>
                </div>
              )}

              {/* Ejemplo de Retroalimentación */}
              {current.example.type === "retroalimentacion" && (
                <div style={{ fontSize: "0.9rem" }}>
                  <div style={{
                    background: "#fff",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "12px",
                    border: "1px solid #E5E7EB"
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                      padding: "12px",
                      background: "#DEF7EC",
                      borderRadius: "6px"
                    }}>
                      <span style={{ fontWeight: "600", color: "#047857" }}>
                        {current.example.content.resumen.calificacion}
                      </span>
                      <span style={{ fontWeight: "700", color: "#047857", fontSize: "1.1rem" }}>
                        {current.example.content.resumen.puntajeTotal} ({current.example.content.resumen.porcentaje})
                      </span>
                    </div>
                    
                    <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                      {current.example.content.detallesPorCriterio.map((detalle, index) => (
                        <div key={index} style={{
                          padding: "10px",
                          background: "#F9FAFB",
                          borderRadius: "6px",
                          marginBottom: "8px",
                          borderLeft: detalle.fortaleza ? "3px solid #10B981" : "3px solid #F59E0B"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ fontWeight: "600", fontSize: "0.8rem", color: "#374151" }}>
                              {detalle.criterio}
                            </span>
                            <span style={{ fontWeight: "600", fontSize: "0.8rem", color: "#047857" }}>
                              {detalle.puntos}
                            </span>
                          </div>
                          <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                            {detalle.comentario}
                          </p>
                        </div>
                      ))}
                      
                      <div style={{ marginTop: "12px" }}>
                        <p style={{ fontWeight: "600", fontSize: "0.8rem", color: "#374151", marginBottom: "6px" }}>
                          Recomendaciones:
                        </p>
                        {current.example.content.recomendaciones.map((rec, index) => (
                          <p key={index} style={{
                            fontSize: "0.75rem",
                            color: "#6B7280",
                            marginBottom: "4px",
                            paddingLeft: "12px",
                            position: "relative"
                          }}>
                            <span style={{ position: "absolute", left: "0", color: "#8B5CF6" }}>•</span>
                            {rec}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "16px",
          marginBottom: "48px"
        }}>
          {flowSteps.map((step, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              style={{
                background: index === currentStep ? `linear-gradient(135deg, ${step.color}08 0%, ${step.color}15 100%)` : "#F9FAFB",
                border: index === currentStep ? `2px solid ${step.color}` : "1px solid #E5E7EB",
                borderRadius: "16px",
                padding: "20px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: index === currentStep ? "translateY(-4px)" : "translateY(0)",
                boxShadow: index === currentStep ? `0 8px 24px ${step.color}20` : "0 2px 8px rgba(0,0,0,0.05)"
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "8px"
              }}>
                <div style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: index === currentStep ? step.color : "#E5E7EB",
                  color: index === currentStep ? "#fff" : "#6B7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: "600"
                }}>
                  {step.id}
                </div>
                <span style={{
                  color: step.color,
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  textTransform: "uppercase"
                }}>
                  {step.role}
                </span>
              </div>
              <div style={{
                fontWeight: "600",
                color: "#181A2A",
                fontSize: "0.9rem",
                marginBottom: "4px"
              }}>
                {step.title}
              </div>
              <div style={{
                color: "#6B7280",
                fontSize: "0.8rem",
                lineHeight: "1.4"
              }}>
                {step.subtitle}
              </div>
            </button>
          ))}
        </div>

        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "32px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          marginBottom: "48px"
        }}>
          <h3 style={{
            fontWeight: "700",
            fontSize: "1.5rem",
            color: "#181A2A",
            marginBottom: "12px"
          }}>
            ¿Listo para optimizar tu proceso de corrección?
          </h3>
          <p style={{
            color: "#6B7280",
            fontSize: "1rem",
            marginBottom: "24px",
            maxWidth: "500px",
            margin: "0 auto 24px"
          }}>
            Únete a los profesores que ya están usando nuestra plataforma para automatizar sus evaluaciones
          </p>
          <div style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <a
              href="/contact"
              style={{
                display: "inline-block",
                padding: "4px 8px",
                background: "transparent",
                color: "#6B7280",
                textDecoration: "underline",
                borderRadius: "3px",
                fontWeight: "400",
                fontSize: "0.75rem",
                border: "none",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#374151";
                e.target.style.color = "#fff";
                e.target.style.textDecoration = "none";
                e.target.style.padding = "6px 12px";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#6B7280";
                e.target.style.textDecoration = "underline";
                e.target.style.padding = "4px 8px";
              }}
            >
              Comenzar ahora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
