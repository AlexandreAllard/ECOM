<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Profil de l'utilisateur</h1>
    <div class="bg-white shadow rounded-lg p-6 mb-4">
      <p class="text-gray-700 mb-2">ID : {{ user.id }}</p>
      <p class="text-gray-700 mb-2">Nom : {{ user.firstname }} {{ user.lastname }}</p>
      <p class="text-gray-700 mb-2">Email : {{ user.email }}</p>
      <p class="text-gray-700 mb-4">Rôle : {{ user.role }}</p>
      <button @click="openModal" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Modifier le profil
      </button>
    </div>

    <UserOrders />

    <div class="bg-white shadow rounded-lg p-6 mt-4">
      <h2 class="text-xl font-bold mb-4">Alertes de l'utilisateur</h2>
      <ul v-if="alerts.length">
        <li v-for="alert in alerts" :key="alert.id" class="mb-2">
          <p class="text-gray-700">
            Type d'alerte : {{ formatAlertType(alert.type) }}
          </p>
          <p class="text-gray-700" v-if="alert.product">
            Produit : {{ alert.product.name }} ({{ alert.product.description }})
          </p>
          <p class="text-gray-500 text-sm">{{ new Date(alert.createdAt).toLocaleString() }}</p>
          <button @click="deleteAlert(alert.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Supprimer l'alerte
          </button>
        </li>
      </ul>
      <p v-else class="text-gray-700">Aucune alerte.</p>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <span class="close absolute top-0 right-0 cursor-pointer px-4 py-3 text-red-500 hover:text-red-700"
                @click="closeModal">&times;</span>
          <h3 class="text-lg leading-6 font-medium text-gray-900">Modifier le profil</h3>
          <form @submit.prevent="updateProfile" class="mt-2">
            <div class="mt-4" v-for="field in profileFields" :key="field">
              <label :for="field" class="block text-sm font-medium text-gray-700">{{ formatLabel(field) }}:</label>
              <input :id="field" :type="field === 'email' ? 'email' : 'text'" v-model="user[field]" required
                     class="mt-1 p-2 w-full border-gray-300 rounded-md">
            </div>
            <div class="mt-6">
              <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import UserOrders from '../components/UserOrders.vue';

export default {
  name: 'Profile',
  components: {
    UserOrders
  },
  data() {
    return {
      user: {},
      alerts: [],
      showModal: false,
      profileFields: ['firstname', 'lastname', 'email']
    };
  },
  methods: {
    fetchUser() {
      axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/users/me`, { withCredentials: true })
          .then(response => {
            this.user = response.data;
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
          });
    },
    fetchAlerts() {
      axios.get(`${import.meta.env.VITE_API_ENDPOINT}:3000/subscriptions/my-subscriptions`, { withCredentials: true })
          .then(response => {
            this.alerts = response.data;
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des alertes de l'utilisateur :", error);
          });
    },
    deleteAlert(alertId) {
      axios.delete(`${import.meta.env.VITE_API_ENDPOINT}:3000/subscriptions/${alertId}`, { withCredentials: true })
          .then(() => {
            this.alerts = this.alerts.filter(alert => alert.id !== alertId);
            alert('Alerte supprimée avec succès.');
          })
          .catch(error => {
            console.error("Erreur lors de la suppression de l'alerte :", error);
          });
    },
    updateProfile() {
      axios.put(`${import.meta.env.VITE_API_ENDPOINT}:3000/users/me`, this.user, { withCredentials: true })
          .then(() => {
            alert('Profil mis à jour avec succès.');
            this.closeModal();
          })
          .catch(error => {
            console.error('Erreur lors de la mise à jour du profil :', error);
          });
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    formatLabel(field) {
      return field.charAt(0).toUpperCase() + field.slice(1);
    },
    formatAlertType(type) {
      const types = {
        stock_change: 'Changement de stock',
        price_change: 'Changement de prix'
      };
      return types[type] || type;
    }
  },
  mounted() {
    this.fetchUser();
    this.fetchAlerts();
  }
}
</script>
