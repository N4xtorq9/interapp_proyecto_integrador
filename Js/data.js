let usuarios = [
    {
        id: "id1",
        nombre: "Nestor Quiñones",
        correo: "n4xtor@gmail.com",
        telefono: "3182122259",
        contrasena: "12345"
    },
    {
        id: "id2",
        nombre: "Jhonatan Rayo",
        correo: "jrayo@cesde.net",
        telefono: "3016970638",
        contrasena: "123456"
    },
    {
        id: "id3",
        nombre: "Felipe Madrid",
        correo: "fmadrid@cesde.net",
        telefono: "3104981209",
        contrasena: "1234567"
    },
    
];

// El método find busca para redireccionar el resultado
export function buscarUsuario(correo, clave) {
    let auth = usuarios.find((usuario)=> correo == usuario.correo && clave == usuario.contrasena)
    return auth
}