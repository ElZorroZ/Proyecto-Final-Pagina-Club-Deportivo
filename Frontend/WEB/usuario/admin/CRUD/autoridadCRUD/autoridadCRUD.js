const form = document.getElementById('formAutoridad');
const tabla = document.getElementById('tablaAutoridades').getElementsByTagName('tbody')[0];

let autoridades = [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const cargo = document.getElementById('cargo').value;
  const periodo = document.getElementById('periodo').value;

  autoridades.push({ nombre, cargo, periodo });
  actualizarTabla();
  form.reset();
});

function actualizarTabla() {
  tabla.innerHTML = '';
  autoridades.forEach((autoridad, index) => {
    const fila = tabla.insertRow();

    fila.innerHTML = `
      <td>${autoridad.nombre}</td>
      <td>${autoridad.cargo}</td>
      <td>${autoridad.periodo}</td>
      <td>
        <button onclick="editar(${index})">Editar</button>
        <button onclick="eliminar(${index})" class="btn-secundario">Eliminar</button>
      </td>
    `;
  });
}

function eliminar(index) {
  autoridades.splice(index, 1);
  actualizarTabla();
}

function editar(index) {
  const autoridad = autoridades[index];
  document.getElementById('nombre').value = autoridad.nombre;
  document.getElementById('cargo').value = autoridad.cargo;
  document.getElementById('periodo').value = autoridad.periodo;
  autoridades.splice(index, 1);
  actualizarTabla();
}
