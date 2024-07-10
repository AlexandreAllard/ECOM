<template>
  <AdminSidebar/>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Historique Global des Ajustements de Stock</h1>
    <div v-for="adjustment in adjustments" :key="adjustment.id" class="mb-4 p-4 bg-white rounded shadow">
      <p class="text-sm font-medium text-gray-700">
        Date: <span class="text-gray-600">{{ adjustment.date }}</span>
      </p>
      <p class="text-sm font-medium text-gray-700">
        Produit: <span class="text-gray-600">{{ adjustment.productName }}</span>
      </p>
      <p class="text-sm font-medium text-gray-700">
        Modification:
        <span :class="{'text-green-500': adjustment.change > 0, 'text-red-500': adjustment.change < 0}">
          {{ adjustment.change > 0 ? 'Ajouté' : 'Retiré' }} {{ Math.abs(adjustment.change) }}
        </span>
      </p>
      <p class="text-sm font-medium text-gray-700">
        Justification: <span class="text-gray-600">{{ adjustment.justification }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AdminSidebar from "../../components/AdminSidebar.vue";

export default {
  components: {AdminSidebar},
  data() {
    return {
      adjustments: []
    };
  },
  created() {
    this.fetchGlobalAdjustments();
  },
  methods: {
    async fetchGlobalAdjustments() {
      try {
        const response = await axios.get('http://localhost:3000/products/stock-adjustments', {withCredentials: true});
        this.adjustments = response.data.map(adj => ({
          ...adj,
          productName: adj.product.name
        }));
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique global des ajustements:", error);
      }
    }
  }
}
</script>
