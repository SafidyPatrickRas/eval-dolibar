#!/bin/bash

# Définition des variables
PROJECT_DIR="/home/safidy/Documents/fianarana/S6/eval-dolibar/sqlite/sqlite"
DB_FILE="$PROJECT_DIR/mon_projet.db"
PORT=8081

echo "--- Préparation du redémarrage ---"

# 1. Tuer le processus qui utilise le port 8081 s'il existe
PID=$(lsof -t -i:$PORT)
if [ -n "$PID" ]; then
    echo "L'application tourne déjà (PID: $PID). Fermeture en cours..."
    kill -9 $PID
    sleep 2 # Petit délai pour laisser le port se libérer
else
    echo "Aucune instance trouvée sur le port $PORT."
fi

# 2. Aller dans le dossier du projet
cd "$PROJECT_DIR" || exit

# 3. Supprimer le fichier .db s'il existe
if [ -f "$DB_FILE" ]; then
    echo "Suppression de la base de données : $DB_FILE"
    rm "$DB_FILE"
fi

# 4. Lancer l'application
echo "Démarrage de l'application..."
./mvnw spring-boot:run