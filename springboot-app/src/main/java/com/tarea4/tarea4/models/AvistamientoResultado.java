package com.tarea4.tarea4.models;

import java.time.LocalDateTime;

public record AvistamientoResultado(
        Integer id,
        String voluntario,
        LocalDateTime fechaHora,
        String ave,
        String comuna) {
}