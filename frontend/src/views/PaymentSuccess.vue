<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="p-8 bg-white rounded-lg shadow max-w-lg w-full text-center">
      <h1 class="text-2xl font-bold text-green-600 mb-2">Paiement réussi!</h1>
      <p class="text-gray-800">Merci pour votre achat.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  mounted() {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentIntentId = queryParams.get('paymentIntentId');
    const address = queryParams.get('address');
    if (paymentIntentId && address) {
      this.verifyPayment(paymentIntentId, address);
    }
  },
  methods: {
    async verifyPayment(paymentIntentId, address) {
      try {
        const response = await axios.post('http://localhost:3000/payment/verify-payment', {
          paymentIntentId,
          address
        }, {withCredentials: true});
        if (response.data.success) {
          console.log('Cart cleared and payment finalized');
        } else {
          console.error('Payment verification failed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
      }
    }
  }
}
</script>
