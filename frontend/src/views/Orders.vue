<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Mes Commandes</h1>
    <div v-if="loading" class="flex justify-center items-center">
      <div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
    </div>
    <div v-else>
      <div v-if="orders.length === 0" class="text-center text-gray-500">
        <p>Aucune commande trouvée.</p>
      </div>
      <div v-else>
        <div v-for="order in orders" :key="order.id" class="bg-white shadow rounded-lg mb-6 p-6">
          <h2 class="text-xl font-semibold mb-4">Commande {{ order.id }}</h2>
          <p class="text-gray-700 mb-2"><span class="font-bold">Total:</span> {{ order.total }} €</p>
          <p class="text-gray-700 mb-2"><span class="font-bold">Statut:</span> {{ order.status }}</p>
          <p class="text-gray-700 mb-4"><span class="font-bold">Date:</span> {{ new Date(order.createdAt).toLocaleString() }}</p>
          <div>
            <h3 class="text-lg font-semibold mb-2">Détails de la commande:</h3>
            <ul>
              <li v-for="item in order.details" :key="item.productId" class="mb-2">
                <div class="flex items-center">
                  <img :src="item.imageUrl" alt="product image" class="w-16 h-16 object-cover rounded mr-4">
                  <div>
                    <p class="text-gray-800 font-medium">{{ item.name }}</p>
                    <p class="text-gray-600">Quantité: {{ item.quantity }}</p>
                    <p class="text-gray-600">Prix: {{ item.price }} €</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
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
      loading: true,
      error: null,
    };
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:3000/orders/user-orders', {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      this.orders = response.data;
    } catch (error) {
      this.error = error.response ? error.response.data.message : error.message;
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.loader {
  border-top-color: #3490dc;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
