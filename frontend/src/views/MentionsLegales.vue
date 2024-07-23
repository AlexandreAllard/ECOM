<template>
  <div class="container mx-auto p-6 md:max-w-3xl">
    <h1 class="text-3xl font-bold mb-6">Mentions légales</h1>
    <div v-html="mlContent" class="content bg-white p-6 rounded-lg shadow-md"></div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import axios from 'axios';

const mlContent = ref('');

const fetchMl = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/legals?documentType=LegalMention`);
    if (response.data.length > 0) {
      mlContent.value = response.data[0].content;
    } else {
      console.warn('Aucune Mentions Légales trouvées.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des Mentions légales :', error);
    alert('Erreur lors de la récupération des données.');
  }
};

onMounted(fetchMl);
</script>

<style scoped>
.content p {
  margin-bottom: 1rem;
}

.content strong {
  font-weight: bold;
}
</style>
