#!/bin/bash

# Chemin vers l'exécutable mysql
MYSQL_PATH="/opt/lampp/bin/mysql"

echo "Nettoyage de la base dolibarr..."

# 1. Suppression des paiements des salaires
$MYSQL_PATH -u root -D dolibarr -e "DELETE FROM llx_payment_salary;"

# 2. Suppression des salaires
$MYSQL_PATH -u root -D dolibarr -e "DELETE FROM llx_salary;"

# 3. Suppression des utilisateurs (sauf l'ID 1)
$MYSQL_PATH -u root -D dolibarr -e "DELETE FROM llx_user WHERE rowid > 1;"

# Optionnel : réinitialiser l'auto-incrément pour repartir de l'ID 2
$MYSQL_PATH -u root -D dolibarr -e "ALTER TABLE llx_user AUTO_INCREMENT = 2;"
$MYSQL_PATH -u root -D dolibarr -e "ALTER TABLE llx_salary AUTO_INCREMENT = 1;"

echo "Nettoyage complet effectué."