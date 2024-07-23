<template>
  <div class="max-w-6xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Historique des Commandes</h2>

    <div class="mb-4">
      <input
          v-model="searchQuery"
          @input="searchOrders"
          type="text"
          placeholder="Rechercher par numéro de commande ou produit..."
          class="w-full p-2 border rounded"
      />
    </div>

    <div v-if="isLoading" class="mt-4">
      Chargement...
    </div>
    <div v-else class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full leading-normal">
        <thead>
        <tr>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Commande
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Client
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Date
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Montant
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Statut
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Produits
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Actions
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="order in filteredOrders" :key="order.id">
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {{ order.id }}
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {{ userEmails[order.userId] || 'Chargement...' }}
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {{ new Date(order.createdAt).toLocaleString() }}
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {{ order.total }} €
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {{ order.status }}
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <ul>
              <li v-for="item in order.items" :key="item.id" class="list-disc list-inside">
                {{ item.product.name }} (x{{ item.quantity }})
              </li>
            </ul>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <button
                v-if="order.status === 'asked_refund' || order.status === 'completed'"
                @click="refundOrder(order.id)"
                :class="{
                  'bg-red-500 hover:bg-red-700': order.status === 'asked_refund',
                  'bg-blue-500 hover:bg-blue-700': order.status === 'completed'
                }"
                class="text-white font-bold py-2 px-2 rounded"
            >
              Rembourser
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {ref, reactive, onMounted, computed} from 'vue';

export default {
  setup() {
    const orders = ref([]);
    const userEmails = reactive({});
    const isLoading = ref(false);
    const searchQuery = ref('');
    const searchResults = ref([]);

    const filteredOrders = computed(() => {
      if (!searchQuery.value) return orders.value;
      return orders.value.filter(order =>
          searchResults.value.includes(order.id)
      );
    });

    const fetchOrders = async () => {
      isLoading.value = true;
      try {
        const ordersResponse = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/orderss`, {withCredentials: true});
        orders.value = ordersResponse.data;

        await fetchUserEmails(orders.value);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const fetchUserEmails = async (orders) => {
      const userIds = [...new Set(orders.map(order => order.userId))];

      for (const userId of userIds) {
        try {
          const userResponse = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/userss/${userId}`, {withCredentials: true});
          userEmails[userId] = userResponse.data.email;
        } catch (error) {
          console.error(`Erreur lors de la récupération de l'email pour l'utilisateur ${userId}:`, error);
          userEmails[userId] = 'Inconnu';
        }
      }
    };

    const refundOrder = async (orderId) => {
      try {
        await axios.patch(`${import.meta.env.VITE_API_ENDPOINT}:3000/orderss/refund/${orderId}`, {}, {withCredentials: true});
        alert('Commande remboursée avec succès.');
        fetchOrders();
      } catch (error) {
        console.error("Erreur lors du remboursement de la commande:", error);
        alert('Échec du remboursement de la commande.');
      }
    };

    const searchOrders = async () => {
      if (!searchQuery.value) {
        searchResults.value = orders.value.map(order => order.id);
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/orderss/search?search=${searchQuery.value}`, {withCredentials: true});
        searchResults.value = response.data.map(order => order._id);
      } catch (error) {
        console.error("Erreur lors de la recherche des commandes:", error);
        searchResults.value = [];
      }
    };

    onMounted(() => {
      fetchOrders();
      searchOrders();
    });

    return {
      orders,
      userEmails,
      isLoading,
      searchQuery,
      searchOrders,
      refundOrder,
      filteredOrders,
    };
  },
};
</script>
