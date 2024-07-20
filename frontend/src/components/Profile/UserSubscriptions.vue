<template>
  <div class="max-w-6xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Alertes</h2>
    <div class="grid grid-cols-3 gap-4">
      <div v-for="subscription in subscriptions" :key="subscription.id" class="bg-white shadow rounded-lg p-4 flex flex-col justify-between">
        <div>
          <h3 class="font-semibold text-lg">{{ subscription.product.name }}</h3>
          <p class="text-gray-600">{{ subscription.type }}</p>
        </div>
        <button @click="deleteSubscription(subscription.id)" class="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded">
          Supprimer
        </button>
      </div>
    </div>
    <div v-if="isLoading">
      Loading...
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
      axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/subscriptionss`, { withCredentials: true })
          .then(response => {
            this.subscriptions = response.data;
          })
          .catch(error => {
            console.error("Error fetching subscriptions:", error);
          })
          .finally(() => {
            this.isLoading = false;
          });
    },
    deleteSubscription(id) {
      axios.delete(`${import.meta.env.VITE_API_ENDPOINT}:3000/subscriptionss/${id}`, { withCredentials: true })
          .then(() => {
            this.subscriptions = this.subscriptions.filter(subscription => subscription.id !== id);
            alert('Subscription deleted successfully.');
          })
          .catch(error => {
            console.error("Error deleting subscription:", error);
            alert('Failed to delete subscription.');
          });
    }
  },
  created() {
    this.fetchSubscriptions();
  }
};
</script>
