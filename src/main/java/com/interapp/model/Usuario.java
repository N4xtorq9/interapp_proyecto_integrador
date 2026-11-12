package com.interapp.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columnas que ya existian en la tabla
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private String direccion;
    private String rol;
    private String estado;
    private LocalDateTime fechaRegistro;

    // Columnas nuevas de InterApp
    private String contrasena;
    private String ciudad;
    private String fotoUrl;

    public Usuario() {
    }

    public Usuario(String nombre, String apellido, String email, String telefono, String contrasena, String ciudad,
            String fotoUrl) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.telefono = telefono;
        this.contrasena = contrasena;
        this.ciudad = ciudad;
        this.fotoUrl = fotoUrl;
        this.rol = "usuario";
        this.estado = "activo";
        this.fechaRegistro = LocalDateTime.now();
    }

    public String getNombreCompleto() {
        return apellido == null ? nombre : nombre + " " + apellido;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public String getEmail() {
        return email;
    }

    public String getTelefono() {
        return telefono;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public String getCiudad() {
        return ciudad;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }
}
