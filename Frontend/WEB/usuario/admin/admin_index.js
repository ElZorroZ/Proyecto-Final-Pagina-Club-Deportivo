// Función para alternar submenu abierto/cerrado
document.querySelectorAll('.category-btn').forEach(button => {
  button.addEventListener('click', () => {
    const submenuId = button.getAttribute('aria-controls');
    if (!submenuId) return; // si no tiene submenu, no hace nada

    const submenu = document.getElementById(submenuId);
    const isOpen = submenu.classList.contains('open');

    if (isOpen) {
      submenu.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
    } else {
      submenu.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});
