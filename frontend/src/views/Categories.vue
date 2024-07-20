<template>
  <div class="max-w-7xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Catégories</h2>

    <div v-if="isLoading" class="mt-4">
      Chargement des catégories...
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="category in categories" :key="category.id" class="bg-white p-4 rounded shadow cursor-pointer">
        <img v-if="category.products && category.products.length > 0" :src="category.products[0].imageUrl" alt="" class="w-full h-48 object-cover mb-4">
        <h3 class="text-lg font-bold mb-2" @click="viewCategoryProducts(category.id)">{{ category.name }}</h3>
        <button @click="subscribeToCategory(category.id)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
          S'abonner
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      categories: [],
      isLoading: false
    };
  },
  methods: {
    async fetchCategories() {
      this.isLoading = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/categoriess`);
        const categories = response.data;

        const categoryPromises = categories.map(async (category) => {
          const productsResponse = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/productss?categoryId=${category.id}`);
          category.products = productsResponse.data;
          return category;
        });

        this.categories = await Promise.all(categoryPromises);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      } finally {
        this.isLoading = false;
      }
    },
    viewCategoryProducts(categoryId) {
      const url = `http://localhost:8080/productss?categoryId=${categoryId}`;
      window.location.href = url;
    },
    async subscribeToCategory(categoryId) {
      try {
        await axios.post(`${import.meta.env.VITE_API_ENDPOINT}:3000/subscriptions`, {
          targetId: categoryId,
          type: 'new_product'
        }, { withCredentials: true });
        alert('Vous êtes abonné à cette catégorie.');
      } catch (error) {
        console.error('Erreur lors de l\'abonnement à la catégorie:', error);
        alert('Erreur lors de l\'abonnement à la catégorie.');
      }
    }
  },
  async created() {
    await this.fetchCategories();
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
