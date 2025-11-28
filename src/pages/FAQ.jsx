import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [openFaq, setOpenFaq] = useState(null);

  const faqData = [
    // 1. Uso General del Servicio
    {
      id: 1,
      category: 'general',
      question: '¿Qué es este servicio de corrección automática?',
      answer: 'Es una plataforma que utiliza inteligencia artificial para evaluar respuestas de estudiantes según rúbricas predefinidas por el profesor. La IA asigna puntajes y genera retroalimentación estructurada.'
    },
    {
      id: 2,
      category: 'general',
      question: '¿Qué diferencia tiene con un corrector humano?',
      answer: 'La IA aplica siempre la misma rúbrica sin sesgos ni variaciones, entregando resultados rápidos y consistentes. El profesor siempre tiene control de las pautas y puede revisar las correcciones cuando lo estime.'
    },
    {
      id: 3,
      category: 'general',
      question: '¿Necesito conocimientos técnicos para usar la plataforma?',
      answer: 'No. El sistema está diseñado con una interfaz simple: los profesores crean cursos y pautas, los estudiantes suben sus respuestas, y la corrección se genera automáticamente.'
    },

    // 2. Roles y Accesos
    {
      id: 4,
      category: 'roles',
      question: '¿Qué roles existen en la plataforma?',
      answer: 'Hay dos roles principales: Profesor (crea cursos, pauta preguntas y revisa correcciones) y Estudiante (sube sus respuestas y recibe la corrección automática).'
    },
    {
      id: 5,
      category: 'roles',
      question: '¿Los estudiantes pueden ver las pautas de corrección?',
      answer: 'No, solo reciben su evaluación con puntajes, observaciones y justificación. Las pautas son propiedad de los profesores.'
    },
    {
      id: 6,
      category: 'roles',
      question: '¿Un profesor puede editar una corrección de la IA?',
      answer: 'Sí. La corrección automática es una base, pero el profesor tiene la opción de revisar y ajustar manualmente si lo considera necesario.'
    },

    // 3. Funcionamiento del Sistema
    {
      id: 7,
      category: 'funcionamiento',
      question: '¿Cómo funciona el proceso de corrección?',
      answer: 'El docente genera una pregunta a desarrollar y genera una pauta de corrección mediante IA. El estudiante responde la pregunta. La IA evalúa la respuesta según la pauta y genera automáticamente los criterios con puntajes asignados y retroalimentación.'
    },
    {
      id: 8,
      category: 'funcionamiento',
      question: '¿Qué tipo de preguntas se pueden corregir?',
      answer: 'Principalmente preguntas abiertas cualitativas breves. No está pensado en pruebas extensas ni cálculos matemáticos exactos.'
    },
    {
      id: 9,
      category: 'funcionamiento',
      question: '¿Qué pasa si un estudiante no responde un criterio de la pauta?',
      answer: 'La IA asignará automáticamente 0 puntos en ese aspecto, indicando la ausencia en la justificación.'
    },
    {
      id: 10,
      category: 'funcionamiento',
      question: '¿El sistema siempre entrega la misma nota a dos estudiantes que responden igual?',
      answer: 'Sí, porque sigue tablas de decisión objetivas y una rúbrica fija, sin variaciones subjetivas.'
    },

    // 4. Precios y Créditos
    {
      id: 11,
      category: 'creditos',
      question: '¿Cuánto cuesta usar la plataforma?',
      answer: 'Se cobra por: Creación de pautas (cada pauta creada por un profesor tiene un costo) y Corrección de respuestas (cada respuesta corregida genera un cobro adicional).'
    },
    {
      id: 12,
      category: 'creditos',
      question: '¿Existen planes o paquetes de créditos?',
      answer: 'Sí. Se puede escoger créditos prepagados que luego se usan en creación de pautas o correcciones.'
    },
    {
      id: 13,
      category: 'creditos',
      question: '¿Los estudiantes deben pagar por usar el sistema?',
      answer: 'No es necesario. El docente o institución compran un paquete de créditos los cuales serán consumidos cuando los estudiantes suban sus respuestas para ser corregidas.'
    },

    // 5. Seguridad y Privacidad
    {
      id: 14,
      category: 'privacidad',
      question: '¿Quién puede ver las respuestas de los estudiantes?',
      answer: 'Solo el estudiante y el profesor del curso correspondiente. El administrador técnico no tiene acceso a contenidos académicos.'
    },
    {
      id: 15,
      category: 'privacidad',
      question: '¿La información subida se guarda permanentemente?',
      answer: 'Las respuestas y correcciones se guardan solo durante el tiempo que dure el curso o hasta que el profesor decida eliminarlas.'
    },
    {
      id: 16,
      category: 'privacidad',
      question: '¿El sistema guarda datos personales?',
      answer: 'Solo los estrictamente necesarios para identificar usuarios (nombre, correo institucional). No se usan para fines externos.'
    },
    {
      id: 17,
      category: 'privacidad',
      question: '¿Las respuestas se usan para entrenar la IA?',
      answer: 'No. La corrección se realiza en tiempo real usando la pauta definida. Ninguna respuesta estudiantil se usa para entrenar modelos externos.'
    },

    // 6. Soporte y Problemas Comunes
    {
      id: 18,
      category: 'soporte',
      question: '¿Qué pasa si la corrección parece incorrecta?',
      answer: 'El profesor puede revisar el detalle de la justificación de la IA y ajustar manualmente. Además, puede editar la pauta para futuras correcciones.'
    },
    {
      id: 19,
      category: 'soporte',
      question: '¿Qué hago si no puedo entrar a la plataforma?',
      answer: 'Verifica tu correo y contraseña institucional. Si el problema persiste, contacta a soporte técnico desde el botón de ayuda.'
    },
    {
      id: 20,
      category: 'soporte',
      question: '¿Qué hago si me quedo sin créditos?',
      answer: 'El sistema alertará al profesor. Se podrán comprar más créditos en la sección de precios antes de continuar corrigiendo.'
    },
    {
      id: 21,
      category: 'soporte',
      question: '¿La IA puede equivocarse?',
      answer: 'El sistema sigue una regla Pareto óptimo. Permite la corrección rápida y sin necesidad de datos anteriores, a costa de no ser 100% perfecto.'
    },
    {
      id: 22,
      category: 'soporte',
      question: '¿Cuál es la exactitud en la respuesta de la IA?',
      answer: 'El sistema sigue una regla Pareto óptimo. Permite la corrección rápida y sin necesidad de datos anteriores, a costa de no ser 100% perfecto.'
    },
    {
      id: 23,
      category: 'funcionamiento',
      question: '¿Se requiere entrenar una IA o darle data para que funcione la corrección?',
      answer: 'No. El sistema no requiere de información adicional más que la pregunta que se desea evaluar y la pauta creada mediante IA.'
    },

    // 7. Cursos y Pautas
    {
      id: 24,
      category: 'cursos',
      question: '¿Cuántas preguntas puede tener un curso?',
      answer: 'No existe un límite técnico estricto, pero se recomienda mantener una cantidad razonable para facilitar la gestión de créditos y el seguimiento de resultados.'
    },
    {
      id: 25,
      category: 'cursos',
      question: '¿Se pueden reutilizar pautas en distintos cursos?',
      answer: 'Sí. Un profesor puede clonar pautas existentes para usarlas en otros cursos, evitando crear todo desde cero.'
    },
    {
      id: 26,
      category: 'cursos',
      question: '¿Qué pasa si me equivoqué al crear una pauta?',
      answer: 'Se puede editar o eliminar antes de que los estudiantes comiencen a subir sus respuestas. Una vez usada, la pauta no puede cambiarse retroactivamente, pero sí puede actualizarse para futuras evaluaciones.'
    },

    // 8. Resultados y Retroalimentación
    {
      id: 27,
      category: 'resultados',
      question: '¿Qué recibe exactamente el estudiante al ser corregido?',
      answer: 'Un informe con: Puntajes parciales por criterio, Observaciones breves, Justificación de cada criterio, Comentario final con recomendaciones de mejora.'
    },
    {
      id: 28,
      category: 'resultados',
      question: '¿Los estudiantes pueden apelar la corrección?',
      answer: 'Sí. El profesor puede revisar cualquier corrección automática, modificarla y registrar observaciones adicionales.'
    },
    {
      id: 29,
      category: 'resultados',
      question: '¿Se pueden descargar los resultados?',
      answer: 'Sí. Tanto profesores como estudiantes pueden exportar las correcciones en PDF para tener un respaldo externo.'
    },

    // 9. Integración y Compatibilidad
    {
      id: 30,
      category: 'integracion',
      question: '¿Se puede integrar con plataformas externas (Moodle, Canvas, Blackboard)?',
      answer: 'Sí. La plataforma ofrece conectores y APIs para integrarse con sistemas de gestión de aprendizaje (LMS) ampliamente usados.'
    },
    {
      id: 31,
      category: 'integracion',
      question: '¿Funciona en cualquier dispositivo?',
      answer: 'Sí. Se puede acceder desde computadores, tablets o smartphones con conexión a internet y navegador actualizado.'
    },

    // 10. Gestión de Créditos y Pagos
    {
      id: 32,
      category: 'creditos',
      question: '¿Cómo sé cuántos créditos me quedan?',
      answer: 'Los profesores tienen una vista del dashboard que muestra el saldo de créditos, el consumo por curso y la proyección de uso.'
    },
    {
      id: 33,
      category: 'creditos',
      question: '¿Qué pasa si un estudiante sube varias veces la misma respuesta?',
      answer: 'Cada envío genera un consumo de créditos por corrección. Se recomienda establecer reglas claras en el curso para evitar reenvíos innecesarios (Por ejemplo, configurar el envío único por estudiante).'
    },
    {
      id: 34,
      category: 'creditos',
      question: '¿Puedo transferir créditos entre profesores o cursos?',
      answer: 'Sí, siempre que pertenezcan a la misma institución o cuenta administrativa.'
    },

    // 11. Soporte y Operación
    {
      id: 35,
      category: 'soporte',
      question: '¿Qué hacer si la plataforma está caída en medio de una prueba?',
      answer: 'El sistema cuenta con redundancia y respaldo. En caso de falla, se notifica a los usuarios y se ofrece tiempo de compensación si corresponde.'
    },
    {
      id: 36,
      category: 'soporte',
      question: '¿Hay soporte en tiempo real?',
      answer: 'Sí. Existe un canal de soporte vía chat y correo, con tiempos de respuesta diferenciados según el plan contratado.'
    },
    {
      id: 37,
      category: 'soporte',
      question: '¿Se pueden programar evaluaciones para abrirse en un horario específico?',
      answer: 'Sí. El profesor puede configurar ventanas de tiempo para que los estudiantes suban sus respuestas.'
    },
    {
      id: 38,
      category: 'soporte',
      question: '¿Qué pasa si un estudiante sube un archivo corrupto o en formato no permitido?',
      answer: 'El sistema lo notificará inmediatamente y no consumirá créditos. El estudiante podrá volver a subir la respuesta en el formato correcto.'
    },
    {
      id: 39,
      category: 'soporte',
      question: '¿Puede no funcionar el servicio en cierto momento de tiempo?',
      answer: 'Puede ocurrir el caso que los proveedores externos de IA tengan una caída de sus servicios a nivel mundial por lo cual la empresa no se hace responsable de esa falla.'
    }
  ];

  const categories = [
    { id: 'todas', name: 'Todas las categorías' },
    { id: 'general', name: 'Uso General' },
    { id: 'roles', name: 'Roles y Accesos' },
    { id: 'funcionamiento', name: 'Funcionamiento del Sistema' },
    { id: 'creditos', name: 'Créditos y Precios' },
    { id: 'privacidad', name: 'Seguridad y Privacidad' },
    { id: 'soporte', name: 'Soporte y Problemas' },
    { id: 'cursos', name: 'Cursos y Pautas' },
    { id: 'resultados', name: 'Resultados y Retroalimentación' },
    { id: 'integracion', name: 'Integración y Compatibilidad' }
  ];

  const filteredFaqs = useMemo(() => {
    return faqData.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'todas' || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, faqData]);

  const categoryColors = {
    general: 'var(--color-primary)',
    roles: '#8B5CF6',
    funcionamiento: '#10B981',
    creditos: '#EF4444',
    privacidad: '#F59E0B',
    soporte: 'var(--color-muted)',
    cursos: '#3B82F6',
    resultados: '#059669',
    integracion: '#6366F1'
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 bg-[var(--color-background)] transition-colors duration-300">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: 'var(--color-text)',
            marginBottom: '16px'
          }}>
            Preguntas Frecuentes
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--color-muted)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Encuentra respuestas a las preguntas más comunes sobre nuestra plataforma de corrección automática
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '1px solid var(--color-border)'
        }}>
          {/* Search Bar */}
          <div style={{
            marginBottom: '24px'
          }}>
            <div style={{
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-muted)',
                fontSize: '1.2rem'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar en preguntas frecuentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  fontSize: '1rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
          </div>

          {/* Category Filters */}
          <div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--color-text)',
              marginBottom: '16px'
            }}>
              Filtrar por categoría:
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '25px',
                    border: '2px solid',
                    borderColor: selectedCategory === category.id ? 'var(--color-primary)' : 'var(--color-border)',
                    background: selectedCategory === category.id ? 'var(--color-primary)' : 'var(--color-background)',
                    color: selectedCategory === category.id ? 'var(--color-onprimary)' : 'var(--color-muted)',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onMouseOver={(e) => {
                    if (selectedCategory !== category.id) {
                      e.target.style.borderColor = 'var(--color-primary)';
                      e.target.style.color = 'var(--color-primary)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedCategory !== category.id) {
                      e.target.style.borderColor = 'var(--color-border)';
                      e.target.style.color = 'var(--color-muted)';
                    }
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div style={{
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <p style={{
            color: 'var(--color-muted)',
            fontSize: '1rem'
          }}>
            {filteredFaqs.length === 0 ? 'No se encontraron resultados' : 
             `${filteredFaqs.length} pregunta${filteredFaqs.length !== 1 ? 's' : ''} encontrada${filteredFaqs.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* FAQ Items */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {filteredFaqs.map((faq, index) => (
            <div
              key={faq.id}
              style={{
                background: 'var(--color-surface)',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
                transition: 'all 0.2s',
                boxShadow: openFaq === index ? '0 8px 32px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                style={{
                  width: '100%',
                  padding: '24px',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div style={{
                  flex: 1
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      background: categoryColors[faq.category] || 'var(--color-muted)',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {categories.find(cat => cat.id === faq.category)?.name || faq.category}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--color-text)',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {faq.question}
                  </h3>
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  color: 'var(--color-muted)',
                  transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}>
                  ▼
                </div>
              </button>
              
              {openFaq === index && (
                <div style={{
                  padding: '0 24px 24px 24px',
                  borderTop: '1px solid var(--color-border)'
                }}>
                  <p style={{
                    color: 'var(--color-text)',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    margin: '16px 0 0 0'
                  }}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFaqs.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '64px 32px',
            background: 'var(--color-surface)',
            borderRadius: '16px',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '16px',
              color: 'var(--color-muted)'
            }}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto', display: 'block' }}>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <path d="M12 17h.01"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'var(--color-text)',
              marginBottom: '8px'
            }}>
              No encontramos esa pregunta
            </h3>
            <p style={{
              color: 'var(--color-muted)',
              fontSize: '1rem',
              marginBottom: '24px'
            }}>
              Intenta con otros términos de búsqueda o revisa una categoría diferente
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('todas');
              }}
              style={{
                background: 'var(--color-primary)',
                color: 'var(--color-onprimary)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.9'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              Ver todas las preguntas
            </button>
          </div>
        )}

        {/* Contact Section */}
        <div style={{
          marginTop: '48px',
          background: 'var(--color-primary)',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          color: 'var(--color-onprimary)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '12px'
          }}>
            ¿No encontraste lo que buscabas?
          </h3>
          <p style={{
            fontSize: '1rem',
            marginBottom: '24px',
            opacity: 0.9
          }}>
            Nuestro equipo de soporte está aquí para ayudarte
          </p>
          <Link
            to="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--color-onprimary)',
              color: 'var(--color-primary)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: '500',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Enviar email
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
