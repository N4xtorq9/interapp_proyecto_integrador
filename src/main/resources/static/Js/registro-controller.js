import { redirectAlert } from "./alerts.js";

async function crearCuenta(evento) {
  evento.preventDefault();
  let datos = new FormData(evento.target);

  try {
    let respuesta = await fetch("../api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: datos.get("nombre"),
        email: datos.get("correo"),
        telefono: datos.get("celular"),
        contrasena: datos.get("clave"),
      }),
    });

    if (respuesta.ok) {
      redirectAlert("Cuenta creada correctamente", "success", "../login.html");
    } else if (respuesta.status === 409) {
      Swal.fire({ title: "Ese correo ya está registrado", icon: "error" });
    } else {
      Swal.fire({ title: "No se pudo crear la cuenta", icon: "error" });
    }
  } catch (error) {
    Swal.fire({ title: "No se pudo conectar con el servidor", icon: "error" });
  }
}

document.querySelector("#form-registro").addEventListener("submit", crearCuenta);
