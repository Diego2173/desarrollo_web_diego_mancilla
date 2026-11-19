package com.tarea4.tarea4.models;

import jakarta.persistence.*;

@Entity
@Table(name = "ave")
public class Ave {

    @Id
    private Integer id;

    private String nombre;

    public Ave() {
    }

    public Integer getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }
}