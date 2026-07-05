package com.sqlite.sqlite.controller;

import com.sqlite.sqlite.model.Holiday;
import com.sqlite.sqlite.service.HolidayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/holidays")
@CrossOrigin(origins = "*")
public class HolidayController {

    @Autowired
    private HolidayService service;

    // Récupérer tous les jours fériés
    @GetMapping
    public List<Holiday> getAll() {
        return service.getAll();
    }

    // Récupérer un jour férié par son id
    @GetMapping("/{id}")
    public Optional<Holiday> getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // Créer un jour férié
    @PostMapping
    public Holiday create(@RequestBody Holiday holiday) {
        return service.save(holiday);
    }

    // Modifier un jour férié
    @PutMapping("/{id}")
    public Holiday update(@PathVariable Long id, @RequestBody Holiday holiday) {
        return service.update(id, holiday);
    }

    // Supprimer un jour férié
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}