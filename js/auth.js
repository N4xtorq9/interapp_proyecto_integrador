import { showSuccess, showError } from "./alert.js";

let loginForm = document.getElementById("loginForm");
let registerForm = document.getElementById("registerForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    let email = document.getElementById("email").value.trim().toLowerCase();
    let password = document.getElementById("password").value;
    let users = JSON.parse(localStorage.getItem("interapp_users") || "[]");
    let user = users.find(function (item) {
      return item.email === email && item.password === password;
    });

    if (!email || !password) {
      await showError("Campos incompletos", "Ingresa tu correo y contraseña para continuar.");
      return;
    }

    if (!user) {
      await showError("Credenciales incorrectas", "El correo o la contraseña no son correctos. Verifica tus datos e inténtalo nuevamente.");
      return;
    }

    localStorage.setItem("interapp_current_user", JSON.stringify({
      name: user.name,
      email: user.email
    }));
    await showSuccess("¡Bienvenido/a a InterApp!", "Has iniciado sesión correctamente.");
    window.location.href = "dashboard.html";
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim().toLowerCase();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let users = JSON.parse(localStorage.getItem("interapp_users") || "[]");

    if (!name || !email || !password || !confirmPassword) {
      await showError("Campos incompletos", "Completa todos los campos del formulario.");
      return;
    }
    if (password.length < 6) {
      await showError("Contraseña no válida", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      await showError("Las contraseñas no coinciden", "Verifica que ambas contraseñas sean iguales.");
      return;
    }
    if (users.some(function (item) { return item.email === email; })) {
      await showError("Correo registrado", "Ya existe una cuenta asociada a este correo.");
      return;
    }

    users.push({ id: Date.now().toString(), name: name, email: email, password: password });
    localStorage.setItem("interapp_users", JSON.stringify(users));
    await showSuccess("¡Cuenta creada!", "Tu registro fue exitoso. Ahora puedes iniciar sesión.");
    window.location.href = "login.html";
  });
}
