<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">Mes Commandes</h2>
    <div v-if="orders.length" class="bg-white shadow overflow-hidden rounded-lg">
      <table class="min-w-full leading-normal">
        <thead>
        <tr>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100">Commande ID</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100">Total</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100">Statut</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td class="px-4 py-2">{{ order.id }}</td>
          <td class="px-4 py-2">{{ order.total }} €</td>
          <td class="px-4 py-2">{{ order.status }}</td>
          <td class="px-4 py-2">
            <button
                v-if="order.status === 'completed'"
                @click="askForRefund(order.id)"
                class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded">
              Demander un remboursement
            </button>
            <span v-else-if="order.status === 'asked_refund'" class="text-yellow-600 font-bold">
                Remboursement demandé
              </span>
            <span v-else-if="order.status === 'refunded'" class="text-green-600 font-bold">
                Remboursé
              </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>Aucune commande trouvée.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: []
    };
  },
  methods: {
    fetchOrders() {
      axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/orders/user-orders`, {withCredentials: true})
          .then(response => {
            this.orders = response.data;
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des commandes:", error);
          });
    },
    askForRefund(orderId) {
      axios.patch(`${import.meta.env.VITE_API_ENDPOINT}:3000/orders/${orderId}/status`, {status: 'asked_refund'}, {withCredentials: true})
          .then(() => {
            alert('Demande de remboursement envoyée.');
            this.fetchOrders();
          })
          .catch(error => {
            console.error('Erreur lors de la demande de remboursement:', error);
            alert('Erreur lors de la demande de remboursement.');
          });
    }
  },
  mounted() {
    this.fetchOrders();
  }
};
</script>
