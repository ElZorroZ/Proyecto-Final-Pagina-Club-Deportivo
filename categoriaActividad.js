    let categorias = [];
    let idActual = 1;
    let editandoId = null;

    const form = document.getElementById('formCategoria');
    const nombreInput = document.getElementById('nombreCategoria');
    const tabla = document.getElementById('tablaCategorias');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = nombreInput.value.trim();
      if (!nombre) return;

      if (editandoId !== null) {
        const categoria = categorias.find(c => c.id === editandoId);
        categoria.nombre = nombre;
        editandoId = null;
      } else {
        categorias.push({ id: idActual++, nombre });
      }

      nombreInput.value = '';
      renderTabla();
    });

    function renderTabla() {
      tabla.innerHTML = '';
      categorias.forEach(categoria => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${categoria.id}</td>
          <td>${categoria.nombre}</td>
          <td>
            <button onclick="editar(${categoria.id})">Editar</button>
            <button onclick="eliminar(${categoria.id})">Eliminar</button>
          </td>
        `;
        tabla.appendChild(fila);
      });
    }

    function editar(id) {
      const categoria = categorias.find(c => c.id === id);
      if (categoria) {
        nombreInput.value = categoria.nombre;
        editandoId = id;
      }
    }

    function eliminar(id) {
      categorias = categorias.filter(c => c.id !== id);
      renderTabla();
    }

    document.getElementById('verPublicaciones').addEventListener('click', () => {
      window.location.href = '/WEB/usuario/admin/CRUD/categoriaPublicacion/publicaciones/publicaciones.html';
    });