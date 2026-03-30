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
    
    // Test 1: CSRF Token
    const csrfResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/authentication/csrf`, {
      credentials: 'include'
    });

    // Test 2: Registro
    const registerResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/authentication/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(testData)
    });

    const registerResult = await registerResponse.json();

    if (registerResponse.ok) {
      return { success: true, data: registerResult };
    } else {
      return { success: false, error: registerResult.error };
    }

  } catch (error) {
    console.error("🚨 Error de conexión:", error);
    return { success: false, error: error.message };
  }
};
