// stores/import.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore  } from './user'
import { usePaymentStore } from './payment'
import { useSalaryStore } from './salary'

export const useImportStore = defineStore('import', () => {
    const userStore = useUserStore()
    const paymentStore = usePaymentStore()
    const salaryStore = useSalaryStore()

    const file1 = ref(null)
    const file2 = ref(null)
    const file3 = ref(null)
    const importing = ref(false)

    const setFile1 = (file) => { file1.value = file }
    const setFile2 = (file) => { file2.value = file }
    const setFile3 = (file) => { file3.value = file }

  const processFile1 = () => {
  console.log("Traitement fichier :", file1.value?.name);
  if (!file1.value) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const contenu = e.target.result;
        const lignes = contenu.split('\n');

        // On boucle sur toutes les lignes
        for (const [index, ligne] of lignes.entries()) {
          // Ignore l'entête
          if (index === 0) continue;
          
          if (ligne.trim() !== '') {
            const colonnes = ligne.split(',');

            const name = colonnes[1]?.trim();
            const genre = getGenre(colonnes[2]?.trim().toLowerCase());
            const identifiant = colonnes[3]?.trim();
            const mdp = colonnes[4]?.trim();
            const heure_travail_semaine = colonnes[5]?.trim();

            const payload = {
                "login": identifiant,
                "password": mdp, // Dolibarr doit recevoir cette clé pour le hachage
                "firstname": name,
                "lastname": "lastname", // Peut être ajusté si présent dans le CSV
                "statut": 1,
                "admin": 0,
                "employee": 1,
                "gender": genre,
                "thm": heure_travail_semaine
            };

            console.log(`Traitement ligne ${index}: ${identifiant}`);
            
            // On attend la fin de la création avant de passer à la ligne suivante
            // Cela évite de saturer l'API et garantit l'ordre
            await userStore.saveUser(payload);
          }
        }
        
        console.log("Tous les utilisateurs ont été traités.");
        resolve(); // Résolution unique après la boucle
        
      } catch (error) {
        console.error("Erreur lors du traitement du fichier :", error);
        reject(error);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsText(file1.value);
  });
};


  const processFile2 = () => {
  console.log("Traitement fichier :", file2.value?.name);
  if (!file2.value) return Promise.resolve();

  const csvRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const contenu = e.target.result;
        const lignes = contenu.split('\n');

        for (const [index, ligne] of lignes.entries()) {
          // 1. Ignorer l'entête et les lignes vides
          if (index === 0 || ligne.trim() === '') continue;
          
          const colonnes = ligne.split(csvRegex).map(col => col.replace(/^"|"$/g, '').trim());

          const ref_employe = colonnes[1];
          const date_debut = colonnes[2];
          const date_fin = colonnes[3];
          const montant = colonnes[4];
          const rawComplexCol = colonnes[5] ? colonnes[5].replace(/^"|"$/g, '').trim() : '';

          // 2. Traitement sécurisé de la colonne 5
          let details = [];

          if (rawComplexCol && rawComplexCol.trim() !== '') {
            try {
              // 1. On nettoie tout ce qui n'est pas utile : accolades, espaces, guillemets
              // On garde uniquement les crochets, virgules, chiffres, slashs et points
              let clean = rawComplexCol.replace(/\{|\}|"|'/g, ''); 
              // Résultat intermédiaire : [08/03/26,480],[08/03/26,300]

              // 2. On isole les groupes entre crochets [ ... ]
              const matches = clean.match(/\[([^\]]+)\]/g); 

              if (matches) {
                details = matches.map(group => {
                  // On enlève les crochets et on split par la virgule
                  const parts = group.replace(/[\[\]]/g, '').split(',');
                  return {
                    date: parts[0].trim(),
                    montant: parseFloat(parts[1].replace(',', '.')) // Gère les décimales
                  };
                });

                console.log("Succès, données parsées :", details);
              }
            } catch (err) {
              console.error(`Ligne ${index} : Erreur de parsing manuel`, err);
            }
          }

          // 3. LOG et PAYLOAD en dehors du IF pour s'assurer qu'ils s'exécutent toujours
          console.log(`Ligne ${index} - Extraction réussie :`, {
            ref: ref_employe,
            debut: date_debut,
            fin: date_fin,
            montant: montant,
            details: details
          });

          //salaryStore.saveSalary(
          //  fk_user.value,
          //  label.value,
          //  date_debut.value,
          //  date_fin.value,
          //  amount.value,
          //  note_private.value
          //);

          const id_last_salary =  await salaryStore.saveSalary(ref_employe , "salaire" , String(date_debut) , String(date_fin) , montant , "Salaire" ); // Décommentez quand vous êtes prêt
          // ... après l'enregistrement du salaire
if (id_last_salary) {
    console.log("Salaire enregistré (ID " + id_last_salary + "), lancement du paiement...");
    
    // Utilisez 'of' pour parcourir le contenu et non les index
    for (const detail of details) { 
        // detail est maintenant : { date: "08/03/26", montant: 480 }
        
        const paymentPayload = {
            "chid": id_last_salary,
            // Convertir la date en timestamp si nécessaire
            "datepaye": Math.floor(new Date(detail.date).getTime() / 1000), 
            "paiementtype": "LIQ",
            "label": "Paiement salaire " + id_last_salary,
            "amounts": {
                [id_last_salary]: detail.montant
            },
            "fk_account": 2,
            "accountid": 2,
            "amount": detail.montant
        };
        // AJOUT DU LOG ICI
        console.log(`--- Préparation de l'envoi du paiement pour ID ${id_last_salary} ---`);
        console.log("Payload du paiement :", JSON.stringify(paymentPayload, null, 2));

        await paymentStore.createPayement(id_last_salary, paymentPayload);
        console.log("Paiement effectué pour le montant : " + detail.montant);
    }
}

        }
        
        console.log("Tous les salaires ont été traités.");
        resolve();
        
      } catch (error) {
        console.error("Erreur lors du traitement du fichier :", error);
        reject(error);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsText(file2.value);
  });
};

  const getGenre = (genre)=>{
     if (genre === "homme") {
        return "man";
    } else if (genre === "femme") {
        return "woman";
    } else {
        return "other";
    }
  }

  const importAll = async () => {
    importing.value = true
    try {
      if (file1.value) await processFile1()
      if (file2.value) await processFile2() // Appelle notre fonction de nettoyage
      //if (file3.value) await processFile3()
    } catch (e) {
      console.error(e)
    } finally {
      importing.value = false
    }
  }

  return {
    file1, file2, file3, importing,
    setFile1, setFile2, setFile3,
    processFile1 ,importAll
  }
})