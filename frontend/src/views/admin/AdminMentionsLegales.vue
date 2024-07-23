<template>
  <div class="container mx-auto p-6 md:max-w-8xl">
    <h1 class="text-3xl font-bold mb-6">Éditer les mentions légales</h1>
    <div class="bg-black text-white p-4 rounded-t-lg">
      <p>Afin de modifier le document, merci d'utiliser le <a href="https://www.markdownguide.org/">MarkDown</a></p>
    </div>
    <div class="bg-white p-6 rounded-b-lg shadow-md">
      <TextEditor :initialContent="documentContent" :documentType="documentType" :documentId="documentId"/>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import axios from 'axios';
import TextEditor from '../../components/TextEditor.vue';

const props = defineProps({
  documentType: {
    type: String,
    required: true,
    default: 'LegalMention'
  }
});

const documentContent = ref('');
const documentId = ref('');

const fetchDocument = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/legals?documentType=${props.documentType}`);
    if (response.data.length > 0) {
      documentContent.value = response.data[0].content;
      documentId.value = response.data[0].id;
    } else {
      console.warn('Aucun document trouvé pour ce type.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du document :', error);
    alert('Erreur lors de la récupération des données.');
  }
};

onMounted(fetchDocument);
</script>
