<template>
  <div class="max-w-7xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Votre Panier</h2>

    <div v-if="isLoading" class="mt-4">
      Chargement du panier...
    </div>

    <div v-else-if="cart.items.length === 0" class="mt-4">
      Votre panier est vide.
    </div>

    <div v-else>
      <table class="min-w-full leading-normal">
        <thead>
        <tr>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Produit
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Quantité
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Prix
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Total
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Actions
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in cart.items" :key="item.id">
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {{ item.product.name }}
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <input type="number" v-model.number="item.quantity" @change="updateQuantity(item.id, item.quantity)" class="w-16 p-2 border border-gray-300 rounded">
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {{ item.product.price }} €
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {{ (item.quantity * item.product.price).toFixed(2) }} €
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <button @click="removeItem(item.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Supprimer
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="mt-4">
        <button @click="clearCart" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Vider le panier
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
      cart: {
        items: []
      },
      isLoading: false
    };
  },
  methods: {
    async fetchCart() {
      this.isLoading = true;
      try {
        const response = await axios.get('http://localhost:3000/cartss', { withCredentials: true });
        this.cart = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération du panier:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async updateQuantity(itemId, quantity) {
      if (quantity < 1) {
        alert("La quantité doit être au moins 1.");
        return;
      }

      try {
        await axios.patch(`http://localhost:3000/cartss/item/${itemId}`, { quantity }, { withCredentials: true });
        this.fetchCart();
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la quantité:', error);
      }
    },
    async removeItem(itemId) {
      try {
        await axios.delete(`http://localhost:3000/cartss/item/${itemId}`, { withCredentials: true });
        this.fetchCart();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'article du panier:', error);
      }
    },
    async clearCart() {
      try {
        await axios.delete('http://localhost:3000/cartss', { withCredentials: true });
        this.fetchCart();
      } catch (error) {
        console.error('Erreur lors du vidage du panier:', error);
      }
    }
  },
  created() {
    this.fetchCart();
  }
};
</script>

<style scoped>
/* Ajoutez ici vos styles personnalisés */
</style>
