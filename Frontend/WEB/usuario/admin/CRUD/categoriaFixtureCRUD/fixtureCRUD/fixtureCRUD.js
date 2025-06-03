// Datos simulados de equipos (en un caso real vendrían de un backend)
    const equiposPorCategoria = {
      juvenil: ['Equipo Juvenil A', 'Equipo Juvenil B', 'Equipo Juvenil C'],
      mayores: ['Equipo Mayor A', 'Equipo Mayor B', 'Equipo Mayor C'],
      femenino: ['Equipo Femenino A', 'Equipo Femenino B', 'Equipo Femenino C'],
    };

    const selectCategoria = document.getElementById('selectCategoria');
    const btnCargarEquipos = document.getElementById('btnCargarEquipos');
    const formFixture = document.getElementById('formFixture');
    const equipoASelect = document.getElementById('equipoA');
    const equipoBSelect = document.getElementById('equipoB');
    const tablaFixtures = document.getElementById('tablaFixtures');

    // Array para guardar fixtures creados
    let fixtures = [];

    // Función para llenar selects de equipos
    function llenarSelectsEquipos(categoria) {
      const equipos = equiposPorCategoria[categoria] || [];
      equipoASelect.innerHTML = '';
      equipoBSelect.innerHTML = '';
      equipos.forEach(equipo => {
        const optionA = document.createElement('option');
        optionA.value = equipo;
        optionA.textContent = equipo;
        equipoASelect.appendChild(optionA);

        const optionB = document.createElement('option');
        optionB.value = equipo;
        optionB.textContent = equipo;
        equipoBSelect.appendChild(optionB);
      });
    }

    // Evento botón cargar equipos
    btnCargarEquipos.addEventListener('click', () => {
      if (!selectCategoria.value) {
        alert('Por favor, selecciona una categoría primero.');
        return;
      }
      llenarSelectsEquipos(selectCategoria.value);
      formFixture.hidden = false;
    });

    // Evento para agregar fixture
    formFixture.addEventListener('submit', e => {
      e.preventDefault();
      const categoria = selectCategoria.value;
      const equipoA = equipoASelect.value;
      const equipoB = equipoBSelect.value;

      if (equipoA === equipoB) {
        alert('Los equipos deben ser diferentes');
        return;
      }

      // Agregar fixture al array
      fixtures.push({ categoria, equipoA, equipoB });
      renderTabla();
      formFixture.reset();
    });

    // Función para renderizar tabla de fixtures
    function renderTabla() {
      tablaFixtures.innerHTML = '';
      fixtures.forEach((fixture, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${fixture.categoria}</td>
          <td>${fixture.equipoA}</td>
          <td>${fixture.equipoB}</td>
          <td>
            <button data-index="${index}" class="btn-editar">Editar</button>
            <button data-index="${index}" class="btn-eliminar">Eliminar</button>
          </td>
        `;
        tablaFixtures.appendChild(tr);
      });

      // Agregar eventos botones editar y eliminar
      document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = btn.dataset.index;
          fixtures.splice(idx, 1);
          renderTabla();
        });
      });

      document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = btn.dataset.index;
          const fixture = fixtures[idx];

          // Setear categoría (no editable para simplificar)
          selectCategoria.value = fixture.categoria;
          llenarSelectsEquipos(fixture.categoria);
          formFixture.hidden = false;

          equipoASelect.value = fixture.equipoA;
          equipoBSelect.value = fixture.equipoB;

          // Cambiar botón agregar por actualizar
          formFixture.querySelector('button[type="submit"]').textContent = 'Actualizar Fixture';

          // Al actualizar reemplaza el fixture
          formFixture.onsubmit = (ev) => {
            ev.preventDefault();
            const nuevoEquipoA = equipoASelect.value;
            const nuevoEquipoB = equipoBSelect.value;

            if (nuevoEquipoA === nuevoEquipoB) {
              alert('Los equipos deben ser diferentes');
              return;
            }

            fixtures[idx] = { categoria: fixture.categoria, equipoA: nuevoEquipoA, equipoB: nuevoEquipoB };
            renderTabla();
            formFixture.reset();
            formFixture.hidden = true;

            // Restaurar evento submit normal
            formFixture.onsubmit = submitAgregarFixture;
            formFixture.querySelector('button[type="submit"]').textContent = 'Agregar Fixture';
          };
        });
      });
    }

    // Evento submit normal
    function submitAgregarFixture(e) {
      e.preventDefault();
      const categoria = selectCategoria.value;
      const equipoA = equipoASelect.value;
      const equipoB = equipoBSelect.value;

      if (equipoA === equipoB) {
        alert('Los equipos deben ser diferentes');
        return;
      }

      fixtures.push({ categoria, equipoA, equipoB });
      renderTabla();
      formFixture.reset();
    }

    formFixture.onsubmit = submitAgregarFixture;
    document.addEventListener('DOMContentLoaded', () => {
  const btnAbrirModal = document.getElementById('btnAbrirModal');
  const modal = document.getElementById('modalEquipo');
  const btnCerrarModal = document.getElementById('btnCerrarModal');
  const formEquipo = document.getElementById('formEquipo');

  // Abrir modal
  btnAbrirModal.addEventListener('click', () => {
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.getElementById('nombreEquipo').focus();
  });

  // Cerrar modal
  btnCerrarModal.addEventListener('click', () => {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    formEquipo.reset();
  });

  // Cerrar modal si clic afuera del contenido
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      btnCerrarModal.click();
    }
  });

  // Manejar el submit del formulario para enviar datos a backend
  formEquipo.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombreEquipo = document.getElementById('nombreEquipo').value.trim();
    const logoEquipo = document.getElementById('logoEquipo').files[0];

    if (!nombreEquipo || !logoEquipo) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombreEquipo);
    formData.append('logo', logoEquipo);

    try {
      const response = await fetch('/api/equipos', {  // Cambia esta URL a tu endpoint backend
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Equipo agregado correctamente.');
        btnCerrarModal.click();
        formEquipo.reset();
        // Aquí podrías recargar o actualizar la lista de equipos
      } else {
        const error = await response.json();
        alert('Error al guardar equipo: ' + (error.message || 'Error desconocido'));
      }
    } catch (error) {
      alert('Error de conexión: ' + error.message);
    }
  });
});
