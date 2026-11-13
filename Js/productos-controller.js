import { mostrarAlerta } from "./alerts.js";
import { obtenerProductos, guardarProductos, obtenerSesion } from "./local-storage.js";
import { generarCodigoProducto } from "./generators.js";

// Este archivo se usa en index.html (todos los productos)
// y en dashboard.html (mi perfil y mis productos).

// ---------- INICIO (index.html) ----------

function mostrarCatalogo(lista) {
  for (let producto of obtenerProductos()) {
    let clase = "exchange-badge1";
    if (producto.estado == "Intercambio") {
      clase = "exchange-badge";
    }

    let tarjeta = document.createElement("section");
    tarjeta.className = "col-6 col-md-4 col-lg-2";
    tarjeta.innerHTML = `
      <section class="card product-card">
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
        <section class="card-body">
          <span class="badge ${clase}">${producto.estado}</span>
          <h5 class="mt-2">${producto.nombre}</h5>
          <p>Cambio por ${producto.busco}</p>
        </section>
      </section>
    `;
    lista.appendChild(tarjeta);
  }
}

let catalogo = document.querySelector("#lista-productos");
if (catalogo) {
  mostrarCatalogo(catalogo);
}

// ---------- MI PERFIL (dashboard.html) ----------

function mostrarMiProducto(producto, lista) {
  let tarjeta = document.createElement("section");
  tarjeta.className = "product-card";
  tarjeta.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}">
    <h3>${producto.nombre}</h3>
    <p>Busco: ${producto.busco}</p>
    <span>${producto.estado}</span>
  `;
  lista.appendChild(tarjeta);
}

function cargarPerfil(sesion) {
  document.querySelector("#perfil-nombre").textContent = sesion.nombre;
  document.querySelector("#perfil-correo").textContent = sesion.correo;
  document.querySelector("#perfil-telefono").textContent = sesion.telefono;

  let lista = document.querySelector("#mis-productos");
  let total = 0;
  for (let producto of obtenerProductos()) {
    if (producto.duenoId == sesion.id) {
      mostrarMiProducto(producto, lista);
      total = total + 1;
    }
  }
  document.querySelector("#total-productos").textContent = total;
}

function agregarProducto(evento) {
  evento.preventDefault();
  let formulario = evento.target;
  let sesion = obtenerSesion();
  let productos = obtenerProductos();

  // Si no pegan el link de una imagen, se usa el logo
  let imagen = formulario.imagen.value;
  if (imagen == "") {
    imagen = "assets/images/logo.png";
  }

  let nuevoProducto = {
    codigo: generarCodigoProducto(productos),
    nombre: formulario.nombre.value,
    busco: formulario.busco.value,
    estado: formulario.estado.value,
    imagen: imagen,
    duenoId: sesion.id,
  };

  productos.push(nuevoProducto);
  guardarProductos(productos);

  mostrarMiProducto(nuevoProducto, document.querySelector("#mis-productos"));
  let total = document.querySelector("#total-productos");
  total.textContent = Number(total.textContent) + 1;

  formulario.reset();
  formulario.hidden = true;
  mostrarAlerta("Producto guardado", "success");
}

let formProducto = document.querySelector("#form-producto");
if (formProducto) {
  let sesion = obtenerSesion();
  // Sin sesión no se puede ver el perfil
  if (sesion == null) {
    window.location.href = "login.html";
  } else {
    cargarPerfil(sesion);
  }

  // El botón "Añadir productos" muestra u oculta el formulario
  document.querySelector("#btn-agregar").addEventListener("click", function () {
    formProducto.hidden = !formProducto.hidden;
  });
  formProducto.addEventListener("submit", agregarProducto);
}
