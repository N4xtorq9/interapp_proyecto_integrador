package com.interapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.interapp.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByDuenoId(Long duenoId);

    // Si buscar o categoria llegan vacios, no filtran
    @Query("""
            select p from Producto p
            where lower(p.nombre) like lower(concat('%', :buscar, '%'))
            and (:categoria = '' or p.categoria = :categoria)
            order by p.id
            """)
    List<Producto> buscar(String buscar, String categoria);

    @Query("select distinct p.categoria from Producto p where p.categoria is not null order by p.categoria")
    List<String> listarCategorias();
}
