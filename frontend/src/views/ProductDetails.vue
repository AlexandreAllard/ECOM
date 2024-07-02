<template>
  <div v-if="product" class="p-6">
    <h1 class="text-2xl font-bold">{{ product.name }}</h1>
    <p class="my-2">{{ product.description }}</p>
    <p class="font-semibold">Price: ${{ product.price }}</p>
    <button @click="addToCart(product.id, 1)" class="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Add to Cart
    </button>
  </div>
  <div v-else class="p-6">
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
    }
  },
  mounted() {
    this.fetchProduct();
  }
};
</script>
