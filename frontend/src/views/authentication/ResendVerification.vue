<template>
  <div class="max-w-md mx-auto mt-10 px-4 py-8 bg-white shadow-lg rounded-lg">
    <h1 class="text-2xl font-bold text-center mb-6">Renvoyer l'email de vérification</h1>
    <div class="space-y-6">
      <input
          v-model="email"
          type="email"
          placeholder="Entrez votre email"
          class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      />
      <button
          @click="resendVerificationEmail"
          class="w-full bg-blue-500 text-white font-bold py-3 rounded hover:bg-blue-600"
      >
        Renvoyer Email
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: ''
    };
  },
  methods: {
    async resendVerificationEmail() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_ENDPOINT}:3000/users/resend-verification`, { email: this.email });
        alert(response.data.message);
      } catch (error) {
        console.error('Error resending verification email:', error.response.data.message);
        alert(error.response.data.message);
      }
    }
  }
}
</script>
