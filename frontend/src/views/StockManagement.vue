<template>
  <div class="stock-management max-w-4xl mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6 text-center">Gestion du Stock</h1>
    <div v-for="product in products" :key="product.id" class="product-entry bg-white p-5 rounded-lg shadow mb-4">
      <h3 class="text-lg font-semibold">{{ product.name }}</h3>
      <p class="text-gray-700 mb-3">Stock actuel: <span class="font-semibold">{{ product.stock }}</span></p>
      <div class="flex items-center">
        <button @click="openAdjustStockModal(product)"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
          Ajuster le Stock
        </button>
        <button @click="openStockHistoryModal(product)"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Voir Historique
        </button>
      </div>
    </div>
    <adjust-stock-modal v-if="showAdjustStockModal" :product="selectedProduct" @close="closeAllModals" @stock-adjusted="handleStockAdjusted"/>
    <stock-history-modal v-if="showStockHistoryModal" :product="selectedProduct" @close="closeAllModals"/>
  </div>
</template>

<script>
import axios from 'axios';
import AdjustStockModal from '../components/AdjustStockModal.vue';
import StockHistoryModal from '../components/StockHistoryModal.vue';

export default {
  components: {
    AdjustStockModal,
    StockHistoryModal
  },
  data() {
    return {
      products: [],
      categories: [],
      showAdjustStockModal: false,
      showStockHistoryModal: false,
      selectedProduct: null,
    };
  },
  methods: {
    fetchCategories() {
      axios.get('http://localhost:3000/categories', {withCredentials: true})
          .then(response => {
            this.categories = response.data;
            this.fetchProducts();
          })
          .catch(error => {
            console.error('Error fetching categories:', error);
          });
    },
    fetchProducts() {
      axios.get('http://localhost:3000/products', {withCredentials: true})
          .then(response => {
            this.products = response.data.map(product => ({
              ...product,
              categoryName: this.categories.find(c => c.id === product.categoryId)?.name || 'Aucune catégorie'
            }));
          })
          .catch(error => {
            console.error('Error fetching products:', error);
          });
    },
    openAdjustStockModal(product) {
      this.selectedProduct = product;
      this.showAdjustStockModal = true;
    },
    openStockHistoryModal(product) {
      this.selectedProduct = product;
      this.showStockHistoryModal = true;
    },
    closeAllModals() {
      this.showAdjustStockModal = false;
      this.showStockHistoryModal = false;
    },
    handleStockAdjusted({productId, adjustment}) {
      const productIndex = this.products.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        this.products[productIndex].stock += adjustment;
        this.products = [...this.products];
      }
    }
  },
  mounted() {
    this.fetchCategories();
  }
}
</script>
