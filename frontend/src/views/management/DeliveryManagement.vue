<template>
  <div class="max-w-6xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Historique des Livraisons</h2>
    <div v-if="isLoading" class="mt-4">
      Chargement...
    </div>
    <div v-else class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full leading-normal">
        <thead>
        <tr>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Livraison
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Commande
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Adresse
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
        <tr v-for="delivery in deliveries" :key="delivery.id">
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {{ delivery.id }}
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {{ delivery.orderId }}
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {{ delivery.address }}
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {{ delivery.status }}
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <button @click="openModal(delivery)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Modifier
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h3 class="text-lg leading-6 font-medium text-gray-900 text-center mb-4">Modifier le statut de la livraison</h3>
        <form @submit.prevent="updateStatus" class="space-y-4">
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Statut :</label>
            <select id="status" v-model="selectedStatus" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="mt-6 text-center flex justify-between">
            <button type="button" @click="closeModal" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Annuler
            </button>
            <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, reactive, onMounted } from 'vue';

export default {
  setup() {
    const deliveries = ref([]);
    const isLoading = ref(false);
    const showModal = ref(false);
    const selectedDelivery = ref(null);
    const selectedStatus = ref('');

    const fetchDeliveries = async () => {
      isLoading.value = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/deliveriess`, { withCredentials: true });
        deliveries.value = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des livraisons:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const openModal = (delivery) => {
      selectedDelivery.value = delivery;
      selectedStatus.value = delivery.status;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      selectedDelivery.value = null;
      selectedStatus.value = '';
    };

    const updateStatus = async () => {
      if (!selectedDelivery.value) return;
      try {
        await axios.patch(`${import.meta.env.VITE_API_ENDPOINT}:3000/deliveriess/${selectedDelivery.value.id}`,
            { status: selectedStatus.value },
            { withCredentials: true });
        alert('Statut de la livraison mis à jour avec succès.');
        fetchDeliveries();
      } catch (error) {
        console.error("Erreur lors de la mise à jour du statut de la livraison:", error);
        alert('Erreur lors de la mise à jour du statut de la livraison.');
      } finally {
        closeModal();
      }
    };

    onMounted(fetchDeliveries);

    return {
      deliveries,
      isLoading,
      showModal,
      selectedDelivery,
      selectedStatus,
      openModal,
      closeModal,
      updateStatus,
    };
  },
};
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity .5s;
}
.modal-enter, .modal-leave-to /* .modal-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
