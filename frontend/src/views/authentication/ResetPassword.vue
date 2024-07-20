<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-md w-full px-6 py-8 bg-white shadow-lg rounded-lg">
      <h1 class="text-2xl font-bold text-center mb-6">Réinitialisation du mot de passe</h1>
      <form @submit.prevent="resetPassword" class="space-y-6">
        <input
            v-model="password"
            type="password"
            placeholder="Nouveau mot de passe"
            class="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
        >
        <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirmation"
            class="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
        >
        <button
            type="submit"
            class="w-full bg-blue-500 text-white font-bold py-3 rounded hover:bg-blue-600 transition duration-200"
        >
          Réinitialiser le mot de passe
        </button>
      </form>
      <p v-if="message" class="text-center text-red-500 mt-4">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const password = ref('');
const confirmPassword = ref('');
const message = ref('');
const token = ref(route.params.token);

const resetPassword = () => {
  if (password.value !== confirmPassword.value) {
    message.value = "Les mots de passe ne correspondent pas.";
    return;
  }
  axios.post(`${import.meta.env.VITE_API_ENDPOINT}:3000/users/reset-password/${token.value}`, { newPassword: password.value })
      .then(() => {
        message.value = "Votre mot de passe a été réinitialisé avec succès.";
      })
      .catch(() => {
        message.value = "Le lien de réinitialisation est invalide ou a expiré.";
      });
};
</script>
