import { redirectAlert, mostrarAlerta } from "./alerts.js";
import { obtenerUsuarios, guardarUsuarios, guardarSesion, cerrarSesion } from "./local-storage.js";
import { generarIdUsuario } from "./generators.js";

// Este archivo se usa en varias páginas.
// Cada parte revisa si el botón o formulario existe en la página actual.

// ---------- LOGIN (login.html) ----------

function iniciarSesion() {
  let correo = document.querySelector("#correo").value;
  let clave = document.querySelector("#clave").value;

  let usuarios = obtenerUsuarios();
  let encontrado = null;
  for (let usuario of usuarios) {
    if (usuario.correo == correo && usuario.contrasena == clave) {
      encontrado = usuario;
    }
  }

  if (encontrado == null) {
    mostrarAlerta("Correo o contraseña incorrectos", "error");
    return;
  }

  guardarSesion(encontrado);
  redirectAlert("Bienvenido " + encontrado.nombre, "success", "dashboard.html");
}

let btnLogin = document.querySelector("#btn-login");
if (btnLogin) {
  btnLogin.addEventListener("click", iniciarSesion);
}

let btnIrRegistro = document.querySelector("#btn-registro");
if (btnIrRegistro) {
  btnIrRegistro.addEventListener("click", function () {
    window.location.href = "pages/registro.html";
  });
}

// ---------- REGISTRO (pages/registro.html) ----------

function registrarUsuario(evento) {
  evento.preventDefault();
  let formulario = evento.target;

  if (formulario.correo.value != formulario.correo2.value) {
    mostrarAlerta("Los correos no coinciden", "warning");
    return;
  }
  if (formulario.clave.value != formulario.clave2.value) {
    mostrarAlerta("Las contraseñas no coinciden", "warning");
    return;
  }

  let usuarios = obtenerUsuarios();
  for (let usuario of usuarios) {
    if (usuario.correo == formulario.correo.value) {
      mostrarAlerta("Ese correo ya está registrado", "error");
      return;
    }
  }

  let nuevoUsuario = {
    id: generarIdUsuario(),
    nombre: formulario.nombre.value,
    usuario: formulario.usuario.value,
    nacimiento: formulario.nacimiento.value,
    correo: formulario.correo.value,
    telefono: formulario.celular.value,
    contrasena: formulario.clave.value,
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);
  redirectAlert("Cuenta creada, ya puedes iniciar sesión", "success", "../login.html");
}

let formRegistro = document.querySelector("#form-registro");
if (formRegistro) {
  formRegistro.addEventListener("submit", registrarUsuario);
}

// ---------- CERRAR SESIÓN (dashboard.html) ----------

let botonesSalir = document.querySelectorAll(".salir");
for (let boton of botonesSalir) {
  boton.addEventListener("click", cerrarSesion);
}
