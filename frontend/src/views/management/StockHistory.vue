<template>
  <div class="max-w-6xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Inventaire des stocks</h2>
    <div v-if="isLoading" class="mt-4">
      Chargement...
    </div>
    <div v-else class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full leading-normal">
        <thead>
        <tr>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Produit
          </th>
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
            {{ getProductName(adjustment.productId) }}
          </td>
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
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      adjustments: [],
      products: [],
      isLoading: false,
    };
  },
  methods: {
    fetchAdjustments() {
      this.isLoading = true;
      axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/stocks`, { withCredentials: true })
          .then(response => {
            this.adjustments = response.data;
            return axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/productss`, { withCredentials: true });
          })
          .then(response => {
            this.products = response.data;
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des ajustements de stock ou des produits:", error);
          })
          .finally(() => {
            this.isLoading = false;
          });
    },
    getProductName(productId) {
      const product = this.products.find(product => product.id === productId);
      return product ? product.name : 'Inconnu';
    }
  },
  created() {
    this.fetchAdjustments();
  }
};
</script>
