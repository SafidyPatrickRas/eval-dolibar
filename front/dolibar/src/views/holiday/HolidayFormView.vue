<template>
    <div>
        <h1 v-if="id_holly">Update holly day</h1>
        <h1 v-else>Creat Holly day </h1>
        <div>
            <div>
                <label for="name">name : </label>
                <input type="text" name="" id="" v-model="name">
            </div>
            <div>
                <label for="date">date : </label>
                <input type="date" name="" id="" v-model="date">
            </div>
            <div>
                <label for="description">description : </label>
                <textarea name="" id="" cols="30" rows="10" v-model="description"></textarea>
            </div>
            <button @click="saveHollyDay">Enregistre</button>
        </div>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import { useHolidayStore } from '@/stores';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

const holidayStore = useHolidayStore()

const name = ref("")
const date = ref()
const description = ref("")

const id_holly = ref(null)
const holly = ref(null)

const saveHollyDay = async ()=>{
    await holidayStore.save(id_holly.value , name.value , date.value , description.value)
}

const route = useRoute();

watch(holly , ()=>{
    console.log(holly.value)
})

onMounted(async () => {

    
  id_holly.value = route.query.id;

  if(id_holly.value){
    holly.value = await holidayStore.fetchHolidayById(id_holly.value)
    name.value = holly.value.name
    date.value = holly.value.date
    description.value = holly.value.description
  }
  console.log("L'ID reçu via l'URL est :", route.query.id);
});
</script>