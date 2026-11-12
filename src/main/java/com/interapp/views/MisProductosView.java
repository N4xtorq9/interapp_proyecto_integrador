package com.interapp.views;

import java.util.List;

import com.interapp.model.Producto;
import com.interapp.model.Usuario;
import com.interapp.repository.ProductoRepository;
import com.interapp.repository.UsuarioRepository;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

@PageTitle("InterApp | Mis productos")
@Route(value = "mis-productos", layout = MainLayout.class)
public class MisProductosView extends VerticalLayout {

    private final ProductoRepository productos;

    public MisProductosView(UsuarioRepository usuarios, ProductoRepository productos) {
        this.productos = productos;
        Sesion.conUsuario(usuarios, this::mostrarProductos);
    }

    private void mostrarProductos(Usuario usuario) {
        add(new H2("Mis productos"));

        List<Producto> lista = productos.findByDuenoId(usuario.getId());
        if (lista.isEmpty()) {
            add(new Paragraph("Todavía no tienes productos."));
            return;
        }

        Div cuadricula = new Div();
        cuadricula.addClassName("productos-cuadricula");
        lista.forEach(producto -> cuadricula.add(crearTarjeta(producto)));
        add(cuadricula);
    }

    private Div crearTarjeta(Producto producto) {
        Image imagen = new Image(producto.getImagenUrl(), producto.getNombre());
        Span estado = new Span(producto.getEstado());
        estado.addClassName("producto-estado");

        Div tarjeta = new Div(imagen, estado, new H4(producto.getNombre()),
                new Paragraph("Cambio por: " + producto.getCambioPor()));
        tarjeta.addClassName("producto-tarjeta");
        return tarjeta;
    }
}
