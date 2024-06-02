<template>
  <div>
    <form @submit.prevent="login">
      <input v-model="credentials.email" type="email" placeholder="Email">
      <input v-model="credentials.password" type="password" placeholder="Password">
      <button type="submit">Login</button>
    </form>
    <p v-if="error">{{ error }}</p>
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
