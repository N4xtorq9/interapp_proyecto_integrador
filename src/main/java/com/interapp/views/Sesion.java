package com.interapp.views;

import java.util.Optional;
import java.util.function.Consumer;

import com.interapp.model.Usuario;
import com.interapp.repository.UsuarioRepository;
import com.vaadin.flow.component.UI;

// Vaadin corre en el servidor, por eso le pide al navegador lo que JS guardo en localStorage
public final class Sesion {

    private Sesion() {
    }

    public static void conUsuario(UsuarioRepository usuarios, Consumer<Usuario> accion) {
        UI ui = UI.getCurrent();
        ui.getPage().executeJs("return localStorage.getItem('usuarioId')").then(String.class, id -> {
            Optional<Usuario> usuario = id != null && id.matches("\\d+")
                    ? usuarios.findById(Long.valueOf(id))
                    : Optional.empty();
            usuario.ifPresentOrElse(accion, () -> ui.getPage().setLocation("/login.html"));
        });
    }

    public static void cerrar() {
        UI.getCurrent().getPage().executeJs("""
                localStorage.removeItem('usuarioId');
                localStorage.removeItem('usuarioNombre');
                window.location.href = '/index.html';
                """);
    }
}
