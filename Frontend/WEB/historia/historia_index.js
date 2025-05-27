function mostrarDetalle(año) {
  const detalles = {
    '1948': '<h2>1948</h2><p>El club fue fundado en un pequeño galpón del barrio. Los primeros socios eran vecinos que se reunían para jugar al fútbol.</p>',
    '1965': '<h2>1965</h2><p>Con esfuerzo y dedicación, el equipo logró su primer campeonato regional. Fue un hito para la historia local.</p>',
    // más años...
  };
  document.getElementById('contenido-detalle').innerHTML = detalles[año];
  document.getElementById('modal-detalle').classList.remove('oculto');
}

function cerrarModal() {
  document.getElementById('modal-detalle').classList.add('oculto');
}
// referencias a tabs y secciones
  const tabCrono      = document.getElementById('tab-crono');
  const tabJugadores  = document.getElementById('tab-jugadores');
  const seccionCrono  = document.getElementById('seccion-crono');
  const seccionJugadores = document.getElementById('seccion-jugadores');

  function activarTab(tab) {
    if (tab === 'crono') {
      tabCrono.classList.add('active');
      tabJugadores.classList.remove('active');
      seccionCrono.classList.remove('oculto');
      seccionJugadores.classList.add('oculto');
    } else {
      tabJugadores.classList.add('active');
      tabCrono.classList.remove('active');
      seccionJugadores.classList.remove('oculto');
      seccionCrono.classList.add('oculto');
    }
  }

  tabCrono.addEventListener('click', () => activarTab('crono'));
  tabJugadores.addEventListener('click', () => activarTab('jugadores'));