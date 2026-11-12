// Make the mobile sidebar hamburger reveal the menu list.
document.addEventListener('DOMContentLoaded', function() {
	var toggleCheckbox = document.getElementById('sidebar-toggle');
	var menu = document.querySelector('.sidebar .menu');
	if (!toggleCheckbox || !menu) return;

	function updateMenuVisibility() {
		if (toggleCheckbox.checked) {
			menu.classList.add('menu-open');
		} else {
			menu.classList.remove('menu-open');
		}
	}

	toggleCheckbox.addEventListener('change', updateMenuVisibility);
	updateMenuVisibility();
    
	// Permitir abrir/cerrar el menú al hacer clic en cualquier parte del header
	var header = document.querySelector('.sidebar-header');
	if (header) {
		header.addEventListener('click', function(e) {
			// Si el clic fue sobre un enlace o sobre el label asociado, no togglear aquí
			if (e.target.closest('a') || e.target.closest('label[for="sidebar-toggle"]')) return;
			// Toggleamos el checkbox y disparamos el cambio para mantener la lógica existente
			toggleCheckbox.checked = !toggleCheckbox.checked;
			toggleCheckbox.dispatchEvent(new Event('change'));
		});
	}
});
