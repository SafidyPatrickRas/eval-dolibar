package com.sqlite.sqlite.controller;

import com.sqlite.sqlite.model.Job;
import com.sqlite.sqlite.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobService service;

    // Récupérer tous les jobs
    @GetMapping
    public List<Job> getAll() {
        return service.getAll();
    }

    // Récupérer un job par son id
    @GetMapping("/{id}")
    public Optional<Job> getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // Créer un nouveau job
    @PostMapping
    public Job create(@RequestBody Job job) {
        return service.save(job);
    }

    // Modifier un job
    @PutMapping("/{id}")
    public Job update(@PathVariable Long id, @RequestBody Job job) {
        return service.update(id, job);
    }

    // Supprimer un job
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}