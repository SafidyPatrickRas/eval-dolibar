package com.sqlite.sqlite;

import org.hibernate.dialect.Dialect;

public class SQLiteDialect extends Dialect {
    public SQLiteDialect() {
        super();
    }
    // Hibernate 6+ n'a plus besoin de méthodes spécifiques ici,
    // l'héritage de Dialect suffit pour la reconnaissance.
}