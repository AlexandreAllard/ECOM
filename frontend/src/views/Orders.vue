<template>
  <div class="max-w-7xl mx-auto py-6">
    <h1 class="text-2xl font-bold mb-6">Mes Commandes</h1>
    <div v-if="loading" class="flex justify-center items-center">
      <div class="loader"></div>
    </div>
    <div v-else>
      <div v-if="orders.length === 0" class="text-center text-gray-500">
        <p>Aucune commande trouvée.</p>
      </div>
      <div v-else>
        <div v-for="order in orders" :key="order.id" class="bg-white shadow rounded-lg mb-6 p-6">
          <div class="mb-4">
            <h2 class="text-lg font-semibold">Commande ID: {{ order.id }}</h2>
            <p><span class="font-medium">Statut:</span> {{ order.status }}</p>
            <p><span class="font-medium">Total:</span> {{ order.total }} €</p>
            <p><span class="font-medium">Date de commande:</span> {{ new Date(order.createdAt).toLocaleDateString() }}</p>
          </div>
          <div>
            <h3 class="text-md font-semibold mb-2">Détails de la commande:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="item in order.items" :key="item.id" class="border rounded-lg p-4 flex items-center space-x-3">
                <img :src="item.product?.imageUrl || 'default-product-image.png'" alt="Product Image" class="w-20 h-20 object-cover rounded">
                <div>
                  <p class="text-gray-800 font-medium">{{ item.product?.name }}</p>
                  <p class="text-gray-600">Quantité: {{ item.quantity }}</p>
                  <p class="text-gray-600">Prix unitaire: {{ item.price }} €</p>
                  <p class="text-gray-600">Sous-total: {{ (item.quantity * item.price).toFixed(2) }} €</p>
                </div>
              </div>
            </div>
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
        withCredentials: true
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
  animation: spin 1s linear infinite;
  width: 50px;
  height: 50px;
  border-width: 4px;
  border-radius: 50%;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
