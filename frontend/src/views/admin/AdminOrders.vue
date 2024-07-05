<template>
  <div class="max-w-7xl mx-auto py-6">
    <h1 class="text-2xl font-bold mb-4">Liste des commandes</h1>
    <div v-if="orders.length > 0" class="bg-white shadow overflow-hidden rounded-lg">
      <table class="min-w-full leading-normal">
        <thead>
        <tr>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            ID
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Utilisateur
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Total
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Détails
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Statut
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Actions
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ order.id }}</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ order.userId }}</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ order.total }} €</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <ul>
              <li v-for="detail in order.details" :key="detail.productId">
                {{ detail.name }} - {{ detail.quantity }} x {{ detail.price }} €
              </li>
            </ul>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ order.status }}</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <button @click="openModal(order)" class="text-blue-500 hover:text-blue-800"
                    :disabled="order.status !== 'completed'">
              Détails / Rembourser
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>Aucune commande trouvée.</p>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <button class="close absolute top-0 right-0 cursor-pointer px-4 py-3 text-red-500 hover:text-red-700"
                @click="closeModal">&times;
        </button>
        <h2 class="text-lg font-bold mb-4">Détails de la commande</h2>
        <div>
          <ul>
            <li v-for="detail in selectedOrder.details" :key="detail.productId">
              {{ detail.name }} - {{ detail.quantity }} x {{ detail.price }} €
            </li>
          </ul>
        </div>
        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                @click="refundOrder(selectedOrder.id)"
                :disabled="selectedOrder.status !== 'completed'">
          Rembourser
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
      orders: [],
      showModal: false,
      selectedOrder: null
    };
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get('http://localhost:3000/orders/all-orders', {
          withCredentials: true
        });
        this.orders = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
      }
    },
    openModal(order) {
      this.selectedOrder = order;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async refundOrder(orderId) {
      try {
        await axios.post(`http://localhost:3000/payment/refund/${orderId}`, {}, {
          withCredentials: true
        });
        alert('Remboursement effectué');
        this.closeModal();
        this.fetchOrders();
      } catch (error) {
        alert("Erreur lors du remboursement : " + error.response.data.message);
      }
    }
  },
  mounted() {
    this.fetchOrders();
  }
};
</script>
