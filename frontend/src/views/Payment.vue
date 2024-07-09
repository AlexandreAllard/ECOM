<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
      <div v-if="clientSecret" class="stripe-element p-4 border border-gray-300 rounded-md mb-4" id="stripe-payment-element-mount-point"></div>
      <button
          @click="submitPayment"
          :disabled="!clientSecret"
          class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Payer maintenant
      </button>
    </div>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';
import axios from "axios";

export default {
  data() {
    return {
      stripe: null,
      elements: null,
      paymentElement: null,
      clientSecret: null,
      stripePromise: loadStripe('pk_test_51PYZoFEwgUjyui5DkGcWq2us9brjOlu1DtKVHlL3Y8sPt7Uf9G6Q5b295FDq0pk4v6GQyPFnElYTmeGAmWClpb5n00PXXKp8ey'),
    };
  },
  methods: {
    async fetchClientSecret() {
      try {
        const response = await axios.post('http://localhost:3000/payment/create-payment-intent', {},{withCredentials: true});
        this.clientSecret = response.data.clientSecret;
        if (this.clientSecret) {
          this.initializeStripeElement();
        }
      } catch (error) {
        console.error('Échec lors de la récupération du client secret:', error);
      }
    },
    async initializeStripeElement() {
      this.stripe = await this.stripePromise;
      const options = {
        clientSecret: this.clientSecret,
        appearance: {}
      };
      this.elements = this.stripe.elements(options);
      this.paymentElement = this.elements.create("payment");
      this.paymentElement.mount("#stripe-payment-element-mount-point");
    },
    async submitPayment() {
      const { error, paymentIntent } = await this.stripe.confirmPayment({
        elements: this.elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?paymentIntentId=${this.clientSecret}`,
        },
      });
      if (error) {
        console.error('Échec du paiement:', error.message);
      } else {
        console.log('Paiement réussi!', paymentIntent);
        window.location.href = `${window.location.origin}/payment-success?paymentIntentId=${paymentIntent.id}`;
      }
    }
  },
    mounted() {
    this.fetchClientSecret();
  }
};
</script>
