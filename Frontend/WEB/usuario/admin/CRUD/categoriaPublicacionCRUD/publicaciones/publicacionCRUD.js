document.addEventListener('DOMContentLoaded', () => {
  const tablaBody      = document.getElementById('tablaPublicaciones');
  const form           = document.getElementById('formPublicacion');
  const inputId        = document.getElementById('publicacionId');
  const inputTitulo    = document.getElementById('titulo');
  const inputContenido = document.getElementById('contenido');
  const inputFecha     = document.getElementById('fechaPublicacion');
  const selectEstado   = document.getElementById('estadoSelect');
  const selectActividad= document.getElementById('actividadSelect');
  const btnSubmit      = document.getElementById('btnSubmit');
  const btnCancelar    = document.getElementById('btnCancelar');

  let editando = false;

  // Ajusta estas rutas según tu backend
  const URL_PUBLICACIONES = '/api/publicaciones';
  const URL_ACTIVIDADES   = '/api/actividades';

  // 1) Poner hoy como fecha por defecto en el input de fecha
  function inicializarFechaHoy() {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    inputFecha.value = `${yyyy}-${mm}-${dd}`;
  }

  // 2) Cargar actividades en el <select>
  function cargarActividades() {
    fetch(URL_ACTIVIDADES)
      .then(res => res.json())
      .then(data => {
        selectActividad.innerHTML = '<option value="">Seleccione actividad</option>';
        data.forEach(act => {
          const option = document.createElement('option');
          option.value = act.id;
          option.textContent = act.nombre; // Asumo que el JSON de actividad tiene {id, nombre}
          selectActividad.appendChild(option);
        });
      })
      .catch(err => console.error('Error al cargar actividades:', err));
  }

  // 3) Listar todas las publicaciones en la tabla
  function listarPublicaciones() {
    fetch(URL_PUBLICACIONES)
      .then(res => res.json())
      .then(data => {
        tablaBody.innerHTML = '';
        data.forEach(pub => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${pub.id}</td>
            <td>${pub.titulo}</td>
            <td>${formatearFecha(pub.fechaPublicacion)}</td>
            <td>${pub.visible ? 'Visible' : 'No visible'}</td>
            <td>${pub.actividadNombre}</td>
            <td>
              <button class="btn-editar" data-id="${pub.id}">Editar</button>
              <button class="btn-eliminar" data-id="${pub.id}">Eliminar</button>
            </td>
          `;
          tablaBody.appendChild(tr);
        });
      })
      .catch(err => console.error('Error al listar publicaciones:', err));
  }

  // Helper: formatear "yyyy-mm-dd" a dd/mm/yyyy para mostrar
  function formatearFecha(fechaIso) {
    if (!fechaIso) return '';
    const [yyyy, mm, dd] = fechaIso.split('-');
    return `${dd}/${mm}/${yyyy}`;
  }

  // 4) Crear nueva publicación
  function crearPublicacion(publicacion) {
    fetch(URL_PUBLICACIONES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publicacion)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al crear publicación');
        return res.json();
      })
      .then(() => {
        listarPublicaciones();
        form.reset();
        inicializarFechaHoy();
      })
      .catch(err => console.error(err));
  }

  // 5) Cargar datos en el formulario para editar
  function cargarParaEditar(id) {
    fetch(`${URL_PUBLICACIONES}/${id}`)
      .then(res => res.json())
      .then(pub => {
        editando = true;
        inputId.value         = pub.id;
        inputTitulo.value     = pub.titulo;
        inputContenido.value  = pub.contenido;
        // pub.fechaPublicacion viene como "yyyy-mm-dd" en JSON
        inputFecha.value      = pub.fechaPublicacion;
        selectEstado.value    = pub.visible.toString();
        selectActividad.value = pub.actividadId; // Asumo que viene así
        btnSubmit.textContent = 'Actualizar publicación';
        btnCancelar.style.display = 'inline-block';
      })
      .catch(err => console.error('Error al cargar publicación:', err));
  }

  // 6) Actualizar publicación
  function actualizarPublicacion(publicacion) {
    fetch(`${URL_PUBLICACIONES}/${publicacion.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publicacion)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al actualizar');
        return res.json();
      })
      .then(() => {
        listarPublicaciones();
        form.reset();
        inicializarFechaHoy();
        editando = false;
        btnSubmit.textContent = 'Crear publicación';
        btnCancelar.style.display = 'none';
      })
      .catch(err => console.error(err));
  }

  // 7) Eliminar publicación
  function eliminarPublicacion(id) {
    if (!confirm('¿Seguro que deseas eliminar esta publicación?')) return;
    fetch(`${URL_PUBLICACIONES}/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar');
        listarPublicaciones();
      })
      .catch(err => console.error(err));
  }

  // 8) Eventos de la tabla (delegación de click)
  tablaBody.addEventListener('click', e => {
    if (e.target.classList.contains('btn-editar')) {
      const id = e.target.getAttribute('data-id');
      cargarParaEditar(id);
    }
    if (e.target.classList.contains('btn-eliminar')) {
      const id = e.target.getAttribute('data-id');
      eliminarPublicacion(id);
    }
  });

  // 9) Manejar envío de formulario
  form.addEventListener('submit', e => {
    e.preventDefault();
    // Armo el objeto según campos nuevos:
    const nuevaPub = {
      titulo: inputTitulo.value.trim(),
      contenido: inputContenido.value.trim(),
      fechaPublicacion: inputFecha.value,              // "yyyy-mm-dd"
      visible: selectEstado.value === 'true',          // boolean
      actividadId: parseInt(selectActividad.value, 10) // integer
    };
    if (!editando) {
      crearPublicacion(nuevaPub);
    } else {
      nuevaPub.id = parseInt(inputId.value, 10);
      actualizarPublicacion(nuevaPub);
    }
  });

  // 10) Botón cancelar edición
  btnCancelar.addEventListener('click', () => {
    form.reset();
    inicializarFechaHoy();
    editando = false;
    btnSubmit.textContent = 'Crear publicación';
    btnCancelar.style.display = 'none';
  });

  // Inicializar todo al cargar la página
  inicializarFechaHoy();
  cargarActividades();
  listarPublicaciones();
});
