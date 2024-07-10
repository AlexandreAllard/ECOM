<template>
  <div class="max-w-7xl mx-auto py-6">
    <h1 class="text-2xl font-bold mb-4">Liste des commandes</h1>
    <div v-if="orders.length > 0" class="bg-white shadow overflow-hidden rounded-lg">
      <table class="min-w-full leading-normal">
        <thead>
        <tr>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Utilisateur</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Détails</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ order.id }}</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ order.userId }}</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ order.total }} €</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <ul>
              <li v-for="item in order.items" :key="item.id">
                {{ item.product.name }} - {{ item.quantity }} x {{ item.price }} €
              </li>
            </ul>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ order.status }}</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <button @click="openModal(order)" class="text-blue-500 hover:text-blue-800">Détails</button>
            <button @click="confirmRefund(order)" :disabled="order.status === 'refunded'" class="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Rembourser</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>Aucune commande trouvée.</p>
    </div>

    <div v-if="showRefundModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-lg font-bold mb-4">Confirmer le remboursement</h2>
        <p>Êtes-vous sûr de vouloir rembourser cette commande ?</p>
        <div class="flex justify-end space-x-4 mt-4">
          <button @click="closeRefundModal" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Annuler</button>
          <button @click="refundOrder(selectedOrder.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Rembourser</button>
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
      showModal: false,
      showRefundModal: false,
      selectedOrder: null
    };
  },
  methods: {
    fetchOrders() {
      axios.get('http://localhost:3000/orders/all-orders', {withCredentials: true})
          .then(response => {
            this.orders = response.data;
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des commandes:", error);
          });
    },
    openModal(order) {
      this.selectedOrder = order;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    confirmRefund(order) {
      this.selectedOrder = order;
      this.showRefundModal = true;
    },
    closeRefundModal() {
      this.showRefundModal = false;
    },
    refundOrder(orderId) {
      axios.post(`http://localhost:3000/payment/refund/${orderId}`, {}, {withCredentials: true})
          .then(() => {
            alert('Remboursement effectué');
            this.closeRefundModal();
            this.fetchOrders();
          })
          .catch(error => {
            alert("Erreur lors du remboursement : " + error.response.data.message);
          });
    }
  },
  mounted() {
    this.fetchOrders();
  }
};
</script>
