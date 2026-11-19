package com.tarea4.tarea4.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.tarea4.tarea4.models.Avistamiento;
import com.tarea4.tarea4.models.AvistamientoResultado;

public interface AvistamientoRepository extends CrudRepository<Avistamiento, Integer> {

    @Query("""
select new com.tarea4.tarea4.models.AvistamientoResultado(
a.id, v.nombre, a.fechaHora, av.nombre, c.nombre, avg(n.nota))
from Avistamiento a
join a.ave av
join a.voluntario v
join Comuna c on a.lugar like concat('%, ', c.nombre, ', %')
left join Nota n on n.avistamiento = a
where lower(av.nombre) like lower(concat('%', :q, '%')) escape '!'
    or lower(v.nombre)  like lower(concat('%', :q, '%')) escape '!'
    or lower(c.nombre)  like lower(concat('%', :q, '%')) escape '!'
group by a.id, v.nombre, a.fechaHora, av.nombre, c.nombre
order by a.fechaHora desc, a.id desc
""")
    List<AvistamientoResultado> search(@Param("q") String q);
}