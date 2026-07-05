package com.sqlite.sqlite.service;

import com.sqlite.sqlite.model.Job;
import com.sqlite.sqlite.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    @Autowired
    private JobRepository repository;

    // Récupérer tous les jobs
    public List<Job> getAll() {
        return repository.findAll();
    }

    // Récupérer un job par son id
    public Optional<Job> getById(Long id) {
        return repository.findById(id);
    }

    // Créer un nouveau job
    public Job save(Job job) {
        return repository.save(job);
    }

    // Mettre à jour un job
    public Job update(Long id, Job jobDetails) {
        Job job = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job non trouvé avec l'id : " + id));

        job.setCode(jobDetails.getCode());
        job.setLabel(jobDetails.getLabel());

        return repository.save(job);
    }

    // Supprimer un job
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Job non trouvé avec l'id : " + id);
        }

        repository.deleteById(id);
    }
}