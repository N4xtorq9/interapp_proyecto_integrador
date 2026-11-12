import { redirectAlert } from "./alerts.js";
import { buscarUsuario } from "./data.js";

function iniciarSesion(){
let correo =document.querySelector("#correo").value;
let clave = document.querySelector("#clave").value;
let usuario = buscarUsuario(correo, clave);

if(usuario){
    redirectAlert("Bienvenido al sistema " + usuario.nombre, "success", "/dashboard.html");
}   else{
        redirectAlert("Error de credenciales", "error", "/login.html");
    }
}


let btn_login = document.querySelector("#btn-login");
btn_login.addEventListener("click", iniciarSesion)
