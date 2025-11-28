// Test de conexión de registro
// Ejecuta este script en la consola del navegador para probar la conexión

const testRegistration = async () => {
  const testData = {
    fullName: "Usuario Prueba",
    email: "test@example.com",
    role: "student",
    password: "123456",
    confirmPassword: "123456"
  };

  try {
    console.log("🧪 Iniciando test de registro...");
    
    // Test 1: CSRF Token
    console.log("1️⃣ Obteniendo CSRF token...");
    const csrfResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/authentication/csrf`, {
      credentials: 'include'
    });
    console.log("✅ CSRF:", csrfResponse.status);

    // Test 2: Registro
    console.log("2️⃣ Enviando datos de registro...");
    const registerResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/authentication/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(testData)
    });

    const registerResult = await registerResponse.json();
    console.log("📝 Resultado registro:", registerResult);

    if (registerResponse.ok) {
      console.log("✅ Registro exitoso!");
      return { success: true, data: registerResult };
    } else {
      console.log("❌ Error en registro:", registerResult.error);
      return { success: false, error: registerResult.error };
    }

  } catch (error) {
    console.error("🚨 Error de conexión:", error);
    return { success: false, error: error.message };
  }
};

// Para usar: testRegistration().then(console.log)
console.log("📋 Test de registro disponible. Ejecuta: testRegistration()");