<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
      <h2 class="text-xl font-semibold mb-4">Historique des ajustements de {{ product.name }}</h2>
      <div v-if="isLoading" class="mb-4">
        Chargement...
      </div>
      <div v-else>
        <table class="min-w-full leading-normal">
          <thead>
          <tr>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Date
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Ajustement
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Justification
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="adjustment in adjustments" :key="adjustment.id">
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {{ new Date(adjustment.createdAt).toLocaleString() }}
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {{ adjustment.change }}
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {{ adjustment.justification }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-end mt-4">
        <button @click="$emit('close')" class="bg-gray-500 text-white hover:bg-gray-700 px-4 py-2 rounded-md">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      adjustments: [],
      isLoading: false,
    };
  },
  methods: {
    fetchAdjustments() {
      this.isLoading = true;
      axios.get(`http://localhost:3000/stocks/product/${this.product.id}`, { withCredentials: true })
          .then(response => {
            this.adjustments = response.data;
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des ajustements de stock:", error);
          })
          .finally(() => {
            this.isLoading = false;
          });
    }
  },
  created() {
    this.fetchAdjustments();
  }
};
</script>
