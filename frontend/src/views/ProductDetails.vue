<template>
  <div class="max-w-7xl mx-auto p-6">
    <div v-if="isLoading" class="mt-4">
      Chargement du produit...
    </div>

    <div v-else class="bg-white p-6 rounded shadow">
      <img :src="product.imageUrl" alt="" class="w-full h-64 object-cover mb-4">
      <h2 class="text-2xl font-bold mb-4">{{ product.name }}</h2>
      <p class="text-gray-600 mb-4">{{ product.description }}</p>
      <p class="text-xl font-semibold mb-4">{{ product.price }} €</p>
      <button @click="addToCart(product)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Ajouter au panier
      </button>
      <div class="mt-4 flex space-x-4">
        <button @click="subscribeToProduct('stock_change')" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          S'abonner aux changements de stock
        </button>
        <button @click="subscribeToProduct('price_change')" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
          S'abonner aux changements de prix
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
      product: null,
      isLoading: false
    };
  },
  methods: {
    async fetchProduct() {
      this.isLoading = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/productss/${this.$route.params.id}`);
        this.product = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération du produit:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async addToCart(product) {
      try {
        await axios.post(`${import.meta.env.VITE_API_ENDPOINT}:3000/cartss/${product.id}`, { quantity: 1 }, { withCredentials: true });
        alert('Produit ajouté au panier avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        alert('Erreur lors de l\'ajout au panier');
      }
    },
    async subscribeToProduct(type) {
      try {
        await axios.post(`${import.meta.env.VITE_API_ENDPOINT}:3000/subscriptionss`, {
          targetId: this.product.id,
          type
        }, { withCredentials: true });
        alert(`Vous êtes abonné aux ${type === 'stock_change' ? 'changements de stock' : 'changements de prix'} pour ce produit.`);
      } catch (error) {
        console.error(`Erreur lors de l'abonnement aux ${type === 'stock_change' ? 'changements de stock' : 'changements de prix'}:`, error);
        alert(`Erreur lors de l'abonnement aux ${type === 'stock_change' ? 'changements de stock' : 'changements de prix'}.`);
      }
    }
  },
  async created() {
    await this.fetchProduct();
  }
};
</script>
