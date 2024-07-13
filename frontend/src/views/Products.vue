<template>
  <div class="max-w-2xl mx-auto py-6">
    <h1 class="text-2xl font-bold text-center mb-6">Produits</h1>
    <div class="mb-4 flex justify-between">
      <input type="text" v-model="keyword" @input="searchProducts" placeholder="Rechercher des produits"
             class="block w-full p-2 border border-gray-300 rounded">
    </div>
    <div class="mb-4 flex justify-between">
      <select v-model="filters.categoryId" @change="fetchProducts"
              class="block w-full p-2 border border-gray-300 rounded mr-2">
        <option value="">Toutes les catégories</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
      <input type="text" v-model="filters.productName" @input="fetchProducts" placeholder="Nom du produit"
             class="block w-full p-2 border border-gray-300 rounded mr-2">
      <input type="text" v-model="filters.brand" @input="fetchProducts" placeholder="Marque"
             class="block w-full p-2 border border-gray-300 rounded mr-2">
      <input type="number" v-model.number="filters.minPrice" @input="fetchProducts" placeholder="Prix min"
             class="block w-full p-2 border border-gray-300 rounded mr-2">
      <input type="number" v-model.number="filters.maxPrice" @input="fetchProducts" placeholder="Prix max"
             class="block w-full p-2 border border-gray-300 rounded">
      <select v-model="filters.inStock" @change="fetchProducts" class="block w-full p-2 border border-gray-300 rounded">
        <option value="">Tous les produits</option>
        <option value="true">En stock</option>
        <option value="false">Hors stock</option>
      </select>
    </div>
    <ul class="space-y-4">
      <li v-for="product in products" :key="product.id" class="p-4 border border-gray-200 rounded shadow">
        <div class="flex justify-between items-center">
          <div>
            <router-link :to="'/product/' + product.id" class="text-blue-500 hover:text-blue-700">{{
                product.name
              }}
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
import axios from 'axios';
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const products = ref([]);
    const categories = ref([]);
    const keyword = ref('');

    const filters = ref({
      categoryId: route.query.categoryId || '',
      productName: route.query.productName || '',
      brand: route.query.brand || '',
      minPrice: route.query.minPrice || '',
      maxPrice: route.query.maxPrice || '',
      inStock: route.query.inStock || ''
    });

    const updateURL = () => {
      const query = {};
      Object.keys(filters.value).forEach(key => {
        if (filters.value[key]) {
          query[key] = filters.value[key];
        }
      });
      if (keyword.value) {
        query.keyword = keyword.value;
      }
      router.push({ path: '/produits', query }).catch(err => {});
    };

    const fetchProducts = async () => {
      const params = {};
      Object.keys(filters.value).forEach(key => {
        if (filters.value[key]) {
          params[key] = filters.value[key];
        }
      });
      try {
        const response = await axios.get('http://localhost:3000/products', { params, withCredentials: true });
        products.value = response.data;
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      }
    };

    const searchProducts = async () => {
      if (!keyword.value) {
        fetchProducts();
        return;
      }
      try {
        const response = await axios.get('http://localhost:3000/products/search', {
          params: { keyword: keyword.value },
          withCredentials: true
        });
        products.value = response.data;
      } catch (error) {
        console.error('Erreur lors de la recherche des produits:', error);
      }
    };

    const addToCart = async (productId, quantity) => {
      try {
        await axios.post('http://localhost:3000/cart/add', { productId, quantity }, { withCredentials: true });
        alert("Produit ajouté au panier avec succès !");
      } catch (error) {
        console.error("Erreur lors de l'ajout au panier:", error);
        alert("Erreur lors de l'ajout au panier: " + error.message);
      }
    };

    watch(filters, () => {
      updateURL();
      fetchProducts();
    }, { deep: true });

    watch(keyword, () => {
      updateURL();
      searchProducts();
    });

    onMounted(() => {
      axios.get('http://localhost:3000/categories', { withCredentials: true })
          .then(response => {
            categories.value = response.data;
          })
          .catch(error => {
            console.error("Erreur lors du chargement des catégories:", error);
          });
      fetchProducts();
    });

    return {
      products,
      categories,
      filters,
      keyword,
      fetchProducts,
      searchProducts,
      addToCart
    };
  }
};
</script>
