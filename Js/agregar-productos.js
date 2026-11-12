// Usuario que inició sesión (lo guardó el login en localStorage)
let usuarioId = localStorage.getItem("usuarioId");

let formulario = document.getElementById("form-producto");
let botonAgregar = document.getElementById("btn-agregar");
let lista = document.getElementById("mis-productos");

// El botón muestra u oculta el formulario
botonAgregar.addEventListener("click", function () {
  formulario.hidden = !formulario.hidden;
});

// Lee los productos guardados en localStorage
function leerProductos() {
  let productos = JSON.parse(localStorage.getItem("misProductos"));
  if (productos == null) {
    productos = [];
  }
  return productos;
}

// Agrega la tarjeta de un producto a "Mis productos"
function mostrarProducto(producto) {
  let tarjeta = document.createElement("section");
  tarjeta.className = "product-card";
  tarjeta.innerHTML = `
    <img src="assets/images/logo.png" alt="${producto.nombre}">
    <h3>${producto.nombre}</h3>
    <p>Busco: ${producto.busco}</p>
    <span>${producto.estado}</span>
  `;
  lista.appendChild(tarjeta);
}

// Al enviar el formulario: guarda el producto en localStorage y lo muestra
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  let producto = {
    nombre: document.getElementById("nombre").value,
    busco: document.getElementById("busco").value,
    estado: document.getElementById("estado").value,
    duenoId: usuarioId,
  };

  let productos = leerProductos();
  productos.push(producto);
  localStorage.setItem("misProductos", JSON.stringify(productos));

  mostrarProducto(producto);
  formulario.reset();
  formulario.hidden = true;
  alert("Producto guardado");
});

// Al abrir la página se muestran los productos de este usuario
for (let producto of leerProductos()) {
  if (producto.duenoId == usuarioId) {
    mostrarProducto(producto);
  }
}
