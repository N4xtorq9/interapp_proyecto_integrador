import { redirectAlert } from "./alerts.js";
import { guardarSesion } from "./session.js";

async function iniciarSesion() {
  let email = document.querySelector("#correo").value;
  let contrasena = document.querySelector("#clave").value;

  try {
    let respuesta = await fetch("api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, contrasena: contrasena }),
    });

    if (respuesta.ok) {
      let usuario = await respuesta.json();
      guardarSesion(usuario);
      redirectAlert("Bienvenido al sistema " + usuario.nombre, "success", "index.html");
    } else {
      redirectAlert("Error de credenciales", "error", "login.html");
    }
  } catch (error) {
    redirectAlert("No se pudo conectar con el servidor", "error", "login.html");
  }
}

let btn_login = document.querySelector("#btn-login");
btn_login.addEventListener("click", iniciarSesion);

let btn_registro = document.querySelector("#btn-registro");
btn_registro.addEventListener("click", function () {
  window.location.href = "pages/registro.html";
});
