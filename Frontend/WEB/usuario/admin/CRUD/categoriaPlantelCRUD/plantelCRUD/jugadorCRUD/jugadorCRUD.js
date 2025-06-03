    const jugadorForm = document.getElementById('jugador-form');
    const tablaJugadores = document.getElementById('tabla-jugadores').querySelector('tbody');
    const resetBtn = document.getElementById('reset-btn');
    let jugadores = [];
    let editIndex = null;

    jugadorForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nuevoJugador = {
        nombre: jugadorForm.nombre.value,
        foto: jugadorForm.foto.value,
        nacimiento: jugadorForm.nacimiento.value,
        goles: jugadorForm.goles.value,
        asistencias: jugadorForm.asistencias.value,
        minutos: jugadorForm.minutos.value
      };

      if (editIndex !== null) {
        jugadores[editIndex] = nuevoJugador;
        editIndex = null;
      } else {
        jugadores.push(nuevoJugador);
      }

      renderTabla();
      jugadorForm.reset();
    });

    resetBtn.addEventListener('click', () => jugadorForm.reset());

    function renderTabla() {
      tablaJugadores.innerHTML = '';
      jugadores.forEach((jugador, index) => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
          <td><img src="${jugador.foto}" alt="Foto" style="height: 50px"></td>
          <td>${jugador.nombre}</td>
          <td>${jugador.nacimiento}</td>
          <td>${jugador.goles}</td>
          <td>${jugador.asistencias}</td>
          <td>${jugador.minutos}</td>
          <td>
            <button onclick="editarJugador(${index})">Editar</button>
            <button onclick="eliminarJugador(${index})">Eliminar</button>
          </td>
        `;

        tablaJugadores.appendChild(fila);
      });
    }

    window.editarJugador = function(index) {
      const jugador = jugadores[index];
      jugadorForm.nombre.value = jugador.nombre;
      jugadorForm.foto.value = jugador.foto;
      jugadorForm.nacimiento.value = jugador.nacimiento;
      jugadorForm.goles.value = jugador.goles;
      jugadorForm.asistencias.value = jugador.asistencias;
      jugadorForm.minutos.value = jugador.minutos;
      editIndex = index;
    }

    window.eliminarJugador = function(index) {
      if (confirm('¿Seguro que quieres eliminar este jugador?')) {
        jugadores.splice(index, 1);
        renderTabla();
      }
    }