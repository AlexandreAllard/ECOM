<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-md mx-auto mt-10 px-4 py-8 bg-white shadow-lg rounded-lg">
      <h1 class="text-2xl font-bold text-center mb-6">Réinitialisation de mot de passe</h1>
      <form @submit.prevent="requestReset" class="space-y-6">
        <input
            v-model="email"
            type="email"
            placeholder="Entrez votre email"
            required
            class="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
        <button
            type="submit"
            class="w-full bg-blue-500 text-white font-bold py-3 rounded hover:bg-blue-600 transition duration-200"
        >
          Envoyer
        </button>
      </form>
      <p v-if="message" :class="{'text-green-500': isSuccess, 'text-red-500': !isSuccess}" class="mt-4 text-center">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import axios from 'axios';

const email = ref('');
const message = ref('');
const isSuccess = ref(false);

const requestReset = async () => {
  try {
    const response = await axios.post('http://localhost:3000/users/reset-password-request', {email: email.value});
    message.value = response.data.message;
    isSuccess.value = true;
  } catch (error) {
    message.value = error.response ? error.response.data.message : 'Une erreur s’est produite';
    isSuccess.value = false;
  }
};
</script>
