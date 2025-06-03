    const timeline = document.getElementById('timeline');
    const playersTable = document.getElementById('playersTable');

    function addCard() {
        const card = document.createElement('div');
        card.className = "bg-white shadow rounded p-4 w-60 flex-shrink-0";

        card.innerHTML = `
            <input type="text" placeholder="Año" class="year-input" />
            <textarea placeholder="Descripción" class="description-input"></textarea>
            <input type="file" accept=".jpg, .jpeg, .png" class="file-input" />
            <button onclick="this.parentElement.remove()" class="text-red-500 hover:underline">Eliminar</button>
        `;

        timeline.appendChild(card);
    }

function renderPlayersTable() {
  playersTable.innerHTML = ''; // Limpiar tabla
  playersHistoric.forEach((player, index) => {
    const row = document.createElement('tr');
    row.dataset.id = player.id;  // Para identificarlo más fácil
    row.innerHTML = `
      <td class="border px-4 py-2">${player.name}</td>
      <td class="border px-4 py-2">${player.position}</td>
      <td class="border px-4 py-2"><img src="${player.photo}" alt="${player.name}" style="width:50px; height:auto;"></td>
      <td class="border px-4 py-2 text-center">${player.score}</td>
      <td class="border px-4 py-2">
        <button onclick="moveUp(${index})" class="text-blue-500 hover:underline mr-2">↑</button>
        <button onclick="moveDown(${index})" class="text-blue-500 hover:underline mr-2">↓</button>
        <button onclick="removePlayer(${index})" class="text-red-500 hover:underline">Eliminar</button>
      </td>
    `;
    playersTable.appendChild(row);
  });
}

function moveUp(index) {
  if (index > 0) {
    [playersHistoric[index - 1], playersHistoric[index]] = [playersHistoric[index], playersHistoric[index - 1]];
    renderPlayersTable();
    // Aquí podrías llamar a backend para actualizar el orden
  }
}

function moveDown(index) {
  if (index < playersHistoric.length - 1) {
    [playersHistoric[index + 1], playersHistoric[index]] = [playersHistoric[index], playersHistoric[index + 1]];
    renderPlayersTable();
    // Aquí podrías llamar a backend para actualizar el orden
  }
}

function removePlayer(index) {
  // Confirmar antes de eliminar
  if (confirm(`¿Eliminar a ${playersHistoric[index].name} del histórico?`)) {
    playersHistoric.splice(index, 1);
    renderPlayersTable();
    // Aquí podrías llamar a backend para actualizar el histórico
  }
}

// Cuando tengas los datos del backend, los asignas y renderizas:
renderPlayersTable();
