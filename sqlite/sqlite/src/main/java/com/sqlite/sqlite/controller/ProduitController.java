package com.sqlite.sqlite.controller;

import com.sqlite.sqlite.model.Produit;
import com.sqlite.sqlite.service.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/produits")
public class ProduitController {
    @Autowired
    private ProduitService service;

    @GetMapping
    public List<Produit> getAll() { return service.getAll(); }

    @PostMapping
    public Produit create(@RequestBody Produit produit) { return service.save(produit); }
}