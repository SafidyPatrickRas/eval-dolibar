package com.sqlite.sqlite;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class SqliteApplicationTests {

    @Autowired
    private UtilisateurRepository repository;

    @Test
    void contextLoads() {
        // Test de création dans la DB
        Utilisateur user = new Utilisateur();
        user.setNom("TestSQLite");
        repository.save(user);

        // Vérification que l'utilisateur a été enregistré
        assertThat(repository.count()).isGreaterThan(0);
        System.out.println("Test réussi : La base SQLite a été créée et l'enregistrement fonctionne !");
    }
}