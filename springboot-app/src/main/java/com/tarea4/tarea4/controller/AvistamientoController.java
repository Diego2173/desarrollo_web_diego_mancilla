package com.tarea4.tarea4.controller;

import com.tarea4.tarea4.models.AvistamientoResultado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.tarea4.tarea4.repositories.AvistamientoRepository;

import java.util.List;

@RestController
@RequestMapping("/api/avistamientos")
public class AvistamientoController {

    @Autowired
    private AvistamientoRepository avistamientoRepository;

    @GetMapping("/search")
    public List<AvistamientoResultado> search(@RequestParam(defaultValue = "") String q) {
        String text = q.trim();

        if (text.isEmpty()) {
            return List.of();
        }
        return avistamientoRepository.search(escapeLike(text));
    }

    private static String escapeLike(String text) {
        return text.replace("!", "!!").replace("%", "!%").replace("_", "!_");
    }
}