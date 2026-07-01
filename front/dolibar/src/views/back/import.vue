<template>
    <div>
        <h1>Import de donnnee</h1>
        <div style="margin-bottom: 8px">
            <label for="file1">Fichier 1 (Users) : </label>
            <input id="file1" type="file" accept=".csv,text/csv" @change="onFile1Change" />
            <div v-if="store.file1">Fichier sélectionné: {{ store.file1.name }}</div>
        </div>
        <div style="margin-bottom: 8px">
            <label for="file2">Fichier 2 (Salaire / payement) : </label>
            <input id="file2" type="file" accept=".csv,text/csv" @change="onFile2Change" />
            <div v-if="store.file2">Fichier sélectionné: {{ store.file2.name }}</div>
        </div>
        <button :disabled="store.importing" @click="store.importAll">
            {{ store.importing ? "Importation en cours..." : "Importer" }}
        </button>

    </div>
</template>~        
<script setup>

import { useImportStore } from "@/stores";
const store = useImportStore();

const onFile1Change = (event) => {
    if (event.target.files[0]) store.setFile1(event.target.files[0]);
};

const onFile2Change = (event) => {
    if (event.target.files[0]) store.setFile2(event.target.files[0]);
};

const onFile3Change = (event) => {
    if (event.target.files[0]) store.setFile3(event.target.files[0]);
};

</script>