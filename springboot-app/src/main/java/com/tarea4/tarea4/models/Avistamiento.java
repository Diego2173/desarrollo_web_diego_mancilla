package com.tarea4.tarea4.models;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "avistamiento")
public class Avistamiento {

    @Id
    private Integer id;

    private LocalDateTime fechaHora;

    @ManyToOne
    @JoinColumn(name = "ave_id")
    private Ave ave;

    @ManyToOne
    @JoinColumn(name = "voluntario_id")
    private Voluntario voluntario;

    public Avistamiento() {
    }

    public Integer getId() {
        return id;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public Ave getAve() {
        return ave;
    }

    public Voluntario getVoluntario() {
        return voluntario;
    }
}