import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

export let showSuccess = function (title, message) {
  return Swal.fire({
    icon: "success",
    title: title,
    text: message,
    confirmButtonText: "Continuar",
    confirmButtonColor: "#233F83"
  });
};

export let showError = function (title, message) {
  return Swal.fire({
    icon: "error",
    title: title,
    text: message,
    confirmButtonText: "Entendido",
    confirmButtonColor: "#233F83"
  });
};

export let showInfo = function (title, message) {
  return Swal.fire({
    icon: "info",
    title: title,
    text: message,
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#233F83"
  });
};

export let confirmAction = function (title, message) {
  return Swal.fire({
    icon: "warning",
    title: title,
    text: message,
    showCancelButton: true,
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#233F83"
  });
};
