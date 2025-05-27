document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;

  fetch(`https://tu-backend.com/publicaciones/${id}`)
    .then(res => res.json())
    .then(data => mostrarPublicacion(data))
    .catch(err => {
      document.getElementById("publicacion").innerHTML = "<p>Error al cargar la publicación.</p>";
    });
});

function mostrarPublicacion(data) {
  const { titulo, autor, fecha, imagenUrl, contenido } = data;

  const html = `
    <h1>${titulo}</h1>
    <p class="meta">Publicado por ${autor || "Club"} el ${new Date(fecha).toLocaleDateString()}</p>
    ${imagenUrl ? `<img src="${imagenUrl}" alt="Imagen de la publicación">` : ""}
    <div class="contenido">${contenido}</div>
  `;

  document.getElementById("publicacion").innerHTML = html;
}
