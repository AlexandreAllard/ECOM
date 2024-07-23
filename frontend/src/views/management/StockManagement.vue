<template>
  <div class="max-w-6xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Gestion du Stock</h2>
    <div class="grid grid-cols-2 gap-4">
      <div v-for="product in products" :key="product.id" class="bg-white shadow rounded-lg p-4 flex flex-col justify-between">
        <div>
          <h3 class="font-semibold text-lg">{{ product.name }}</h3>
          <p class="text-gray-600">Stock: {{ product.stock }}</p>
        </div>
        <div class="mt-4 flex justify-between">
          <button @click="openStockHistoryModal(product)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded">
            Voir historique
          </button>
          <button @click="openAdjustStockModal(product)" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded">
            Ajuster le stock
          </button>
        </div>
      </div>
    </div>
    <div v-if="isLoading" class="mt-4">
      Chargement...
    </div>

    <adjust-stock-modal
        v-if="selectedProduct"
        :product="selectedProduct"
        @close="closeAdjustStockModal"
        @save="saveStockAdjustment"
    />

    <stock-history-modal
        v-if="selectedProductForHistory"
        :product="selectedProductForHistory"
        @close="closeStockHistoryModal"
    />
  </div>
</template>

<script>
import axios from 'axios';
import AdjustStockModal from '../../components/AdjustStockModal2.vue';
import StockHistoryModal from '../../components/StockHistoryModal.vue';

export default {
  components: {
    AdjustStockModal,
    StockHistoryModal,
  },
  data() {
    return {
      products: [],
      isLoading: false,
      selectedProduct: null,
      selectedProductForHistory: null,
    };
  },
  methods: {
    fetchProducts() {
      this.isLoading = true;
      axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/productss`, {withCredentials: true})
          .then(response => {
            this.products = response.data;
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des produits:", error);
          })
          .finally(() => {
            this.isLoading = false;
          });
    },
    openStockHistoryModal(product) {
      this.selectedProductForHistory = product;
    },
    closeStockHistoryModal() {
      this.selectedProductForHistory = null;
    },
    openAdjustStockModal(product) {
      this.selectedProduct = product;
    },
    closeAdjustStockModal() {
      this.selectedProduct = null;
    },
    saveStockAdjustment(product, change, justification) {
      axios.post(`${import.meta.env.VITE_API_ENDPOINT}:3000/stocks/${product.id}`, {change, justification}, {withCredentials: true})
          .then(() => {
            product.stock += change;
            this.closeAdjustStockModal();
          })
          .catch(error => {
            console.error("Erreur lors de la mise à jour du stock:", error);
          });
    }
  },
  created() {
    this.fetchProducts();
  }
};
</script>
