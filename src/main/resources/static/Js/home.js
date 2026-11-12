import { obtenerSesion, cerrarSesion } from "./session.js";

let categoriaActual = "";

// Barra superior: cambia según haya sesión en localStorage
function mostrarSesion() {
  let zona = document.querySelector("#zona-sesion");
  let sesion = obtenerSesion();

  if (!sesion) {
    zona.innerHTML = `
      <a href="login.html" class="iniciar">Iniciar Sesión</a>
      <a href="pages/registro.html" class="registro">Registrarse</a>
    `;
    return;
  }

  zona.innerHTML = `
    <section class="dropdown">
      <button class="iniciar dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <span id="nombre-usuario"></span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li><a class="dropdown-item" href="app/perfil">Mi perfil</a></li>
        <li><a class="dropdown-item" href="app/mis-productos">Mis productos</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><button class="dropdown-item" id="btn-salir" type="button">Cerrar sesión</button></li>
      </ul>
    </section>
  `;
  document.querySelector("#nombre-usuario").textContent = sesion.nombre;
  document.querySelector("#btn-salir").addEventListener("click", function () {
    cerrarSesion();
    mostrarSesion();
  });
}

function crearBotonCategoria(texto, valor) {
  let boton = document.createElement("button");
  boton.type = "button";
  boton.className = "categoria-btn";
  boton.textContent = texto;
  if (valor === categoriaActual) {
    boton.classList.add("activa");
  }

  boton.addEventListener("click", function () {
    categoriaActual = valor;
    document.querySelectorAll(".categoria-btn").forEach((b) => b.classList.remove("activa"));
    boton.classList.add("activa");
    cargarProductos();
  });
  return boton;
}

async function cargarCategorias() {
  let zona = document.querySelector("#categorias");
  zona.appendChild(crearBotonCategoria("Todos", ""));

  try {
    let respuesta = await fetch("api/categorias");
    let categorias = await respuesta.json();
    categorias.forEach((categoria) => zona.appendChild(crearBotonCategoria(categoria, categoria)));
  } catch (error) {
    console.error("No se pudieron cargar las categorías", error);
  }
}

function crearTarjeta(producto) {
  let columna = document.createElement("section");
  columna.className = "col-6 col-md-4 col-lg-3";
  columna.innerHTML = `
    <section class="card product-card h-100">
      <img class="card-img-top" loading="lazy">
      <section class="card-body">
        <span class="badge"></span>
        <small class="categoria-texto"></small>
        <h5 class="mt-2 producto-nombre"></h5>
        <p class="cambio-por"></p>
        <small class="producto-dueno"></small>
      </section>
    </section>
  `;

  let imagen = columna.querySelector("img");
  imagen.src = producto.imagenUrl || "assets/images/logo.png";
  imagen.alt = producto.nombre;

  let badge = columna.querySelector(".badge");
  badge.textContent = producto.estado || "Disponible";
  badge.classList.add(producto.estado === "Intercambio" ? "exchange-badge" : "exchange-badge1");

  columna.querySelector(".categoria-texto").textContent = producto.categoria;
  columna.querySelector(".producto-nombre").textContent = producto.nombre;
  columna.querySelector(".cambio-por").textContent = producto.cambioPor
    ? "Cambio por: " + producto.cambioPor
    : "";
  columna.querySelector(".producto-dueno").textContent = [producto.dueno, producto.ciudad]
    .filter(Boolean)
    .join(" · ");
  return columna;
}

function mostrarMensaje(texto) {
  let mensaje = document.createElement("p");
  mensaje.className = "mensaje-productos";
  mensaje.textContent = texto;
  document.querySelector("#lista-productos").replaceChildren(mensaje);
}

async function cargarProductos() {
  let buscar = document.querySelector("#buscador").value;
  let parametros = new URLSearchParams({ buscar: buscar, categoria: categoriaActual });

  try {
    let respuesta = await fetch("api/productos?" + parametros);
    let productos = await respuesta.json();

    if (productos.length === 0) {
      mostrarMensaje("No encontramos productos con esa búsqueda.");
      return;
    }
    document.querySelector("#lista-productos").replaceChildren(...productos.map(crearTarjeta));
  } catch (error) {
    mostrarMensaje("No se pudieron cargar los productos. Intenta de nuevo.");
  }
}

document.querySelector("#form-buscar").addEventListener("submit", function (evento) {
  evento.preventDefault();
  cargarProductos();
  document.querySelector("#productos").scrollIntoView({ behavior: "smooth" });
});

mostrarSesion();
cargarCategorias();
cargarProductos();
