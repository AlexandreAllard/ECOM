<template>
  <div v-if="product" class="max-w-2xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-4">{{ product.name }}</h1>
    <p class="text-gray-700 text-lg mb-2">{{ product.description }}</p>
    <p class="text-xl font-semibold mb-4">Price: ${{ product.price }}</p>
    <div class="flex space-x-4 mb-6">
      <button @click="addToCart(product.id, 1)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">
        Add to Cart
      </button>
      <button @click="subscribeToPriceChange(product.id)" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200">
        Subscribe to Price Alerts
      </button>
      <button @click="subscribeToRestock(product.id)" class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition duration-200">
        Subscribe to Restock Alerts
      </button>
    </div>
  </div>
  <div v-else class="p-6 text-center">
    <p>Loading product details...</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      product: null
    };
  },
  methods: {
    fetchProduct() {
      const id = this.$route.params.id;
      axios.get(`http://localhost:3000/products/${id}`, {withCredentials: true})
          .then(response => {
            this.product = response.data;
          })
          .catch(error => {
            console.error("Error fetching product details:", error);
            this.product = {};
          });
    },
    addToCart(productId, quantity = 1) {
      axios.post('http://localhost:3000/cart/add', {
        productId: productId,
        quantity: quantity
      }, {withCredentials: true})
          .then(() => {
            alert("Product added to cart!");
          })
          .catch(error => {
            console.error("Error adding product to cart:", error);
            alert("Failed to add product to cart");
          });
    },
    subscribeToPriceChange(productId) {
      axios.post('http://localhost:3000/subscriptions', {
        targetId: productId,
        type: 'price_change'
      }, {withCredentials: true})
          .then(() => {
            alert("Subscribed to price change alerts!");
          })
          .catch(error => {
            console.error("Error subscribing to price change alerts:", error);
            alert("Failed to subscribe to price change alerts");
          });
    },
    subscribeToRestock(productId) {
      axios.post('http://localhost:3000/subscriptions', {
        targetId: productId,
        type: 'stock_change'
      }, {withCredentials: true})
          .then(() => {
            alert("Subscribed to restock alerts!");
          })
          .catch(error => {
            console.error("Error subscribing to restock alerts:", error);
            alert("Failed to subscribe to restock alerts");
          });
    }
  },
  mounted() {
    this.fetchProduct();
  }
};
</script>
