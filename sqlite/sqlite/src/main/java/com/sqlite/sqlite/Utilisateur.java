package com.sqlite.sqlite;

import jakarta.persistence.*;

@Entity
public class Utilisateur {
    @Id
    // Remplacez IDENTITY par AUTO
    @GeneratedValue(strategy = GenerationType.AUTO) 
    private Long id;
    
    private String nom;

    // Getters et Setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
}