<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <form @submit.prevent="login" class="p-6 bg-white rounded shadow-md">
      <div class="mb-4">
        <input v-model="credentials.email" type="email" placeholder="Email"
               class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500">
      </div>
      <div class="mb-6">
        <input v-model="credentials.password" type="password" placeholder="Password"
               class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500">
      </div>
      <button type="submit" class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Login
      </button>
    </form>
    <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const credentials = ref({ email: '', password: '' });
const error = ref('');

async function login() {
  const errorMessage = await authStore.login(credentials.value);
  if (!errorMessage) {
    router.push('/');
  } else {
    error.value = errorMessage;
  }
}
</script>
