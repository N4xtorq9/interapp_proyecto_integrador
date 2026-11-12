// La sesión se guarda en localStorage. Vaadin lee estas mismas claves.
export function guardarSesion(usuario) {
  localStorage.setItem("usuarioId", usuario.id);
  localStorage.setItem("usuarioNombre", usuario.nombre);
}

export function obtenerSesion() {
  let id = localStorage.getItem("usuarioId");
  if (!id) {
    return null;
  }
  return { id: id, nombre: localStorage.getItem("usuarioNombre") };
}

export function cerrarSesion() {
  localStorage.removeItem("usuarioId");
  localStorage.removeItem("usuarioNombre");
}
