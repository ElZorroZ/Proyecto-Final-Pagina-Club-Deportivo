// Variables globales
const planteles = [];
let editandoIndex = -1;

const form = document.getElementById('plantel-form');
const jugadoresContainer = document.getElementById('jugadores-container');
const agregarJugadorBtn = document.getElementById('agregar-jugador-btn');
const tablaPlantelesBody = document.querySelector('#tabla-planteles tbody');

// Función para crear un formulario de jugador
function crearFormularioJugador(nombre = '', posicion = '') {
  const div = document.createElement('div');
  div.className = 'jugador-form';

  div.innerHTML = `
    <input type="text" name="nombreJugador" placeholder="Nombre jugador" value="${nombre}" required />
    <input type="text" name="posicionJugador" placeholder="Posición" value="${posicion}" required />
    <button type="button" class="eliminar-jugador-btn">Eliminar</button>
  `;

  // Evento para eliminar jugador
  div.querySelector('.eliminar-jugador-btn').addEventListener('click', () => {
    div.remove();
  });

  return div;
}

// Agregar jugador al formulario
agregarJugadorBtn.addEventListener('click', () => {
  const nuevoJugador = crearFormularioJugador();
  jugadoresContainer.appendChild(nuevoJugador);
});

// Mostrar planteles en la tabla
function mostrarPlanteles() {
  tablaPlantelesBody.innerHTML = '';

  planteles.forEach((plantel, index) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${plantel.nombre}</td>
      <td>${plantel.categoria}</td>
      <td>${plantel.fechaCreacion}</td>
      <td>${plantel.jugadores.map(j => j.nombre + ' (' + j.posicion + ')').join(', ')}</td>
      <td>
        <button class="editar-btn">Editar</button>
        <button class="eliminar-btn">Eliminar</button>
      </td>
    `;

    // Editar plantel
    tr.querySelector('.editar-btn').addEventListener('click', () => {
      cargarPlantelEnFormulario(index);
    });

    // Eliminar plantel
    tr.querySelector('.eliminar-btn').addEventListener('click', () => {
      if (confirm('¿Querés eliminar este plantel?')) {
        planteles.splice(index, 1);
        mostrarPlanteles();
        limpiarFormulario();
      }
    });

    tablaPlantelesBody.appendChild(tr);
  });
}

// Cargar un plantel en el formulario para editar
function cargarPlantelEnFormulario(index) {
  const plantel = planteles[index];
  editandoIndex = index;

  form['nombrePlantel'].value = plantel.nombre;
  form['categoria'].value = plantel.categoria;
  form['fechaCreacion'].value = plantel.fechaCreacion;

  // Limpiar jugadores actuales
  jugadoresContainer.innerHTML = '';

  // Cargar jugadores
  plantel.jugadores.forEach(j => {
    const jugadorForm = crearFormularioJugador(j.nombre, j.posicion);
    jugadoresContainer.appendChild(jugadorForm);
  });
}

// Limpiar formulario
function limpiarFormulario() {
  form.reset();
  jugadoresContainer.innerHTML = '';
  editandoIndex = -1;
}

// Guardar plantel (nuevo o editado)
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Recopilar datos del plantel
  const nombre = form['nombrePlantel'].value.trim();
  const categoria = form['categoria'].value;
  const fechaCreacion = form['fechaCreacion'].value;

  // Recopilar jugadores
  const jugadores = [];
  const jugadoresForms = jugadoresContainer.querySelectorAll('.jugador-form');
  for (const jf of jugadoresForms) {
    const nombreJugador = jf.querySelector('input[name="nombreJugador"]').value.trim();
    const posicionJugador = jf.querySelector('input[name="posicionJugador"]').value.trim();

    if (!nombreJugador || !posicionJugador) {
      alert('Completa todos los campos de los jugadores.');
      return;
    }
    jugadores.push({ nombre: nombreJugador, posicion: posicionJugador });
  }

  if (jugadores.length === 0) {
    alert('Agregá al menos un jugador.');
    return;
  }

  const nuevoPlantel = { nombre, categoria, fechaCreacion, jugadores };

  if (editandoIndex === -1) {
    // Nuevo plantel
    planteles.push(nuevoPlantel);
  } else {
    // Editando plantel
    planteles[editandoIndex] = nuevoPlantel;
  }

  mostrarPlanteles();
  limpiarFormulario();
});
