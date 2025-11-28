export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/mes",
      originalPrice: null,
      description: "Para siempre",
      badge: null,
      features: [
        "5 correcciones gratuitas al mes",
        "Preguntas de opción múltiple",
        "Reportes básicos",
        "Soporte por email"
      ],
      buttonText: "Comenzar Gratis",
      buttonStyle: "secondary",
      popular: false
    },
    {
      name: "Educator",
      price: "$15",
      period: "/mes",
      originalPrice: "$25",
      description: "ex. tax",
      badge: null,
      features: [
        "100 correcciones mensuales",
        "Preguntas abiertas y cerradas",
        "Análisis detallado",
        "Exportación de resultados",
        "Soporte prioritario"
      ],
      buttonText: "Suscribirse",
      buttonStyle: "primary",
      popular: false
    },
    {
      name: "Professional",
      price: "$45",
      period: "/mes",
      originalPrice: "$75",
      description: "ex. tax",
      badge: "Más Popular",
      features: [
        "500 correcciones mensuales",
        "Corrección automática avanzada",
        "Integración con LMS",
        "Reportes analytics",
        "API access básico"
      ],
      buttonText: "Suscribirse",
      buttonStyle: "featured",
      popular: true
    },
    {
      name: "Institution",
      price: "$120",
      period: "/mes",
      originalPrice: "$180",
      description: "ex. tax",
      badge: null,
      features: [
        "Correcciones ilimitadas",
        "Multi-usuario y roles",
        "Dashboard administrativo",
        "Soporte dedicado 24/7",
        "Integración completa API"
      ],
      buttonText: "Contactar Ventas",
      buttonStyle: "primary",
      popular: false
    }
  ];

  const toggles = [
    { id: 'individual', label: 'Individual', active: true },
    { id: 'institucional', label: 'Institucional', active: false }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      paddingTop: '80px',
      paddingBottom: '60px',
      paddingLeft: '20px',
      paddingRight: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header - Más compacto */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: 'white', 
            marginBottom: '15px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            lineHeight: '1.2'
          }}>
            Desbloquea el poder de <br />
            <span style={{ color: '#a78bfa' }}>Automatic Correction</span>
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            color: 'rgba(255,255,255,0.9)', 
            marginBottom: '35px',
            maxWidth: '500px',
            margin: '0 auto 35px'
          }}>
            Una suscripción, todas las plataformas
          </p>

          {/* Toggle - Más pequeño */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: '40px',
            padding: '4px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            marginBottom: '25px'
          }}>
            {toggles.map((toggle) => (
              <button
                key={toggle.id}
                style={{
                  padding: '10px 20px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: toggle.active ? 'rgba(167, 139, 250, 0.9)' : 'transparent',
                  color: 'white',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  if (!toggle.active) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!toggle.active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                {toggle.label}
              </button>
            ))}
          </div>

          {/* Billing Toggle - Más compacto */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Anual</span>
            <div style={{
              position: 'relative',
              width: '50px',
              height: '26px',
              backgroundColor: '#a78bfa',
              borderRadius: '13px',
              cursor: 'pointer'
            }}>
              <div style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '22px',
                height: '22px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transition: 'all 0.3s ease'
              }}></div>
            </div>
            <span style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem' }}>Mensual</span>
            <span style={{
              backgroundColor: '#fbbf24',
              color: '#92400e',
              padding: '3px 10px',
              borderRadius: '15px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              20% off 🔥
            </span>
          </div>
        </div>

        {/* Plans Grid - Optimizado para 4 columnas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px',
          marginBottom: '50px'
        }}>
          {plans.map((plan, index) => (
            <div 
              key={plan.name} 
              style={{
                backgroundColor: plan.popular ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.95)',
                borderRadius: '20px',
                padding: '30px 24px',
                position: 'relative',
                border: plan.popular ? '2px solid #a78bfa' : '1px solid rgba(255,255,255,0.3)',
                boxShadow: plan.popular ? '0 15px 35px rgba(0,0,0,0.15)' : '0 8px 25px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: plan.popular ? 'scale(1.02) translateY(-5px)' : 'scale(1) translateY(0px)',
                cursor: 'pointer',
                height: 'fit-content'
              }}
              onMouseEnter={(e) => {
                const card = e.currentTarget;
                if (plan.popular) {
                  card.style.transform = 'scale(1.05) translateY(-10px)';
                  card.style.boxShadow = '0 25px 50px rgba(0,0,0,0.2), 0 0 0 1px rgba(167, 139, 250, 0.3)';
                } else {
                  card.style.transform = 'scale(1.03) translateY(-8px)';
                  card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(167, 139, 250, 0.2)';
                  card.style.backgroundColor = 'rgba(255,255,255,0.98)';
                }
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget;
                if (plan.popular) {
                  card.style.transform = 'scale(1.02) translateY(-5px)';
                  card.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                } else {
                  card.style.transform = 'scale(1) translateY(0px)';
                  card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                  card.style.backgroundColor = 'rgba(255,255,255,0.95)';
                }
              }}
            >
              
              {/* Badge */}
              {plan.badge && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#a78bfa',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '15px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(167, 139, 250, 0.4)'
                }}>
                  {plan.badge}
                </div>
              )}

              {/* Plan Header - Más compacto */}
              <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                <h3 style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '12px' 
                }}>
                  {plan.name}
                </h3>
                
                <div style={{ marginBottom: '8px' }}>
                  {plan.originalPrice && (
                    <span style={{
                      fontSize: '1rem',
                      color: '#9ca3af',
                      textDecoration: 'line-through',
                      marginRight: '8px'
                    }}>
                      {plan.originalPrice}
                    </span>
                  )}
                  <span style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 'bold', 
                    color: plan.popular ? '#7c3aed' : '#374151'
                  }}>
                    {plan.price}
                  </span>
                  <span style={{ 
                    fontSize: '1rem', 
                    color: '#6b7280' 
                  }}>
                    {plan.period}
                  </span>
                </div>
                
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '0.85rem' 
                }}>
                  {plan.description}
                </p>
              </div>

              {/* Features - Lista más compacta */}
              <div style={{ marginBottom: '25px' }}>
                <p style={{ 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '12px',
                  fontSize: '0.95rem'
                }}>
                  Incluye:
                </p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      marginBottom: '8px',
                      fontSize: '0.85rem',
                      color: '#4b5563',
                      lineHeight: '1.4'
                    }}>
                      <span style={{ 
                        color: '#10b981', 
                        marginRight: '8px', 
                        fontSize: '1rem',
                        lineHeight: '1',
                        marginTop: '2px'
                      }}>
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button */}
              <button 
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backgroundColor: plan.buttonStyle === 'featured' ? '#7c3aed' : 
                                 plan.buttonStyle === 'primary' ? '#3b82f6' : '#f3f4f6',
                  color: plan.buttonStyle === 'secondary' ? '#374151' : 'white',
                  boxShadow: plan.buttonStyle !== 'secondary' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget;
                  if (plan.buttonStyle === 'featured') {
                    btn.style.backgroundColor = '#8b5cf6';
                    btn.style.transform = 'translateY(-2px)';
                    btn.style.boxShadow = '0 8px 20px rgba(124, 58, 237, 0.4)';
                  } else if (plan.buttonStyle === 'primary') {
                    btn.style.backgroundColor = '#2563eb';
                    btn.style.transform = 'translateY(-2px)';
                    btn.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
                  } else {
                    btn.style.backgroundColor = '#e5e7eb';
                    btn.style.transform = 'translateY(-1px)';
                    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget;
                  if (plan.buttonStyle === 'featured') {
                    btn.style.backgroundColor = '#7c3aed';
                    btn.style.transform = 'translateY(0px)';
                    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  } else if (plan.buttonStyle === 'primary') {
                    btn.style.backgroundColor = '#3b82f6';
                    btn.style.transform = 'translateY(0px)';
                    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  } else {
                    btn.style.backgroundColor = '#f3f4f6';
                    btn.style.transform = 'translateY(0px)';
                    btn.style.boxShadow = 'none';
                  }
                }}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info - Más compacto */}
        <div style={{ 
          textAlign: 'center', 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          borderRadius: '16px', 
          padding: '30px 25px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: 'white', 
            marginBottom: '12px' 
          }}>
            ¿Necesitas algo diferente?
          </h3>
          <p style={{ 
            color: 'rgba(255,255,255,0.9)', 
            marginBottom: '20px',
            fontSize: '1rem',
            maxWidth: '500px',
            margin: '0 auto 20px',
            lineHeight: '1.5'
          }}>
            Soluciones personalizadas para instituciones educativas grandes, 
            con volúmenes especiales y características específicas.
          </p>
          <button 
            style={{
              padding: '12px 25px',
              backgroundColor: 'white',
              color: '#7c3aed',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.transform = 'translateY(0px) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
          >
            Contactar Ventas
          </button>
        </div>
      </div>
    </div>
  );
}