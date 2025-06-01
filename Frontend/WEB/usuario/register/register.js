const registerForm = document.getElementById("registerForm");
const errorMessage = document.getElementById("register-error-message");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = registerForm.username.value;
  const email = registerForm.email.value;
  const password = registerForm.password.value;
  const confirmPassword = registerForm.confirmPassword.value;

  if (password !== confirmPassword) {
    errorMessage.textContent = "Las contraseñas no coinciden.";
    return;
  }

  try {
    const response = await fetch("https://java-backend-latest-ionh.onrender.com/api/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      // Éxito: redirigir al login o mostrar mensaje
      window.location.href = "login.html";
    } else {
      errorMessage.textContent = "Error al registrarse. Verificá los datos.";
    }
  } catch (error) {
    errorMessage.textContent = "No se pudo conectar con el servidor.";
  }
});
