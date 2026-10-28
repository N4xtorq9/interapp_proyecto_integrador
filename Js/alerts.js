export function redirectAlert(message, icon, url) {
  let timerInterval;
  Swal.fire({
    title: message,
    html: "Esta ventana se cierra en <b></b> milisegundos.",
    timer: 2000,
    timerProgressBar: true,
    icon: icon,
    didOpen: () => {
      Swal.showLoading();
      const timer = Swal.getPopup().querySelector("b");
      timerInterval = setInterval(() => {
        timer.textContent = `${Swal.getTimerLeft()}`;
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
      window.location.href = url;
    },
  });
}