<template>
  <div class="max-w-2xl mx-auto py-6">
    <h1 class="text-2xl font-bold text-center mb-6">Produits</h1>
    <div class="mb-4 flex justify-between">
      <select v-model="selectedCategory" @change="updateFilters"
              class="block w-full p-2 border border-gray-300 rounded mr-2">
        <option value="">Toutes les catégories</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
      <input type="text" v-model="selectedProductName" @input="updateFilters" placeholder="Nom du produit"
             class="block w-full p-2 border border-gray-300 rounded mr-2">
      <input type="text" v-model="selectedBrand" @input="updateFilters" placeholder="Marque"
             class="block w-full p-2 border border-gray-300 rounded mr-2">
      <input type="number" v-model.number="minPrice" @input="updateFilters" placeholder="Prix min"
             class="block w-full p-2 border border-gray-300 rounded mr-2">
      <input type="number" v-model.number="maxPrice" @input="updateFilters" placeholder="Prix max"
             class="block w-full p-2 border border-gray-300 rounded">
      <select v-model="inStockFilter" @change="updateFilters" class="block w-full p-2 border border-gray-300 rounded">
        <option value="">Tous les produits</option>
        <option value="true">En stock</option>
        <option value="false">Hors stock</option>
      </select>
    </div>
    <ul class="space-y-4">
      <li v-for="product in filteredProducts" :key="product.id"
          v-show="matchesProductName(product.name) && matchesBrand(product.brand) && matchesInStock(product.stock)"
          class="p-4 border border-gray-200 rounded shadow">
        <div class="flex justify-between items-center">
          <div>
            <router-link :to="'/product/' + product.id" class="text-blue-500 hover:text-blue-700">
              {{ product.name }}
            </router-link>
            - {{ product.brand }} - ${{ product.price }}
          </div>
          <div class="flex items-center">
            <input type="number" v-model.number="product.quantity" min="1"
                   class="w-16 p-1 border border-gray-300 rounded mr-2"/>
            <button @click="addToCart(product.id, product.quantity || 1)"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
    const router = useRouter();
    const route = useRoute();
    const products = ref([]);
    const categories = ref([]);
    const selectedCategory = ref('');
    const selectedProductName = ref('');
    const selectedBrand = ref('');
    const minPrice = ref('');
    const maxPrice = ref('');
    const inStockFilter = ref('');

    const initializeFilters = () => {
      selectedCategory.value = route.query.categoryId || '';
      selectedProductName.value = route.query.productName || '';
      selectedBrand.value = route.query.brand || '';
      minPrice.value = route.query.minPrice || '';
      maxPrice.value = route.query.maxPrice || '';
      inStockFilter.value = route.query.inStock || '';
    };

    const matchesProductName = (name) => {
      return !selectedProductName.value || (name && name.toLowerCase().startsWith(selectedProductName.value.toLowerCase().trim()));
    };

    const matchesBrand = (brand) => {
      return !selectedBrand.value || (brand && brand.toLowerCase().startsWith(selectedBrand.value.toLowerCase().trim()));
    };

    const matchesInStock = (stock) => {
      if (inStockFilter.value === '') return true;
      const isInStock = stock > 0;
      const filterValue = inStockFilter.value === 'true';
      return isInStock === filterValue;
    };

    const filteredProducts = computed(() => {
      return products.value.filter(product =>
          matchesProductName(product.name) &&
          matchesBrand(product.brand) &&
          matchesInStock(product.stock) &&
          (!selectedCategory.value || product.categoryId === selectedCategory.value) &&
          (!minPrice.value || product.price >= parseFloat(minPrice.value)) &&
          (!maxPrice.value || product.price <= parseFloat(maxPrice.value))
      );
    });

    function updateFilters() {
      router.push({
        path: '/produits',
        query: {
          categoryId: selectedCategory.value || undefined,
          productName: selectedProductName.value ? selectedProductName.value.trim() : undefined,
          brand: selectedBrand.value ? selectedBrand.value.trim() : undefined,
          minPrice: minPrice.value || undefined,
          maxPrice: maxPrice.value || undefined,
          inStock: inStockFilter.value || undefined
        }
      }).catch(err => console.error("Erreur lors de la mise à jour des filtres :", err));
      fetchProducts();
    }

    function fetchProducts() {
      const params = {
        categoryId: selectedCategory.value,
        productName: selectedProductName.value,
        brand: selectedBrand.value,
        minPrice: minPrice.value,
        maxPrice: maxPrice.value,
        inStock: inStockFilter.value
      };
      axios.get('http://localhost:3000/products', {params, withCredentials: true})
          .then(response => {
            products.value = response.data.map(product => ({
              ...product,
              name: product.name || '',
              brand: product.brand || '',
              quantity: 1,
              stock: product.stock !== undefined ? product.stock : 0
            }));
          })
          .catch(error => {
            console.error('Erreur lors du chargement des produits:', error);
          });
    }

    async function addToCart(productId, quantity) {
      try {
        await axios.post('http://localhost:3000/cart/add', {productId, quantity}, {withCredentials: true});
        alert("Produit ajouté au panier!");
      } catch (error) {
        console.error("Erreur lors de l'ajout au panier:", error);
        alert("Erreur lors de l'ajout au panier");
      }
    }

    onMounted(() => {
      initializeFilters();
      axios.get('http://localhost:3000/categories', {withCredentials: true})
          .then(response => {
            categories.value = response.data;
            fetchProducts();
          })
          .catch(error => {
            console.error("Erreur lors du chargement des catégories:", error);
          });
    });

    watch(route.query, () => {
      initializeFilters();
      fetchProducts();
    }, {immediate: true});

    return {
      products,
      categories,
      filteredProducts,
      selectedCategory,
      selectedProductName,
      selectedBrand,
      minPrice,
      maxPrice,
      inStockFilter,
      matchesProductName,
      matchesBrand,
      matchesInStock,
      updateFilters,
      fetchProducts,
      addToCart
    };
  }
};
</script>
