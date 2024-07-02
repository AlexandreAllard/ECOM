<template>
  <div class="max-w-md mx-auto mt-10 px-6 py-8 bg-white shadow-lg rounded-lg">
    <h1 class="text-2xl font-bold text-center mb-6">Réinitialiser le Mot de Passe</h1>
    <form @submit.prevent="resetPassword" class="space-y-6">
      <input
          v-model="password"
          type="password"
          placeholder="Nouveau mot de passe"
          class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          required
      >
      <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirmez le mot de passe"
          class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          required
      >
      <button
          type="submit"
          class="w-full bg-blue-500 text-white font-bold py-3 rounded hover:bg-blue-600"
      >
        Réinitialiser le mot de passe
      </button>
    </form>
    <p v-if="message" class="text-center text-red-500 mt-4">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      password: '',
      confirmPassword: '',
      message: '',
      token: this.$route.params.token
    };
  },
  methods: {
    resetPassword() {
      if (this.password !== this.confirmPassword) {
        this.message = "Les mots de passe ne correspondent pas.";
        return;
      }
      axios.post(`http://localhost:3000/users/reset-password/${this.token}`, {newPassword: this.password})
          .then(response => {
            this.message = "Votre mot de passe a été réinitialisé avec succès.";
          })
          .catch(error => {
            this.message = "Le lien de réinitialisation est invalide ou a expiré.";
          });
    }
  }
}
</script>

