export default function AboutSimple() {
  return (
    <div style={{ 
      padding: '40px 20px', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: 'bold', 
        marginBottom: '20px', 
        color: '#1f2937', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Nuestra razón de ser
      </h1>
      <p style={{ 
        fontSize: '1.1rem', 
        color: '#6b7280', 
        textAlign: 'center', 
        marginBottom: '40px', 
        maxWidth: '800px', 
        margin: '0 auto 40px' 
      }}>
        Trabajamos por un nuevo paradigma educativo donde la corrección automática es justa, transparente y accesible para todos
      </p>
      
      <div style={{ 
        display: 'grid', 
        gap: '30px', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        marginBottom: '50px' 
      }}>
        <section 
          style={{ 
            padding: '30px', 
            border: '1px solid #e5e7eb', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.15)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            e.currentTarget.style.color = 'white';
            // Cambiar color del texto interior
            const title = e.currentTarget.querySelector('h2');
            const text = e.currentTarget.querySelector('p');
            if (title) title.style.color = 'white';
            if (text) text.style.color = 'rgba(255,255,255,0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
            e.currentTarget.style.color = 'initial';
            // Restaurar color del texto interior
            const title = e.currentTarget.querySelector('h2');
            const text = e.currentTarget.querySelector('p');
            if (title) title.style.color = '#374151';
            if (text) text.style.color = '#6b7280';
          }}
        >
          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '15px', color: '#374151', transition: 'color 0.3s ease' }}>
            Misión
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.6', transition: 'color 0.3s ease' }}>
            Democratizar la corrección automática: justa, explicable y accesible. Liberamos a docentes de tareas repetitivas para que se concentren en lo que más importa: enseñar, acompañar y formar.
          </p>
        </section>

        <section 
          style={{ 
            padding: '30px', 
            border: '1px solid #e5e7eb', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.15)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            e.currentTarget.style.color = 'white';
            const title = e.currentTarget.querySelector('h2');
            const text = e.currentTarget.querySelector('p');
            if (title) title.style.color = 'white';
            if (text) text.style.color = 'rgba(255,255,255,0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
            e.currentTarget.style.color = 'initial';
            const title = e.currentTarget.querySelector('h2');
            const text = e.currentTarget.querySelector('p');
            if (title) title.style.color = '#374151';
            if (text) text.style.color = '#6b7280';
          }}
        >
          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '15px', color: '#374151', transition: 'color 0.3s ease' }}>
            Visión
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.6', transition: 'color 0.3s ease' }}>
            Ser el referente de un nuevo paradigma educativo donde la tecnología transforma la evaluación de forma sostenible, ética y transparente, rompiendo el paradigma del fine-tuning.
          </p>
        </section>
      </div>

      {/* Principios del Equipo */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '30px', color: '#374151' }}>
          Principios del Equipo
        </h2>
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
          {[
            {
              title: "Propósito antes que Producto",
              desc: "No construimos solo una API: trabajamos por un nuevo paradigma educativo. Cada decisión está guiada por la misión de democratizar la educación y generar impacto positivo."
            },
            {
              title: "Ética en el Centro",
              desc: "Creemos que la tecnología solo es valiosa si es justa y transparente. Nos comprometemos a diseñar sistemas que respeten la dignidad de las personas y expliquen sus decisiones."
            },
            {
              title: "Excelencia con Humildad",
              desc: "Apuntamos alto en calidad, pero reconocemos que siempre hay espacio para mejorar. Nos mueve la mejora continua y el aprendizaje colectivo."
            },
            {
              title: "Cultura de Confianza",
              desc: "Somos un equipo diverso que trabaja con apertura, respeto y colaboración. La confianza mutua es la base para innovar sin miedo a equivocarse."
            },
            {
              title: "Impacto Sostenible",
              desc: "Cada línea de código debe aportar valor real. Queremos que nuestro trabajo transforme la educación de forma sostenible y responsable."
            },
            {
              title: "Inspirar con el Ejemplo",
              desc: "No solo buscamos crear una herramienta útil, sino también ser un modelo: una organización que demuestra que se puede innovar con ética y transparencia."
            }
          ].map((principle, index) => (
            <div 
              key={index} 
              style={{ 
                padding: '25px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.15)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                e.currentTarget.style.color = 'white';
                // Cambiar color del texto interior
                const title = e.currentTarget.querySelector('h3');
                const text = e.currentTarget.querySelector('p');
                if (title) title.style.color = 'white';
                if (text) text.style.color = 'rgba(255,255,255,0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
                e.currentTarget.style.color = 'initial';
                // Restaurar color del texto interior
                const title = e.currentTarget.querySelector('h3');
                const text = e.currentTarget.querySelector('p');
                if (title) title.style.color = '#374151';
                if (text) text.style.color = '#6b7280';
              }}
            >
              <h3 style={{ 
                fontSize: '1.3rem', 
                fontWeight: '600', 
                marginBottom: '12px', 
                color: '#374151',
                transition: 'color 0.3s ease'
              }}>
                {principle.title}
              </h3>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '0.95rem', 
                lineHeight: '1.6',
                transition: 'color 0.3s ease'
              }}>
                {principle.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '30px', color: '#374151', textAlign: 'center' }}>
          Nuestro Equipo
        </h2>
        <p style={{ fontSize: '1rem', color: '#6b7280', textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
          Un grupo diverso de profesionales apasionados, cada uno aportando habilidades únicas para impulsar la innovación y excelencia en cada proyecto.
        </p>
        <div style={{ display: 'grid', gap: '30px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {[
            { name: 'Trinidad', role: 'Backend Developer', bio: 'Dedicada a asegurar la satisfacción del cliente y el éxito, con un enfoque proactivo para brindar soporte y retención.' },
            { name: 'Francisco', role: 'Product Manager', bio: 'Especialista en operaciones con experiencia en startups escalables, asegurando operaciones fluidas y eficientes de la empresa.' },
            { name: 'Vicente', role: 'Frontend Developer', bio: 'Gerente de producto apasionado enfocado en entregar soluciones centradas en el usuario que satisfacen las necesidades del mercado.' },
            { name: 'Pía', role: 'Frontend Developer', bio: 'Gurú técnico con pasión por desarrollar aplicaciones escalables y seguras basadas en la nube.' }
          ].map((member) => (
            <div 
              key={member.name} 
              style={{ 
                padding: '30px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                textAlign: 'center',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.15)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                e.currentTarget.style.color = 'white';
                // Cambiar colores del contenido
                const avatar = e.currentTarget.querySelector('.avatar');
                const name = e.currentTarget.querySelector('.name');
                const role = e.currentTarget.querySelector('.role');
                const bio = e.currentTarget.querySelector('.bio');
                if (avatar) {
                  avatar.style.background = 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)';
                  avatar.style.color = '#667eea';
                  avatar.style.transform = 'scale(1.1)';
                }
                if (name) name.style.color = 'white';
                if (role) role.style.color = 'rgba(255,255,255,0.9)';
                if (bio) bio.style.color = 'rgba(255,255,255,0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
                e.currentTarget.style.color = 'initial';
                const avatar = e.currentTarget.querySelector('.avatar');
                const name = e.currentTarget.querySelector('.name');
                const role = e.currentTarget.querySelector('.role');
                const bio = e.currentTarget.querySelector('.bio');
                if (avatar) {
                  avatar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                  avatar.style.color = 'white';
                  avatar.style.transform = 'scale(1)';
                }
                if (name) name.style.color = '#374151';
                if (role) role.style.color = '#3b82f6';
                if (bio) bio.style.color = '#6b7280';
              }}
            >
              <div 
                className="avatar"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {member.name.charAt(0)}
              </div>
              <h3 
                className="name"
                style={{ 
                  fontSize: '1.4rem', 
                  fontWeight: '600', 
                  marginBottom: '8px', 
                  color: '#374151',
                  transition: 'color 0.3s ease'
                }}
              >
                {member.name}
              </h3>
              <p 
                className="role"
                style={{ 
                  color: '#3b82f6', 
                  fontSize: '1rem', 
                  fontWeight: '500', 
                  marginBottom: '15px',
                  transition: 'color 0.3s ease'
                }}
              >
                {member.role}
              </p>
              <p 
                className="bio"
                style={{ 
                  color: '#6b7280', 
                  fontSize: '0.9rem', 
                  lineHeight: '1.5',
                  transition: 'color 0.3s ease'
                }}
              >
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section 
        style={{ 
          textAlign: 'center', 
          padding: '40px 30px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          borderRadius: '16px', 
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
          transition: 'all 0.4s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0px) scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
        }}
      >
        <h3 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '15px', color: 'white' }}>
          ¿Quieres saber más?
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '25px', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 25px' }}>
          Únete a nosotros en la revolución de la evaluación educativa. Descubre cómo nuestra API puede transformar tu forma de corregir, con criterios justos y transparentes.
        </p>
        <a 
          href="/contact" 
          style={{
            display: 'inline-block',
            padding: '15px 30px',
            background: 'white',
            color: '#7c3aed',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.transform = 'translateY(0px) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
          }}
        >
          Contáctanos
        </a>
      </section>
    </div>
  );
}