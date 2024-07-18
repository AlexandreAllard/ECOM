<template>
  <div class="max-w-6xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Livraisons</h2>
    <div v-if="isLoading">
      <p>Loading deliveries...</p>
    </div>
    <div v-else>
      <div v-if="deliveries.length > 0">
        <div class="grid grid-cols-2 gap-4">
          <div v-for="delivery in deliveries" :key="delivery.id" class="bg-white shadow rounded-lg p-4">
            <h3 class="text-lg font-semibold">{{ delivery.address }}</h3>
            <p class="text-gray-600">Statut: <span :class="statusColor(delivery.status)">{{ delivery.status }}</span></p>
            <p class="text-gray-600">Commande: {{ delivery.orderId }}</p>
            <p class="text-gray-600">Mis à jour le: {{ formatDate(delivery.updatedAt) }}</p>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No deliveries found.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const id = localStorage.getItem('id');

export default {
  data() {
    return {
      deliveries: [],
      isLoading: false
    };
  },
  methods: {
    fetchDeliveries() {
      this.isLoading = true;
      axios.get(`http://localhost:3000/deliveriess/user/${id}`, { withCredentials: true })
          .then(response => {
            this.deliveries = response.data;
          })
          .catch(error => {
            console.error("Error fetching deliveries:", error);
          })
          .finally(() => {
            this.isLoading = false;
          });
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    statusColor(status) {
      switch (status) {
        case 'pending': return 'text-orange-500';
        case 'shipped': return 'text-blue-500';
        case 'delivered': return 'text-green-500';
        case 'cancelled': return 'text-red-500';
        default: return 'text-gray-500';
      }
    }
  },
  created() {
    this.fetchDeliveries();
  }
};
</script>

<style scoped>
/* You can add custom styles here if needed */
</style>
