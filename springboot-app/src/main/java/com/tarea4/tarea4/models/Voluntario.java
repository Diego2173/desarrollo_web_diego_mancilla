package com.tarea4.tarea4.models;

import jakarta.persistence.*;

@Entity
@Table(name = "voluntario")
public class Voluntario {

    @Id
    private Integer id;

    private String nombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comuna_id")
    private Comuna comuna;

    public Voluntario() {
    }

    public Integer getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public Comuna getComuna() {
        return comuna;
    }
}