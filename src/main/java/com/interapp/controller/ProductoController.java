package com.interapp.controller;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.interapp.model.Usuario;
import com.interapp.repository.ProductoRepository;
import com.interapp.repository.UsuarioRepository;

@RestController
@RequestMapping("/api")
public class ProductoController {

    private final ProductoRepository productos;
    private final UsuarioRepository usuarios;

    public ProductoController(ProductoRepository productos, UsuarioRepository usuarios) {
        this.productos = productos;
        this.usuarios = usuarios;
    }

    // Lo que recibe el home por cada producto
    public record ProductoHome(Long id, String nombre, String categoria, String imagenUrl, String cambioPor,
            String estado, String dueno, String ciudad) {
    }

    @GetMapping("/productos")
    public List<ProductoHome> listar(@RequestParam(defaultValue = "") String buscar,
            @RequestParam(defaultValue = "") String categoria) {
        Map<Long, Usuario> duenos = usuarios.findAll().stream()
                .collect(Collectors.toMap(Usuario::getId, Function.identity()));

        return productos.buscar(buscar.trim(), categoria).stream()
                .map(producto -> {
                    Usuario dueno = duenos.get(producto.getDuenoId());
                    return new ProductoHome(producto.getId(), producto.getNombre(), producto.getCategoria(),
                            producto.getImagenUrl(), producto.getCambioPor(), producto.getEstado(),
                            dueno == null ? null : dueno.getNombreCompleto(),
                            dueno == null ? null : dueno.getCiudad());
                })
                .toList();
    }

    @GetMapping("/categorias")
    public List<String> categorias() {
        return productos.listarCategorias();
    }
}
