// Datos simulados de publicaciones
const publicaciones = [
  {
    id: 1,
    titulo: "Nuevo sistema de reservas",
    resumen: "Presentamos el nuevo sistema para reservar actividades online fácilmente.",
    imagen: "../../img/ejemplo-1.jpeg"
  },
  {
    id: 2,
    titulo: "Mejoras en el club deportivo",
    resumen: "Hemos renovado las instalaciones para que disfrutes más tus entrenamientos.",
    imagen: "../../img/ejemplo-3.jpeg" 
  },
  {
    id: 3,
    titulo: "Campeonato 2025: fechas confirmadas",
    resumen: "Se anunciaron las fechas para el próximo campeonato. ¡Inscribite ya!",
    imagen: "../../img/ejemplo-4.jpg"
  },
  {
    id: 4,
    titulo: "Clases de yoga y pilates",
    resumen: "Incorporamos nuevas clases para tu bienestar físico y mental.",
    imagen: "../../img/ejemplo-5.jpg"
  },
  {
    id: 5,
    titulo: "Charla sobre nutrición deportiva",
    resumen: "No te pierdas la charla con expertos en nutrición este viernes.",
    imagen: "../../img/ejemplo-6.jpeg"
  },
  {
    id: 6,
    titulo: "Nuevos horarios en la pileta",
    resumen: "Ajustamos los horarios para que puedas aprovechar mejor la piscina.",
    imagen: "../../img/ejemplo-7.jpg"
  },
];

const publicacionesPorPagina = 3;
let paginaActual = 1;

function mostrarPublicaciones() {
  const inicio = (paginaActual - 1) * publicacionesPorPagina;
  const fin = inicio + publicacionesPorPagina;
  const publicacionesPagina = publicaciones.slice(inicio, fin);

  const grid = document.getElementById('publicacionesGrid');
  grid.innerHTML = ''; // limpiar

  publicacionesPagina.forEach(pub => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${pub.imagen}" alt="${pub.titulo}" />
      <div class="card-body">
        <div class="card-title">${pub.titulo}</div>
        <div class="card-summary">${pub.resumen}</div>
        <a href="/publicaciones/${pub.id}">Leer más</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

function crearPaginacion() {
  const totalPaginas = Math.ceil(publicaciones.length / publicacionesPorPagina);
  const container = document.getElementById('pagination');
  container.innerHTML = '';

  // Botón Anterior
  const btnAnterior = document.createElement('button');
  btnAnterior.textContent = 'Anterior';
  btnAnterior.disabled = paginaActual === 1;
  btnAnterior.onclick = () => {
    paginaActual--;
    actualizarVista();
  };
  container.appendChild(btnAnterior);

  // Números de página
  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === paginaActual) {
      btn.disabled = true;
    }
    btn.onclick = () => {
      paginaActual = i;
      actualizarVista();
    };
    container.appendChild(btn);
  }

  // Botón Siguiente
  const btnSiguiente = document.createElement('button');
  btnSiguiente.textContent = 'Siguiente';
  btnSiguiente.disabled = paginaActual === totalPaginas;
  btnSiguiente.onclick = () => {
    paginaActual++;
    actualizarVista();
  };
  container.appendChild(btnSiguiente);
}

function actualizarVista() {
  mostrarPublicaciones();
  crearPaginacion();
}

// Inicialización
actualizarVista();
