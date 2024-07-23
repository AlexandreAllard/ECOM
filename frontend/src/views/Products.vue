<template>
  <div class="max-w-7xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Produits</h2>

    <div class="mb-4 flex flex-wrap gap-4">
      <input
          v-model="searchQuery"
          @input="updateFilters"
          type="text"
          placeholder="Rechercher des produits..."
          class="flex-1 p-2 border border-gray-300 rounded"
      />

      <select v-model="selectedCategory" @change="updateFilters" class="flex-1 p-2 border border-gray-300 rounded">
        <option value="">Toutes les catégories</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
      </select>

      <input
          v-model.number="minPrice"
          @input="updateFilters"
          type="number"
          placeholder="Prix minimum"
          class="flex-1 p-2 border border-gray-300 rounded"
      />

      <input
          v-model.number="maxPrice"
          @input="updateFilters"
          type="number"
          placeholder="Prix maximum"
          class="flex-1 p-2 border border-gray-300 rounded"
      />

      <input
          v-model="brand"
          @input="updateFilters"
          type="text"
          placeholder="Marque"
          class="flex-1 p-2 border border-gray-300 rounded"
      />

      <select v-model="inStock" @change="updateFilters" class="flex-1 p-2 border border-gray-300 rounded">
        <option value="">Tous</option>
        <option value="true">En stock</option>
        <option value="false">Hors stock</option>
      </select>
    </div>

    <div v-if="isLoading" class="mt-4">
      Chargement des produits...
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="product in filteredProducts" :key="product.id" class="bg-white p-4 rounded shadow cursor-pointer" @click="viewProductDetails(product.id)">
        <img :src="product.imageUrl" alt="" class="w-full h-48 object-cover mb-4 rounded">
        <h3 class="text-lg font-bold mb-2">{{ product.name }}</h3>
        <p class="text-gray-600 mb-2">{{ product.description }}</p>
        <p class="text-xl font-semibold mb-4">{{ product.price }} €</p>
        <button @click.stop="addToCart(product)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Ajouter au panier
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
      products: [],
      searchResults: [],
      categories: [],
      searchQuery: '',
      selectedCategory: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      inStock: '',
      isLoading: false
    };
  },
  computed: {
    filteredProducts() {
      let filtered = this.products;

      if (this.searchQuery) {
        filtered = this.searchResults;
      }

      if (this.selectedCategory) {
        filtered = filtered.filter(product => product.categoryId === this.selectedCategory);
      }

      if (this.minPrice !== '') {
        filtered = filtered.filter(product => product.price >= this.minPrice);
      }

      if (this.maxPrice !== '') {
        filtered = filtered.filter(product => product.price <= this.maxPrice);
      }

      if (this.brand) {
        filtered = filtered.filter(product => product.brand && product.brand.toLowerCase().includes(this.brand.toLowerCase()));
      }

      if (this.inStock !== '') {
        if (this.inStock === 'true') {
          filtered = filtered.filter(product => product.stock > 0);
        } else {
          filtered = filtered.filter(product => product.stock === 0);
        }
      }

      return filtered;
    }
  },
  methods: {
    async fetchProducts() {
      this.isLoading = true;
      try {
        const [productsResponse, searchResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/productss`),
          this.searchQuery ? axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/productss/search`, { params: { search: this.searchQuery } }) : Promise.resolve({ data: [] })
        ]);

        this.products = productsResponse.data;
        this.searchResults = searchResponse.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/categoriess`);
        this.categories = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    },
    updateFilters() {
      const params = new URLSearchParams();

      if (this.searchQuery) {
        params.append('search', this.searchQuery);
      }

      if (this.selectedCategory) {
        params.append('categoryId', this.selectedCategory);
      }

      if (this.minPrice !== '') {
        params.append('minPrice', this.minPrice);
      }

      if (this.maxPrice !== '') {
        params.append('maxPrice', this.maxPrice);
      }

      if (this.brand) {
        params.append('brand', this.brand);
      }

      if (this.inStock !== '') {
        params.append('inStock', this.inStock);
      }

      const queryString = params.toString();
      history.pushState(null, '', '?' + queryString);
      this.fetchProducts();
    },
    viewProductDetails(productId) {
      this.$router.push({ name: 'ProductDetails', params: { id: productId } });
    },
    async addToCart(product) {
      try {
        await axios.post(`${import.meta.env.VITE_API_ENDPOINT}:3000/cartss/${product.id}`, { quantity: 1 }, { withCredentials: true });
        alert('Produit ajouté au panier avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        alert('Erreur lors de l\'ajout au panier');
      }
    }
  },
  async created() {
    const query = new URLSearchParams(window.location.search);
    this.searchQuery = query.get('search') || '';
    this.selectedCategory = query.get('categoryId') || '';
    this.minPrice = query.get('minPrice') || '';
    this.maxPrice = query.get('maxPrice') || '';
    this.brand = query.get('brand') || '';
    this.inStock = query.get('inStock') || '';
    await this.fetchCategories();
    await this.fetchProducts();
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
