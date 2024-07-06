<template>
  <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-2xl font-bold text-center mb-4">Votre Panier</h1>
    <div v-if="cart && cart.items.length > 0">
      <ul class="space-y-4">
        <li v-for="item in cart.items" :key="item.id" class="flex justify-between items-center bg-white p-4 rounded-lg shadow">
          <span>{{ item.product.name }} - {{ item.quantity }} x {{ item.product.price }} €</span>
          <div>
            <button @click="openQuantityModal(item)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2">Modifier la quantité</button>
            <button @click="confirmRemoval(item.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">Supprimer</button>
          </div>
        </li>
      </ul>
      <div class="text-right font-bold mt-4">Total: {{ total }} €</div>
      <div class="mt-4 flex justify-end">
        <router-link to="/payment" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Procéder au paiement</router-link>
      </div>
    </div>
    <div v-else class="text-center mt-4">
      <p>Votre panier est vide.</p>
    </div>

    <div v-if="showQuantityModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white p-6 rounded shadow-lg">
        <h2 class="font-bold text-lg mb-4">Modifier la quantité</h2>
        <p class="mb-4">Modifier la quantité pour : {{ currentItem.product.name }}</p>
        <div class="flex items-center justify-between">
          <input type="number" v-model.number="currentItem.quantity" min="1" class="border-2 border-gray-300 rounded px-2 py-1">
          <button @click="updateItem(currentItem.id, currentItem.quantity)" class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded ml-2">Enregistrer</button>
          <button @click="showQuantityModal = false" class="ml-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded">Annuler</button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white p-6 rounded shadow-lg">
        <h2 class="font-bold text-lg mb-4">Confirmer la suppression</h2>
        <p class="mb-4">Voulez-vous vraiment retirer cet article de votre panier?</p>
        <div class="flex justify-end">
          <button @click="removeItem" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded">Confirmer</button>
          <button @click="showModal = false" class="ml-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'Cart',
  data() {
    return {
      cart: null,
      showModal: false,
      showQuantityModal: false,
      currentItem: null,
      itemIdToDelete: null,
    };
  },
  computed: {
    total() {
      return this.cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0).toFixed(2);
    }
  },
  methods: {
    fetchCart() {
      axios.get('http://localhost:3000/cart', { withCredentials: true })
          .then(response => {
            this.cart = response.data;
          })
          .catch(error => {
            console.error('Erreur lors de la récupération du panier:', error);
          });
    },
    updateItem(itemId, quantity) {
      if (quantity < 1) {
        alert("La quantité doit être au moins 1");
        return;
      }
      axios.patch(`http://localhost:3000/cart/item/${itemId}`, { quantity }, { withCredentials: true })
          .then(() => {
            this.showQuantityModal = false;
            this.fetchCart();
          })
          .catch(error => {
            console.error('Erreur lors de la mise à jour de la quantité:', error);
            alert("Erreur lors de la mise à jour de la quantité");
          });
    },
    openQuantityModal(item) {
      this.currentItem = { ...item };
      this.showQuantityModal = true;
    },
    confirmRemoval(itemId) {
      this.itemIdToDelete = itemId;
      this.showModal = true;
    },
    removeItem() {
      axios.delete(`http://localhost:3000/cart/item/${this.itemIdToDelete}`, { withCredentials: true })
          .then(() => {
            this.fetchCart();
            this.showModal = false;
          })
          .catch(error => {
            console.error("Erreur lors de la suppression de l'article:", error);
          });
    }
  },
  mounted() {
    this.fetchCart();
  }
}
</script>
