<template>
  <div class="max-w-6xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Alertes</h2>
    <div class="grid grid-cols-3 gap-4">
      <div v-for="subscription in subscriptions" :key="subscription.id" class="bg-white shadow rounded-lg p-4 flex flex-col justify-between">
        <div v-if="subscription.product">
          <h3 class="font-semibold text-lg">{{ subscription.product.name }}</h3>
          <p class="text-gray-600">{{ subscription.type }} - Prix: {{ subscription.product.price }}</p>
        </div>
        <div v-else>
          <h3 class="font-semibold text-lg">Produit non disponible</h3>
          <p class="text-gray-600">{{ subscription.type }}</p>
        </div>
        <button @click="deleteSubscription(subscription.id)" class="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded">
          Supprimer
        </button>
      </div>
    </div>
    <div v-if="isLoading">
      Chargement...
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      subscriptions: [],
      isLoading: false
    };
  },
  methods: {
    fetchSubscriptions() {
      this.isLoading = true;
      const userId = localStorage.getItem('id');
      axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/subscriptionss?userId=${userId}`, { withCredentials: true })
          .then(response => {
            this.subscriptions = response.data;
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des abonnements:", error);
          })
          .finally(() => {
            this.isLoading = false;
          });
    },
    deleteSubscription(id) {
      axios.delete(`${import.meta.env.VITE_API_ENDPOINT}:3000/subscriptionss/${id}`, { withCredentials: true })
          .then(() => {
            this.subscriptions = this.subscriptions.filter(subscription => subscription.id !== id);
            alert('Abonnement supprimé avec succès.');
          })
          .catch(error => {
            console.error("Erreur lors de la suppression de l'abonnement:", error);
            alert('Échec de la suppression de l\'abonnement.');
          });
    }
  },
  created() {
    this.fetchSubscriptions();
  }
};
</script>
