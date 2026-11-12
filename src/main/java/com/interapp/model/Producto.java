package com.interapp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columnas que ya existian en la tabla (precio y stock no se usan en trueque)
    private String codigo;
    private String nombre;
    private String categoria;

    // Columnas nuevas de InterApp
    @Column(length = 500)
    private String descripcion;
    private String imagenUrl;
    private String cambioPor;
    private String estado;
    private Long duenoId;

    public Producto() {
    }

    public Producto(String codigo, String nombre, String categoria, String descripcion, String imagenUrl,
            String cambioPor, String estado, Long duenoId) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.imagenUrl = imagenUrl;
        this.cambioPor = cambioPor;
        this.estado = estado;
        this.duenoId = duenoId;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getCategoria() {
        return categoria;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public String getCambioPor() {
        return cambioPor;
    }

    public String getEstado() {
        return estado;
    }

    public Long getDuenoId() {
        return duenoId;
    }
}
