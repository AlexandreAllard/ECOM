<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
      <h2 class="mt-6 text-3xl font-extrabold text-center">
        Se connecter
      </h2>
      <form @submit.prevent="login" class="mt-8 space-y-6">
        <input v-model="credentials.email" type="email" placeholder="Email" required
               class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500">
        <input v-model="credentials.password" type="password" placeholder="Password" required
               class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500">
        <div>
          <button type="submit" class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  :disabled="isLoading">
            Login
          </button>
        </div>
      </form>
      <div class="flex items-center justify-between">
        <router-link to="/reset-password-request" class="font-medium text-indigo-600 hover:text-indigo-500">
          Mot de passe oublié?
        </router-link>
        <router-link to="/resend-verification" class="font-medium text-indigo-600 hover:text-indigo-500">
          Vérifier mon compte
        </router-link>
      </div>
      <p v-if="error" class="mt-4 text-center text-red-500">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const credentials = ref({ email: '', password: '' });
const error = ref('');
const isLoading = ref(false);

async function login() {
  isLoading.value = true;
  error.value = '';
  const errorMessage = await authStore.login(credentials.value);
  isLoading.value = false;
  if (!errorMessage) {
    router.push('/');
  } else {
    error.value = errorMessage;
  }
}
</script>
