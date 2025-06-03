const tablaPedidos = document.getElementById("tablaPedidos");
const metodoEnvioDefaultSelect = document.getElementById("metodoEnvioDefault");

// Simulación de datos
const pedidos = [
  {
    id: 1,
    usuario: "juanperez@gmail.com",
    metodoPago: "MercadoPago",
    estado: "No enviado",
    reembolso: false,
    envio: "Correo Argentino"
  },
  {
    id: 2,
    usuario: "maria123@yahoo.com",
    metodoPago: "Tarjeta",
    estado: "Entregado",
    reembolso: true,
    envio: "Retiro en el Club"
  }
];

function cargarPedidos() {
  tablaPedidos.innerHTML = "";
  pedidos.forEach(pedido => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${pedido.id}</td>
      <td>${pedido.usuario}</td>
      <td>${pedido.metodoPago}</td>
      <td>
        <select onchange="actualizarEstado(${pedido.id}, this.value)">
          ${["No enviado", "Entregado", "Reembolsado", "Cancelado"].map(estado => `
            <option value="${estado}" ${estado === pedido.estado ? "selected" : ""}>${estado}</option>
          `).join("")}
        </select>
      </td>
      <td>${pedido.reembolso ? "Sí" : "No"}</td>
      <td>
        <select onchange="actualizarEnvio(${pedido.id}, this.value)">
          ${["Retiro en el Club", "Envío a Domicilio", "Correo Argentino"].map(metodo => `
            <option value="${metodo}" ${metodo === pedido.envio ? "selected" : ""}>${metodo}</option>
          `).join("")}
        </select>
      </td>
      <td>
        <button onclick="verDetalle(${pedido.id})">Ver</button>
      </td>
    `;

    tablaPedidos.appendChild(tr);
  });
}

function actualizarEstado(id, nuevoEstado) {
  const pedido = pedidos.find(p => p.id === id);
  if (pedido) pedido.estado = nuevoEstado;
  console.log(`Estado del pedido ${id} cambiado a: ${nuevoEstado}`);
}

function actualizarEnvio(id, nuevoEnvio) {
  const pedido = pedidos.find(p => p.id === id);
  if (pedido) pedido.envio = nuevoEnvio;
  console.log(`Método de envío del pedido ${id} cambiado a: ${nuevoEnvio}`);
}

function guardarMetodoEnvioDefault() {
  const metodo = metodoEnvioDefaultSelect.value;
  localStorage.setItem("metodoEnvioDefault", metodo);
  alert(`Método predeterminado actualizado: ${metodo}`);
}

function verDetalle(id) {
  alert(`Aquí podrías mostrar un detalle completo del pedido con ID ${id}.`);
}

document.addEventListener("DOMContentLoaded", () => {
  const savedMetodo = localStorage.getItem("metodoEnvioDefault");
  if (savedMetodo) metodoEnvioDefaultSelect.value = savedMetodo;
  cargarPedidos();
});
