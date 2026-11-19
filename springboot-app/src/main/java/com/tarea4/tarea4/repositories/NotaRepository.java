package com.tarea4.tarea4.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.tarea4.tarea4.models.Nota;

public interface NotaRepository extends CrudRepository<Nota, Integer> {

    @Query("select avg(n.nota) from Nota n where n.avistamiento.id = :id")
    Double promedio(@Param("id") Integer id);
}