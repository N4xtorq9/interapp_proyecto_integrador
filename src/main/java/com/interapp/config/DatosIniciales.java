package com.interapp.config;

import java.util.List;
import java.util.function.Supplier;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.interapp.model.Producto;
import com.interapp.model.Usuario;
import com.interapp.repository.ProductoRepository;
import com.interapp.repository.UsuarioRepository;

import net.datafaker.Faker;

// Llena la base solo cuando las tablas estan vacias
@Component
public class DatosIniciales implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatosIniciales.class);
    private static final int PRODUCTOS_POR_CATEGORIA = 5;

    // Iconos de la dependencia bootstrap-icons, servidos por Spring Boot
    private static final String RUTA_ICONOS = "/webjars/bootstrap-icons/1.13.2/icons/";

    private static final List<String> DESEOS = List.of("Bicicleta", "Consola de videojuegos", "Celular", "Televisor",
            "Portátil", "Audífonos", "Smartwatch", "Tablet", "Cámara", "Parlante");

    private static final List<String> CIUDADES = List.of("Medellín", "Bello", "Envigado", "Itagüí", "Sabaneta", "Bogotá",
            "Cali", "Barranquilla");

    private record CategoriaProducto(String nombre, String icono, Supplier<String> generador) {
    }

    private final UsuarioRepository usuarios;
    private final ProductoRepository productos;
    private final Faker faker = new Faker();

    // Datafaker genera el nombre de los productos de cada categoria
    private final List<CategoriaProducto> categorias = List.of(
            new CategoriaProducto("Celulares", "phone.svg", () -> faker.device().modelName()),
            new CategoriaProducto("Cámaras", "camera.svg", () -> faker.camera().brandWithModel()),
            new CategoriaProducto("Videojuegos", "controller.svg", () -> faker.videoGame().title()),
            new CategoriaProducto("Libros", "book.svg", () -> faker.book().title()),
            new CategoriaProducto("Instrumentos", "music-note-beamed.svg", () -> faker.music().instrument()),
            new CategoriaProducto("Electrodomésticos", "plug.svg", () -> faker.appliance().equipment()));

    public DatosIniciales(UsuarioRepository usuarios, ProductoRepository productos) {
        this.usuarios = usuarios;
        this.productos = productos;
    }

    @Override
    public void run(String... args) {
        if (usuarios.count() == 0) {
            crearUsuarios();
        }
        if (productos.count() == 0) {
            crearProductos();
        }
    }

    private void crearUsuarios() {
        usuarios.save(crearUsuario("Laura", "Gómez", "laura@interapp.com"));
        usuarios.save(crearUsuario("Carlos", "Ruiz", "carlos@interapp.com"));
        usuarios.save(crearUsuario("Ana", "Torres", "ana@interapp.com"));
        log.info("Usuarios de prueba creados");
    }

    private Usuario crearUsuario(String nombre, String apellido, String email) {
        return new Usuario(nombre, apellido, email, faker.numerify("3#########"), "12345",
                faker.options().nextElement(CIUDADES), null);
    }

    private void crearProductos() {
        List<Usuario> duenos = usuarios.findAll();
        int contador = 0;

        for (CategoriaProducto categoria : categorias) {
            List<String> nombres = Stream.generate(categoria.generador()).distinct().limit(PRODUCTOS_POR_CATEGORIA)
                    .toList();

            for (String nombre : nombres) {
                Usuario dueno = duenos.get(contador % duenos.size());
                String estado = contador % 2 == 0 ? "Disponible" : "Intercambio";
                productos.save(new Producto("IA-" + (contador + 1), nombre, categoria.nombre(),
                        categoria.nombre() + " en buen estado.", RUTA_ICONOS + categoria.icono(),
                        faker.options().nextElement(DESEOS), estado, dueno.getId()));
                contador++;
            }
        }
        log.info("{} productos creados", contador);
    }
}
