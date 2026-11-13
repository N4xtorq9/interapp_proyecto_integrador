import { usuarios, productos } from "./data.js";

// ---------- USUARIOS ----------

export function obtenerUsuarios() {
  let lista = JSON.parse(localStorage.getItem("usuarios"));
  // La primera vez no hay nada guardado: se usan los de data.js
  if (lista == null) {
    lista = usuarios;
    guardarUsuarios(lista);
  }
  return lista;
}

export function guardarUsuarios(lista) {
  localStorage.setItem("usuarios", JSON.stringify(lista));
}

// ---------- PRODUCTOS ----------

export function obtenerProductos() {
  let lista = JSON.parse(localStorage.getItem("productos"));
  if (lista == null) {
    lista = productos;
    guardarProductos(lista);
  }
  return lista;
}

export function guardarProductos(lista) {
  localStorage.setItem("productos", JSON.stringify(lista));
}

// ---------- SESIÓN ----------

export function guardarSesion(usuario) {
  localStorage.setItem("sesion", JSON.stringify(usuario));
}

export function obtenerSesion() {
  return JSON.parse(localStorage.getItem("sesion"));
}

export function cerrarSesion() {
  localStorage.removeItem("sesion");
}
