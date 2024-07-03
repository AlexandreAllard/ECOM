<template>
  <div class="max-w-2xl mx-auto py-6">
    <h1 class="text-2xl font-bold text-center mb-6">Produits</h1>
    <div class="mb-4">
      <select v-model="selectedCategory" class="block w-full p-2 border border-gray-300 rounded">
        <option value="">Toutes les catégories</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>
    <ul class="space-y-4">
      <li v-for="product in filteredProducts" :key="product.id" class="p-4 border border-gray-200 rounded shadow">
        <div class="flex justify-between items-center">
          <div>
            <router-link :to="'/product/' + product.id" class="text-blue-500 hover:text-blue-700">
              {{ product.name }}
            </router-link>
            - ${{ product.price }}
          </div>
          <div class="flex items-center">
            <input type="number" v-model.number="product.quantity" min="1" class="w-16 p-1 border border-gray-300 rounded mr-2" />
            <button @click="addToCart(product.id, product.quantity || 1)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Ajouter au panier
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {ref, computed, onMounted, watch} from 'vue';
import axios from 'axios';
import {useRouter, useRoute} from 'vue-router';

export default {
  setup() {
    const products = ref([]);
    const categories = ref([]);
    const selectedCategory = ref('');
    const router = useRouter();
    const route = useRoute();

    const filteredProducts = computed(() => {
      return selectedCategory.value
          ? products.value.filter(product => product.categoryId === selectedCategory.value)
          : products.value;
    });

    async function fetchProducts() {
      const params = selectedCategory.value ? {categoryId: selectedCategory.value} : {};
      try {
        const response = await axios.get('http://localhost:3000/products', {
          withCredentials: true,
          params
        });
        products.value = response.data.map(product => ({
          ...product,
          quantity: 1
        }));
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
      }
    }

    async function initData() {
      selectedCategory.value = route.query.categoryId || '';
      try {
        const response = await axios.get('http://localhost:3000/categories', {withCredentials: true});
        categories.value = response.data;
        await fetchProducts();
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    }

    async function addToCart(productId, quantity) {
      try {
        const response = await axios.post('http://localhost:3000/cart/add', {
          productId,
          quantity
        }, {withCredentials: true});
        alert("Produit ajouté au panier!");
      } catch (error) {
        console.error("Erreur lors de l'ajout au panier:", error);
        alert("Erreur lors de l'ajout au panier");
      }
    }

    onMounted(initData);

    return { products, categories, selectedCategory, filteredProducts, addToCart };
  }
};
</script>
