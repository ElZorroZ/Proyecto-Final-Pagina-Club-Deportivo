// actividad_index.js

// --- URL base de tu API (ajusta según tu backend) ---
const API_BASE = '/api/actividades';            // Para CRUD de actividades
const API_CATEGORIAS = '/api/categoriaActividad'; // Para obtener categorías

// Elementos del DOM
const formActividad         = document.getElementById('formActividad');
const actividadIdInput      = document.getElementById('actividadId');
const categoriaSelect       = document.getElementById('categoriaActividad');
const nombreInput           = document.getElementById('nombreActividad');
const descripcionInput      = document.getElementById('descripcionActividad');
const lugarInput            = document.getElementById('lugarActividad');
const precioInput           = document.getElementById('precioActividad');
const contenedorFechasHoras = document.getElementById('contenedorFechasHoras');
const btnAgregarFechaHora   = document.getElementById('btnAgregarFechaHora');
const btnGuardar            = document.getElementById('btnGuardar');
const btnCancelarEdicion    = document.getElementById('btnCancelarEdicion');
const tablaActividades      = document.getElementById('tablaActividades');

// Variable para saber si estamos editando
let modoEdicion = false;

// Al cargar la página:
document.addEventListener('DOMContentLoaded', () => {
  cargarCategorias();
  cargarActividades();
  inicializarEventos();
});

// --- Funciones de inicialización de eventos ---
function inicializarEventos() {
  // Subir formulario = crear o actualizar
  formActividad.addEventListener('submit', (e) => {
    e.preventDefault();
    if (modoEdicion) {
      actualizarActividad();
    } else {
      crearActividad();
    }
  });

  // Botón para agregar nueva fila de fecha+hora
  btnAgregarFechaHora.addEventListener('click', () => {
    agregarFilaFechaHora();
  });

  // Botón para cancelar edición
  btnCancelarEdicion.addEventListener('click', () => {
    limpiarFormulario();
  });
}

// --- Obtener y llenar select de categorías ---
async function cargarCategorias() {
  try {
    const resp = await fetch(API_CATEGORIAS);
    if (!resp.ok) throw new Error('No se pudo obtener categorías');
    const categorias = await resp.json(); // Se asume [{ id, nombre }, ...]
    // Limpiar y agregar opción por defecto
    categoriaSelect.innerHTML = '<option value="">-- Seleccioná categoría --</option>';
    categorias.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.nombre;
      categoriaSelect.appendChild(opt);
    });
  } catch (error) {
    console.error('Error al cargar categorías:', error);
    categoriaSelect.innerHTML = '<option value="">Error al cargar</option>';
  }
}

// --- CRUD: LISTAR ACTIVIDADES ---
async function cargarActividades() {
  try {
    const resp = await fetch(API_BASE);
    if (!resp.ok) throw new Error('Error al cargar actividades');
    const actividades = await resp.json(); 
    // Se espera un array de objetos:
    // { id, categoria: { id, nombre }, nombre, descripcion, lugar, precio, fechas: [{fecha, hora}, ...] }
    tablaActividades.innerHTML = '';
    actividades.forEach(act => {
      const tr = document.createElement('tr');

      // Columnas principales
      tr.innerHTML = `
        <td>${act.id}</td>
        <td>${act.categoria?.nombre || ''}</td>
        <td>${act.nombre}</td>
        <td>${act.descripcion}</td>
        <td>${act.lugar}</td>
        <td>$ ${act.precio.toFixed(2)}</td>
        <td>${formatearFechas(act.fechas)}</td>
        <td>
          <button class="btn-accion btn-editar" data-id="${act.id}">Editar</button>
          <button class="btn-accion btn-eliminar" data-id="${act.id}">Eliminar</button>
        </td>
      `;
      tablaActividades.appendChild(tr);
    });
    // Luego, enlazar eventos de Editar / Eliminar
    enlazarBotonesAccion();
  } catch (error) {
    console.error('Error al cargar actividades:', error);
  }
}

// Formatea el array de fechas/h horas a un string legible
function formatearFechas(fechasArray) {
  if (!Array.isArray(fechasArray) || fechasArray.length === 0) return '';
  return fechasArray
    .map(fh => `${fechaFormatoDDMM(fh.fecha)} ${horaFormatoHHMM(fh.hora)}`)
    .join(' | ');
}

// Convierte '2025-06-15' a '15/06/2025'
function fechaFormatoDDMM(fechaISO) {
  const [año, mes, dia] = fechaISO.split('-');
  return `${dia}/${mes}/${año}`;
}

// Convierte '14:30:00' a '14:30' (asumiendo formato HH:MM:SS)
function horaFormatoHHMM(hora) {
  return hora.slice(0,5);
}

// --- Vincula eventos a botones de editar y eliminar en la tabla ---
function enlazarBotonesAccion() {
  // Editar:
  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      cargarActividadParaEdicion(id);
    });
  });
  // Eliminar:
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (confirm('¿Seguro que querés eliminar esta actividad?')) {
        eliminarActividad(id);
      }
    });
  });
}

// --- LIMPIAR Y VOLVER A MODO “CREAR” ---
function limpiarFormulario() {
  modoEdicion = false;
  actividadIdInput.value = '';
  categoriaSelect.value = '';
  nombreInput.value = '';
  descripcionInput.value = '';
  lugarInput.value = '';
  precioInput.value = '';
  contenedorFechasHoras.innerHTML = ''; // Quitar todas las filas de fecha/hora
  btnGuardar.textContent = 'Crear Actividad';
  btnCancelarEdicion.classList.add('hidden');
}

// --- CREAR Actividad ---
async function crearActividad() {
  try {
    const nuevoObjeto = recopilarDatosDelFormulario();
    const resp = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoObjeto)
    });
    if (!resp.ok) throw new Error('Error al crear actividad');
    await cargarActividades();
    limpiarFormulario();
  } catch (error) {
    console.error('Error al crear actividad:', error);
    alert('No se pudo crear la actividad. Revisá la consola.');
  }
}

// --- CARGAR datos “una sola actividad” para edición ---
async function cargarActividadParaEdicion(id) {
  try {
    const resp = await fetch(`${API_BASE}/${id}`);
    if (!resp.ok) throw new Error('Actividad no encontrada');
    const act = await resp.json(); 
    // Rellenar formulario
    modoEdicion = true;
    actividadIdInput.value = act.id;
    categoriaSelect.value = act.categoria.id;
    nombreInput.value = act.nombre;
    descripcionInput.value = act.descripcion;
    lugarInput.value = act.lugar;
    precioInput.value = act.precio;

    // Fechas y horas: 
    contenedorFechasHoras.innerHTML = '';
    act.fechas.forEach(fh => {
      agregarFilaFechaHora(fh.fecha, fh.hora);
    });

    btnGuardar.textContent = 'Guardar Cambios';
    btnCancelarEdicion.classList.remove('hidden');
    // Hacer scroll al form
    formActividad.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error('Error al cargar actividad para edición:', error);
    alert('No se pudo cargar la actividad para editar.');
  }
}

// --- ACTUALIZAR Actividad ---
async function actualizarActividad() {
  try {
    const id = actividadIdInput.value;
    const objetoEditado = recopililarDatosDelFormularioParaEdicion(id);
    const resp = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objetoEditado)
    });
    if (!resp.ok) throw new Error('Error al actualizar actividad');
    await cargarActividades();
    limpiarFormulario();
  } catch (error) {
    console.error('Error al actualizar actividad:', error);
    alert('No se pudo actualizar la actividad. Revisá la consola.');
  }
}

// --- ELIMINAR Actividad ---
async function eliminarActividad(id) {
  try {
    const resp = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });
    if (!resp.ok) throw new Error('No se pudo eliminar actividad');
    await cargarActividades();
  } catch (error) {
    console.error('Error al eliminar actividad:', error);
    alert('No se pudo eliminar la actividad. Revisá la consola.');
  }
}

// --- RECOPILAR datos del formulario (para crear/editar) ---
function recopilarDatosDelFormulario() {
  // Validar que haya al menos una fecha/hora:
  const fechasHoras = recolectarFechasHorasDesdeDOM();
  if (fechasHoras.length === 0) {
    alert('Agregá al menos una fecha y hora para la actividad.');
    throw new Error('Sin fechas/hora');
  }
  return {
    categoriaId: parseInt(categoriaSelect.value),
    nombre: nombreInput.value.trim(),
    descripcion: descripcionInput.value.trim(),
    lugar: lugarInput.value.trim(),
    precio: parseFloat(precioInput.value),
    fechas: fechasHoras  // [{ fecha: 'YYYY-MM-DD', hora: 'HH:MM:SS' }, ...]
  };
}

// Al editar reservamos el id dentro del objeto también
function recopililarDatosDelFormularioParaEdicion(id) {
  const datos = recopilarDatosDelFormulario();
  datos.id = parseInt(id);
  return datos;
}

// --- RECOLECTAR Fechas/Horas desde el DOM ---
function recolectarFechasHorasDesdeDOM() {
  const filas = contenedorFechasHoras.querySelectorAll('.fh-row');
  const arr = [];
  filas.forEach(row => {
    const fechaInput = row.querySelector('input[type="date"]');
    const horaInput  = row.querySelector('input[type="time"]');
    if (fechaInput.value && horaInput.value) {
      // Asegurarse de tener formato ISO:
      const fechaISO = fechaInput.value;                 // yyyy-MM-dd
      const horaISO  = horaInput.value + ':00';          // HH:mm:ss
      arr.push({ fecha: fechaISO, hora: horaISO });
    }
  });
  return arr;
}

// --- AGREGAR dinamicamente UNA FILA de fecha+hora (opcional valores iniciales) ---
function agregarFilaFechaHora(valorFecha = '', valorHora = '') {
  const div = document.createElement('div');
  div.classList.add('fh-row');
  div.innerHTML = `
    <input type="date" class="fh-input" value="${valorFecha}" required>
    <input type="time" class="fh-input" value="${valorHora.slice(0,5)}" required>
    <button type="button" class="btn-eliminar-fh">×</button>
  `;
  // Evento para eliminar esta fila
  div.querySelector('.btn-eliminar-fh').addEventListener('click', () => {
    div.remove();
  });
  contenedorFechasHoras.appendChild(div);
}

// --- FIN de actividad_index.js ---
