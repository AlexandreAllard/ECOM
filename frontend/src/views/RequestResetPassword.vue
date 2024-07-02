<template>
  <div class="max-w-md mx-auto mt-10 px-4 py-8 bg-white shadow-lg rounded-lg">
    <h1 class="text-2xl font-bold text-center mb-6">Demande de Réinitialisation de Mot de Passe</h1>
    <form @submit.prevent="requestReset" class="space-y-6">
      <input
          v-model="email"
          type="email"
          placeholder="Entrez votre email"
          required
          class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      >
      <button
          type="submit"
          class="w-full bg-blue-500 text-white font-bold py-3 rounded hover:bg-blue-600"
      >
        Envoyer le lien de réinitialisation
      </button>
    </form>
    <p v-if="message" class="mt-4 text-center text-green-500">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      message: ''
    };
  },
  methods: {
    requestReset() {
      axios.post('http://localhost:3000/users/reset-password-request', {email: this.email})
          .then(response => {
            this.message = response.data.message;
          })
          .catch(error => {
            this.message = error.response.data.message;
          });
    }
  }
}
</script>
