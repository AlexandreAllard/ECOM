<template>
  <div class="max-w-6xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4 text-left">Commandes</h2>
    <div class="bg-white shadow rounded-lg mb-4">
      <div v-if="isLoading">
        <p class="text-gray-700">Chargement des commandes...</p>
      </div>
      <div v-else>
        <div v-if="orders.length">
          <table class="min-w-full leading-normal">
            <thead>
            <tr>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID Commande
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Produits
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
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-100">
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {{ order.id }}
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <ul>
                  <li v-for="item in order.items" :key="item.id" class="list-disc list-inside">
                    {{ item.product.name }} (x{{ item.quantity }})
                  </li>
                </ul>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {{ order.total }} €
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <button v-if="order.status === 'completed'" @click="requestRefund(order.id)"
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Remboursement
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p class="text-gray-700">Aucune commande trouvée.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: [],
      isLoading: true
    };
  },
  methods: {
    async fetchOrders() {
      try {
        const userId = localStorage.getItem('id');
        const response = await axios.get(`http://localhost:3000/orderss/user/${userId}`, { withCredentials: true });
        this.orders = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        this.orders = [];
      } finally {
        this.isLoading = false;
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    async requestRefund(orderId) {
      try {
        await axios.patch(`http://localhost:3000/orderss/refund/ask/${orderId}`, {}, { withCredentials: true });
        alert('Demande de remboursement envoyée.');
        this.fetchOrders();
      } catch (error) {
        console.error('Erreur lors de la demande de remboursement:', error);
        alert('Erreur lors de la demande de remboursement.');
      }
    }
  },
  created() {
    this.fetchOrders();
  }
};
</script>
