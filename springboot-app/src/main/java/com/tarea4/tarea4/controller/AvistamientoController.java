package com.tarea4.tarea4.controller;

import com.tarea4.tarea4.models.AvistamientoResultado;
import com.tarea4.tarea4.models.Avistamiento;
import com.tarea4.tarea4.models.Nota;
import com.tarea4.tarea4.repositories.NotaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.tarea4.tarea4.repositories.AvistamientoRepository;

import java.util.List;

@RestController
@RequestMapping("/api/avistamientos")
public class AvistamientoController {

    @Autowired
    private AvistamientoRepository avistamientoRepository;

    @Autowired
    private NotaRepository notaRepository;

    @GetMapping("/search")
    public List<AvistamientoResultado> search(@RequestParam(defaultValue = "") String q) {
        String text = q.trim();

        if (text.isEmpty()) {
            return List.of();
        }
        return avistamientoRepository.search(escapeLike(text));
    }

    @PostMapping("/{id}/nota")
    public Double evaluar(@PathVariable Integer id, @RequestParam String nota) {
        if (!nota.trim().matches("[1-7]")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La nota debe estar entre 1 y 7 y ser entera");
        }
        Avistamiento avistamiento = avistamientoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Avistamiento no encontrado"));

        notaRepository.save(new Nota(avistamiento, Integer.parseInt(nota.trim())));
        return notaRepository.promedio(id);
    }

    private static String escapeLike(String text) {
        return text.replace("!", "!!").replace("%", "!%").replace("_", "!_");
    }
}