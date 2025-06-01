const form = document.getElementById("loginForm");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = form.username.value;
  const password = form.password.value;

  try {
    const response = await fetch("https://java-backend-latest-ionh.onrender.com/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      // Guardar token o información si es necesario
      window.location.href = "dashboard.html"; // o la ruta correcta
    } else {
      errorMessage.textContent = "Usuario o contraseña incorrectos.";
    }
  } catch (error) {
    errorMessage.textContent = "Error al conectar con el servidor.";
  }
});
