package com.interapp.views;

import com.interapp.model.Usuario;
import com.interapp.repository.ProductoRepository;
import com.interapp.repository.UsuarioRepository;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.avatar.Avatar;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

@PageTitle("InterApp | Mi perfil")
@Route(value = "perfil", layout = MainLayout.class)
public class PerfilView extends VerticalLayout {

    private final ProductoRepository productos;

    public PerfilView(UsuarioRepository usuarios, ProductoRepository productos) {
        this.productos = productos;
        Sesion.conUsuario(usuarios, this::mostrarPerfil);
    }

    private void mostrarPerfil(Usuario usuario) {
        Avatar foto = new Avatar(usuario.getNombreCompleto());
        foto.setImage(usuario.getFotoUrl());
        foto.addClassName("perfil-foto");

        Div datos = new Div(
                new H2(usuario.getNombreCompleto()),
                new Span("Miembro desde " + usuario.getFechaRegistro().getYear()));
        if (usuario.getCiudad() != null) {
            datos.add(new Paragraph(usuario.getCiudad()));
        }
        datos.add(new Paragraph(usuario.getEmail()), new Paragraph(usuario.getTelefono()));
        datos.addClassName("perfil-datos");

        int total = productos.findByDuenoId(usuario.getId()).size();
        Div estadistica = new Div(new H3(String.valueOf(total)), new Paragraph("Productos"));
        estadistica.addClassName("perfil-estadistica");

        Div tarjeta = new Div(foto, datos, estadistica);
        tarjeta.addClassName("perfil-tarjeta");

        Button verProductos = new Button("Ver mis productos",
                evento -> UI.getCurrent().navigate(MisProductosView.class));
        verProductos.addClassName("boton-naranja");

        add(tarjeta, verProductos);
    }
}
