document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formEstatuto');
  const tabla = document.getElementById('tablaEstatutos').querySelector('tbody');

  let estatutos = [];

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const titulo = document.getElementById('tituloEstatuto').value;
    const contenido = document.getElementById('contenidoEstatuto').value;

    const nuevoArticulo = {
      id: Date.now(),
      titulo,
      contenido
    };

    estatutos.push(nuevoArticulo);
    renderTabla();
    form.reset();
  });

  function renderTabla() {
    tabla.innerHTML = '';
    estatutos.forEach(art => {
      const fila = document.createElement('tr');

      fila.innerHTML = `
        <td>${art.titulo}</td>
        <td>${art.contenido}</td>
        <td>
          <button onclick="editar(${art.id})">Editar</button>
          <button onclick="eliminar(${art.id})" class="btn-secundario">Eliminar</button>
        </td>
      `;
      tabla.appendChild(fila);
    });
  }

  window.eliminar = (id) => {
    estatutos = estatutos.filter(e => e.id !== id);
    renderTabla();
  };

  window.editar = (id) => {
    const art = estatutos.find(e => e.id === id);
    document.getElementById('tituloEstatuto').value = art.titulo;
    document.getElementById('contenidoEstatuto').value = art.contenido;

    eliminar(id);
  };
});
