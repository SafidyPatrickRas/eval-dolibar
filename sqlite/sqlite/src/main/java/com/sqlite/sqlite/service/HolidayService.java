package com.sqlite.sqlite.service;

import com.sqlite.sqlite.model.Holiday;
import com.sqlite.sqlite.repository.HolidayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HolidayService {

    @Autowired
    private HolidayRepository repository;

    // Récupérer tous les jours fériés
    public List<Holiday> getAll() {
        return repository.findAll();
    }

    // Récupérer un jour férié par son id
    public Optional<Holiday> getById(Long id) {
        return repository.findById(id);
    }

    // Créer un jour férié
    public Holiday save(Holiday holiday) {
        return repository.save(holiday);
    }

    // Modifier un jour férié
    public Holiday update(Long id, Holiday holidayDetails) {
        Holiday holiday = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jour férié non trouvé avec l'id : " + id));

        holiday.setName(holidayDetails.getName());
        holiday.setDate(holidayDetails.getDate());
        holiday.setDescription(holidayDetails.getDescription());

        return repository.save(holiday);
    }

    // Supprimer un jour férié
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Jour férié non trouvé avec l'id : " + id);
        }

        repository.deleteById(id);
    }
}