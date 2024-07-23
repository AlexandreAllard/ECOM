<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div class="modal-content bg-white p-5 rounded-lg shadow-lg max-w-md w-full">
      <h3 class="font-bold text-lg mb-4 text-center">Historique des ajustements pour {{ product.name }}</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li v-for="adjustment in adjustments" :key="adjustment.id" class="text-gray-800">
          <span :class="adjustment.change > 0 ? 'text-green-500' : adjustment.change < 0 ? 'text-red-500' : ''">
  {{adjustment.change > 0 ? 'Ajout' : adjustment.change < 0 ? 'Retrait' : 'Aucun changement' }} ({{ Math.abs(adjustment.change) }})
          </span>
          <span class="text-gray-600"> Justification: {{ adjustment.justification || 'Non spécifiée' }}</span>
        </li>
      </ul>
      <div class="mt-5 flex justify-end">
        <button @click="$emit('close')"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    product: Object
  },
  data() {
    return {
      adjustments: []
    };
  },
  filters: {
    formatDate(value) {
      const date = new Date(value);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
  },
  created() {
    this.fetchAdjustments();
  },
  methods: {
    async fetchAdjustments() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/stocks/product/${this.product.id}`, {withCredentials: true});
        this.adjustments = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des ajustements de stock:", error);
      }
    }
  }
}
</script>

<style scoped>
li{
  list-style-type: none;
}
</style>
