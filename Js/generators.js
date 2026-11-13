// Crea un id único para un usuario nuevo. Ej: "usr_1763049000000"
export function generarIdUsuario() {
  return "usr_" + Date.now();
}

// Crea el código del siguiente producto. Ej: si hay 6, devuelve "INT-7"
export function generarCodigoProducto(productos) {
  return "INT-" + (productos.length + 1);
}
