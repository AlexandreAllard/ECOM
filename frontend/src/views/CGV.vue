<template>
  <div class="container mx-auto p-6 md:max-w-3xl">
    <h1 class="text-3xl font-bold mb-6">Conditions Générales de Vente (CGV)</h1>
    <div v-html="cgvContent" class="content bg-white p-6 rounded-lg shadow-md"></div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import axios from 'axios';

const cgvContent = ref('');

const fetchCgv = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/legals?documentType=CGV`);
    if (response.data.length > 0) {
      cgvContent.value = response.data[0].content;
    } else {
      console.warn('Aucune CGV trouvée.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des CGV :', error);
    alert('Erreur lors de la récupération des données.');
  }
};

onMounted(fetchCgv);
</script>

<style scoped>
.content p {
  margin-bottom: 1rem;
}

.content strong {
  font-weight: bold;
}
</style>
