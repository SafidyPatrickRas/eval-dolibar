#!/usr/bin/env bash
# reset_all.sh

# Définition du mot de passe en dur (ou via variable d'environnement sécurisée)
export MYSQL_PWD=""

# Exécution forcée des deux scripts avec l'argument --yes
./dolibar.sh
./sqlite.sh --yes

echo "Tous les resets ont été effectués avec succès."