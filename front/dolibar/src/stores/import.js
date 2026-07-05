// stores/import.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { useUserStore } from "./user";
import { usePaymentStore } from "./payment";
import JSZip from "jszip";
import { useSalaryStore } from "./salary";
import { useDocumentsStore } from "./documents";

export const useImportStore = defineStore("import", () => {
  const userStore = useUserStore();
  const paymentStore = usePaymentStore();
  const salaryStore = useSalaryStore();
  const documentsStore = useDocumentsStore();

  const file1 = ref(null);
  const file2 = ref(null);
  const file3 = ref(null);
  const importing = ref(false);

  const setFile1 = (file) => {
    file1.value = file;
  };
  const setFile2 = (file) => {
    file2.value = file;
  };
  const setFile3 = (file) => {
    file3.value = file;
  };

  const processFile1 = () => {
    console.log("Traitement fichier :", file1.value?.name);
    if (!file1.value) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const contenu = e.target.result;
          const lignes = contenu.split("\n");

          // On boucle sur toutes les lignes
          for (const [index, ligne] of lignes.entries()) {
            // Ignore l'entête
            if (index === 0) continue;

            if (ligne.trim() !== "") {
              const colonnes = ligne.split(",");

              const name = colonnes[1]?.trim();
              const genre = getGenre(colonnes[2]?.trim().toLowerCase());
              const identifiant = colonnes[3]?.trim();
              const mdp = colonnes[4]?.trim();
              const heure_travail_semaine = colonnes[5]?.trim();
              const job = colonnes[6]?.trim();

              const payload = {
                login: identifiant,
                password: mdp, // Dolibarr doit recevoir cette clé pour le hachage
                firstname: name,
                lastname: "lastname", // Peut être ajusté si présent dans le CSV
                statut: 1,
                admin: 0,
                employee: 1,
                gender: genre,
                thm: heure_travail_semaine,
                weeklyhours: heure_travail_semaine,
                job: job,
              };

              console.log(`Traitement ligne ${index}: ${identifiant}`);

              console.log("Payload user : ");
              console.log(payload);

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
          const lignes = contenu.split("\n");

          for (const [index, ligne] of lignes.entries()) {
            // 1. Ignorer l'entête et les lignes vides
            if (index === 0 || ligne.trim() === "") continue;

            const colonnes = ligne
              .split(csvRegex)
              .map((col) => col.replace(/^"|"$/g, "").trim());

            const ref_employe = Number(colonnes[1]) + 1;
            const date_debut = colonnes[2];
            const date_fin = colonnes[3];
            const montant = colonnes[4];
            const rawComplexCol = colonnes[5]
              ? colonnes[5].replace(/^"|"$/g, "").trim()
              : "";

            // 2. Traitement sécurisé de la colonne 5
            let details = [];

            // ... dans votre boucle for ...
            if (rawComplexCol && rawComplexCol.trim() !== "") {
              try {
                // 1. On nettoie : on enlève les accolades {}, les guillemets et on garde les crochets
                let clean = rawComplexCol.replace(/\{|\}|"|'/g, "");
                // Si on a [ "08/03/26" , 890 ], ça devient [08/03/26,890]

                // 2. On isole les groupes entre crochets
                const matches = clean.match(/\[([^\]]+)\]/g);

                if (matches) {
                  details = matches.map((group) => {
                    // 1. On enlève TOUT ce qui n'est pas un chiffre, une virgule, un slash ou un point.
                    // Cela supprime les { [ ] " } et les espaces.
                    // Résultat attendu : 08/03/26,890,5
                    let clean = group.replace(/[^0-9,/.]/g, "");

                    // 2. On sépare par la virgule
                    const parts = clean.split(",");

                    // La date est toujours la première partie
                    const dateStr = parts[0];

                    // 3. Traitement du montant :
                    // On récupère tout ce qui est après la date
                    const montantParts = parts.slice(1);

                    let montantFinal = "";
                    if (montantParts.length > 1) {
                      // S'il y a 890 et 5, on les joint avec un point pour faire 890.5
                      montantFinal = montantParts.join(".");
                    } else {
                      // S'il n'y a que 890, on garde 890
                      montantFinal = montantParts[0];
                    }

                    const montantNum = parseFloat(montantFinal);

                    return {
                      date: dateStr,
                      montant: isNaN(montantNum) ? 0 : montantNum,
                    };
                  });
                }
              } catch (err) {
                console.error(`Ligne ${index} : Erreur de parsing`, err);
              }
            }

            // 3. LOG et PAYLOAD en dehors du IF pour s'assurer qu'ils s'exécutent toujours
            console.log(`Ligne ${index} - Extraction réussie :`, {
              ref: ref_employe,
              debut: date_debut,
              fin: date_fin,
              montant: montant,
              details: details,
            });

            //salaryStore.saveSalary(
            //  fk_user.value,
            //  label.value,
            //  date_debut.value,
            //  date_fin.value,
            //  amount.value,
            //  note_private.value
            //);

            const id_last_salary = await salaryStore.saveSalary(
              ref_employe,
              "salaire",
              String(date_debut),
              String(date_fin),
              montant,
              "Salaire",
            ); // Décommentez quand vous êtes prêt
            // ... après l'enregistrement du salaire
            if (id_last_salary) {
              console.log(
                "Salaire enregistré (ID " +
                  id_last_salary +
                  "), lancement du paiement...",
              );

              // Utilisez 'of' pour parcourir le contenu et non les index
              for (const detail of details) {
                // detail est maintenant : { date: "08/03/26", montant: 480 }

                let dateToConvert = detail.date;
                const parts = dateToConvert.split("/");

                if (parts[2].length === 2) {
                  parts[2] = "20" + parts[2]; // transforme 26 en 2026
                  dateToConvert = parts.join("/"); // devient "08/03/2026"
                }

                // 2. On appelle votre fonction du store qui fait déjà tout le travail
                // (et qui gère l'UTC correctement)
                const timestampPaiement =
                  salaryStore.dateToTimestamp(dateToConvert);

                const paymentPayload = {
                  chid: id_last_salary,
                  // Convertir la date en timestamp si nécessaire
                  datepaye: timestampPaiement,
                  paiementtype: "LIQ",
                  label: "Paiement salaire " + id_last_salary,
                  amounts: {
                    [id_last_salary]: detail.montant,
                  },
                  fk_account: 2,
                  accountid: 2,
                  amount: detail.montant,
                };
                // AJOUT DU LOG ICI
                console.log(
                  `--- Préparation de l'envoi du paiement pour ID ${id_last_salary} ---`,
                );
                console.log(
                  "Payload du paiement :",
                  JSON.stringify(paymentPayload, null, 2),
                );

                await paymentStore.createPayement(
                  id_last_salary,
                  paymentPayload,
                );
                console.log(
                  "Paiement effectué pour le montant : " + detail.montant,
                );
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

  const processFile3 = async () => {
    console.log("Traitement ZIP :", file3.value?.name);
    if (!file3.value) return;

    const zip = new JSZip();
    const zipContent = await zip.loadAsync(file3.value);

    // On itère sur chaque fichier du ZIP
    for (const filename in zipContent.files) {
      const fileData = zipContent.files[filename];

      // Ignorer les dossiers ou les fichiers cachés (ex: __MACOSX)
      if (fileData.dir || filename.startsWith("__")) continue;

      // Extraire le nom de fichier sans extension pour avoir l'ID (ex: "1.png" -> "1")
      const userId = filename.split(".")[0];

      // Convertir le contenu du fichier en base64
      const base64Content = await fileData.async("base64");

      // Préparer le payload pour votre API
      const payload = {
        filename: filename,
        modulepart: "medias", // Selon votre documentation API
        ref: "", // L'ID ou la référence si nécessaire
        subdir: "image/users",
        filecontent: base64Content,
        fileencoding: "base64",
        overwriteifexists: "1",
      };

      console.log(`Envoi de l'image pour l'utilisateur ${userId}...`);

      // Appelez votre API ici (ajoutez une méthode dans userStore ou un service dédié)
      await documentsStore.save(payload);

      // Simulation d'appel :
      // await api.post('/ecm/add', payload);
    }
  };

  const getGenre = (genre) => {
    if (genre === "homme") {
      return "man";
    } else if (genre === "femme") {
      return "woman";
    } else {
      return "other";
    }
  };

  const importAll = async () => {
    importing.value = true;
    try {
      if (file1.value) await processFile1();
      if (file2.value) await processFile2();
      if (file3.value) await processFile3();
    } catch (e) {
      console.error(e);
    } finally {
      importing.value = false;
    }
  };

  return {
    file1,
    file2,
    file3,
    importing,
    setFile1,
    setFile2,
    setFile3,
    processFile1,
    processFile2,
    processFile3,
    importAll,
  };
});
