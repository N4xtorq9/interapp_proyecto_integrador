// Datos iniciales: se copian a localStorage la primera vez que se abre la app

export let usuarios = [
  {
    id: "usr_1",
    nombre: "Nestor Quiñones",
    correo: "n4xtor@gmail.com",
    telefono: "3182122259",
    contrasena: "12345",
  },
  {
    id: "usr_2",
    nombre: "Jhonatan Rayo",
    correo: "jrayo@cesde.net",
    telefono: "3016970638",
    contrasena: "123456",
  },
  {
    id: "usr_3",
    nombre: "Felipe Madrid",
    correo: "fmadrid@cesde.net",
    telefono: "3104981209",
    contrasena: "1234567",
  },
];

export let productos = [
  {
    codigo: "INT-1",
    nombre: "iPhone 17 Pro Max 256gb",
    busco: "Smartwatch",
    estado: "Disponible",
    imagen: "assets/images/productos/1.jpg",
    duenoId: "usr_1",
  },
  {
    codigo: "INT-2",
    nombre: 'MacBook Air M1 13" 256 GB',
    busco: "Bicicleta",
    estado: "Intercambio",
    imagen: "assets/images/productos/2.jpg",
    duenoId: "usr_1",
  },
  {
    codigo: "INT-3",
    nombre: "Bicicleta MTB",
    busco: "Celular",
    estado: "Intercambio",
    imagen: "assets/images/productos/3.jpg",
    duenoId: "usr_2",
  },
  {
    codigo: "INT-4",
    nombre: "PlayStation 4",
    busco: "TV",
    estado: "Disponible",
    imagen: "assets/images/productos/4.jpg",
    duenoId: "usr_2",
  },
  {
    codigo: "INT-5",
    nombre: "Televisor de 55'",
    busco: "PlayStation",
    estado: "Intercambio",
    imagen: "assets/images/productos/5.jpg",
    duenoId: "usr_3",
  },
  {
    codigo: "INT-6",
    nombre: "Drone con Control RC 2",
    busco: "iPhone 17 Pro Max",
    estado: "Intercambio",
    imagen: "assets/images/productos/6.jpg",
    duenoId: "usr_3",
  },
];
