package com.interapp.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.interapp.model.Usuario;
import com.interapp.repository.UsuarioRepository;

@RestController
@RequestMapping("/api")
public class LoginController {

    private final UsuarioRepository usuarios;

    public LoginController(UsuarioRepository usuarios) {
        this.usuarios = usuarios;
    }

    public record DatosLogin(String email, String contrasena) {
    }

    public record DatosRegistro(String nombre, String email, String telefono, String contrasena) {
    }

    // Nunca se devuelve la contrasena: JS guarda solo el id y el nombre en localStorage
    public record UsuarioSesion(Long id, String nombre) {
    }

    @PostMapping("/registro")
    public ResponseEntity<Void> registro(@RequestBody DatosRegistro datos) {
        if (usuarios.existsByEmail(datos.email())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        usuarios.save(new Usuario(datos.nombre(), null, datos.email(), datos.telefono(), datos.contrasena(), null,
                null));
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioSesion> login(@RequestBody DatosLogin datos) {
        return usuarios.findByEmailAndContrasena(datos.email(), datos.contrasena())
                .map(usuario -> ResponseEntity.ok(new UsuarioSesion(usuario.getId(), usuario.getNombreCompleto())))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}
