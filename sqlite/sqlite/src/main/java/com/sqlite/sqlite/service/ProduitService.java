package com.sqlite.sqlite.service;

import com.sqlite.sqlite.model.Produit;
import com.sqlite.sqlite.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProduitService {
    @Autowired
    private ProduitRepository repository;

    public List<Produit> getAll() { return repository.findAll(); }
    public Produit save(Produit produit) { return repository.save(produit); }
}